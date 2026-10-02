import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createPurchasesModule } from '../src/bootstrap/create-purchases-module.ts';
import {
    FixturePurchaseSource,
    type PurchaseFixture,
} from '../src/infrastructure/sin/fixtures/fixture-purchase-source.ts';
import { InMemoryPurchaseBatchRepository } from '../src/infrastructure/persistence/repositories/in-memory-purchase-batch-repository.ts';
import { ObtainPurchasesHandler } from '../src/application/features/purchases/commands/obtain-purchases/obtain-purchases-handler.ts';
import {
    reviewPurchase,
    type PurchaseInvoice,
    type PurchaseBatch,
} from '../src/domain/purchases/purchase-batch.ts';
import type { ErrorCode, Result } from '../src/domain/common/result.ts';

const context = { clientId: 'demo-a', period: '2026-09' };
const invoice: PurchaseInvoice = {
    id: 'a-1',
    invoiceNumber: '000001',
    issuerName: 'Synthetic supplier',
    issuedOn: '2026-09-02',
    amountMinor: 125050,
};
const fixtures: readonly PurchaseFixture[] = [{ context, invoices: [invoice] }];

function unwrap<T>(result: Result<T>): T {
    if (!result.ok) assert.fail(JSON.stringify(result.error));
    return result.value;
}

function expectError<T>(result: Result<T>, code: ErrorCode) {
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.error.code, code);
}

test('synthetic journey blocks pending approval and records decision and local approval', async () => {
    const module = createPurchasesModule(fixtures);
    let batch = unwrap(await module.obtain.execute({ context }));
    assert.equal(batch.purchases[0]?.invoiceNumber, '000001');
    assert.equal(batch.purchases[0]?.amountMinor, 125050);
    expectError(
        await module.approve.execute({ context, expectedRevision: batch.revision, actor: 'demo' }),
        'REVIEW_INCOMPLETE',
    );
    batch = unwrap(
        await module.review.execute({
            context,
            invoiceId: 'a-1',
            expectedRevision: batch.revision,
            decision: 'include',
            note: 'Synthetic review',
            actor: 'demo',
        }),
    );
    assert.equal(batch.purchases[0]?.review?.decision, 'include');
    assert.equal(batch.purchases[0]?.review?.actor, 'demo');
    assert.ok(batch.purchases[0]?.review?.reviewedAt);
    batch = unwrap(
        await module.approve.execute({ context, expectedRevision: batch.revision, actor: 'demo' }),
    );
    assert.equal(batch.approval?.revision, batch.revision);
    assert.ok(batch.approval?.approvedAt);
    expectError(
        await module.approve.execute({ context, expectedRevision: batch.revision, actor: 'demo' }),
        'CONFLICT',
    );
});

test('client and period isolation covers both reads and attempted writes', async () => {
    const otherClient = { ...context, clientId: 'demo-b' };
    const otherPeriod = { ...context, period: '2026-10' };
    const module = createPurchasesModule([
        ...fixtures,
        { context: otherClient, invoices: [{ ...invoice, id: 'b-1' }] },
        { context: otherPeriod, invoices: [{ ...invoice, id: 'oct-1', issuedOn: '2026-10-02' }] },
    ]);
    for (const selected of [context, otherClient, otherPeriod])
        unwrap(await module.obtain.execute({ context: selected }));
    expectError(
        await module.review.execute({
            context: otherClient,
            invoiceId: 'a-1',
            expectedRevision: 1,
            decision: 'include',
            note: '',
            actor: 'demo',
        }),
        'NOT_FOUND',
    );
    unwrap(
        await module.review.execute({
            context,
            invoiceId: 'a-1',
            expectedRevision: 1,
            decision: 'include',
            note: '',
            actor: 'demo',
        }),
    );
    assert.equal(
        unwrap(await module.list.execute({ context: otherClient })).purchases[0]?.review,
        null,
    );
    assert.equal(
        unwrap(await module.list.execute({ context: otherPeriod })).purchases[0]?.review,
        null,
    );
    assert.equal(unwrap(await module.list.execute({ context })).revision, 2);
});

test('note-only review changes invalidate approval and stale updates leave current data intact', async () => {
    const module = createPurchasesModule(fixtures);
    unwrap(await module.obtain.execute({ context }));
    const reviewed = unwrap(
        await module.review.execute({
            context,
            invoiceId: 'a-1',
            expectedRevision: 1,
            decision: 'include',
            note: 'First note',
            actor: 'demo',
        }),
    );
    const approved = unwrap(
        await module.approve.execute({
            context,
            expectedRevision: reviewed.revision,
            actor: 'demo',
        }),
    );
    const changed = unwrap(
        await module.review.execute({
            context,
            invoiceId: 'a-1',
            expectedRevision: approved.revision,
            decision: 'include',
            note: 'New note',
            actor: 'demo',
        }),
    );
    assert.equal(changed.approval, null);
    assert.equal(changed.revision, approved.revision + 1);
    expectError(
        await module.review.execute({
            context,
            invoiceId: 'a-1',
            expectedRevision: approved.revision,
            decision: 'exclude',
            note: 'Old note',
            actor: 'demo',
        }),
        'CONFLICT',
    );
    expectError(
        await module.approve.execute({
            context,
            expectedRevision: approved.revision,
            actor: 'demo',
        }),
        'CONFLICT',
    );
    assert.equal(
        unwrap(await module.list.execute({ context })).purchases[0]?.review?.note,
        'New note',
    );
});

test('duplicate acquisition preserves decisions and revision', async () => {
    const module = createPurchasesModule(fixtures);
    unwrap(await module.obtain.execute({ context }));
    const reviewed = unwrap(
        await module.review.execute({
            context,
            invoiceId: 'a-1',
            expectedRevision: 1,
            decision: 'exclude',
            note: 'Synthetic decision',
            actor: 'demo',
        }),
    );
    expectError(await module.obtain.execute({ context }), 'CONFLICT');
    assert.deepEqual(unwrap(await module.list.execute({ context })), reviewed);
});

test('empty batch cannot be locally approved', async () => {
    const module = createPurchasesModule([{ context, invoices: [] }]);
    const empty = unwrap(await module.obtain.execute({ context }));
    assert.equal(empty.purchases.length, 0);
    expectError(
        await module.approve.execute({ context, expectedRevision: 1, actor: 'demo' }),
        'REVIEW_INCOMPLETE',
    );
});

test('malformed requests and exclusion without reason do not mutate a batch', async () => {
    const module = createPurchasesModule(fixtures);
    const initial = unwrap(await module.obtain.execute({ context }));
    for (const invalid of [
        { decision: 'exclude' as const, note: '   ', actor: 'demo', expectedRevision: 1 },
        { decision: 'include' as const, note: '', actor: '', expectedRevision: 1 },
        { decision: 'include' as const, note: '', actor: 'demo', expectedRevision: NaN },
    ]) {
        expectError(
            await module.review.execute({ context, invoiceId: 'a-1', ...invalid }),
            'INVALID_INPUT',
        );
    }
    expectError(
        await module.obtain.execute({ context: { clientId: ' demo', period: '2026-09' } }),
        'INVALID_INPUT',
    );
    expectError(
        await module.list.execute({ context: { ...context, period: '2026-13' } }),
        'INVALID_INPUT',
    );
    expectError(
        await module.approve.execute({ context, expectedRevision: 1, actor: '' }),
        'INVALID_INPUT',
    );
    assert.deepEqual(unwrap(await module.list.execute({ context })), initial);
});

test('invalid invoices are rejected before storing any batch', async () => {
    for (const invalid of [
        [{ ...invoice, amountMinor: 1.5 }],
        [{ ...invoice, amountMinor: -1 }],
        [{ ...invoice, issuedOn: '2026-09-31' }],
        [{ ...invoice, issuedOn: '2026-08-02' }],
        [invoice, invoice],
        [
            { ...invoice, amountMinor: Number.MAX_SAFE_INTEGER },
            { ...invoice, id: 'a-2' },
        ],
    ]) {
        const module = createPurchasesModule([{ context, invoices: invalid }]);
        expectError(await module.obtain.execute({ context }), 'INVALID_INPUT');
        expectError(await module.list.execute({ context }), 'NOT_FOUND');
    }
});

test('provider failure leaves no partial batch and can be retried after recovery', async () => {
    const repository = new InMemoryPurchaseBatchRepository();
    const failing = new ObtainPurchasesHandler(repository, {
        fetch: async () => {
            throw new Error('Simulated failure');
        },
    });
    await assert.rejects(failing.execute({ context }), /Simulated failure/);
    assert.equal(await repository.find(context), null);
    const recovered = new ObtainPurchasesHandler(repository, new FixturePurchaseSource(fixtures));
    assert.equal(unwrap(await recovered.execute({ context })).revision, 1);
});

test('missing fixture is an error and does not masquerade as an empty portal result', async () => {
    const module = createPurchasesModule([]);
    await assert.rejects(module.obtain.execute({ context }), /synthetic source/);
    expectError(await module.list.execute({ context }), 'NOT_FOUND');
});

test('concurrent review commands allow one write and reject the stale competitor', async () => {
    const module = createPurchasesModule(fixtures);
    unwrap(await module.obtain.execute({ context }));
    const outcomes = await Promise.all([
        module.review.execute({
            context,
            invoiceId: 'a-1',
            expectedRevision: 1,
            decision: 'include',
            note: 'First',
            actor: 'demo',
        }),
        module.review.execute({
            context,
            invoiceId: 'a-1',
            expectedRevision: 1,
            decision: 'exclude',
            note: 'Second',
            actor: 'demo',
        }),
    ]);
    assert.equal(outcomes.filter((result) => result.ok).length, 1);
    assert.equal(
        outcomes.filter((result) => !result.ok && result.error.code === 'CONFLICT').length,
        1,
    );
    assert.equal(unwrap(await module.list.execute({ context })).revision, 2);
});

test('concurrent acquisition is insert-only', async () => {
    const module = createPurchasesModule(fixtures);
    const results = await Promise.all([
        module.obtain.execute({ context }),
        module.obtain.execute({ context }),
    ]);
    assert.equal(results.filter((result) => result.ok).length, 1);
    assert.equal(
        results.filter((result) => !result.ok && result.error.code === 'CONFLICT').length,
        1,
    );
});

test('returned values cannot mutate stored state and CAS cannot bypass revision increment', async () => {
    const repository = new InMemoryPurchaseBatchRepository();
    const obtain = new ObtainPurchasesHandler(repository, new FixturePurchaseSource(fixtures));
    const batch = unwrap(await obtain.execute({ context }));
    const unsafe = batch as unknown as { purchases: { amountMinor: number }[] };
    unsafe.purchases[0]!.amountMinor = 99;
    const read = (await repository.find(context))!;
    assert.equal(read.purchases[0]?.amountMinor, invoice.amountMinor);
    const approved = {
        ...read,
        revision: 1,
        approval: { revision: 1, actor: 'demo', approvedAt: '2026-10-01T00:00:00Z' },
    } satisfies PurchaseBatch;
    assert.equal(await repository.save(approved, 1), false);
    const changed = unwrap(
        reviewPurchase(
            read,
            { invoiceId: 'a-1', expectedRevision: 1, decision: 'include', note: '', actor: 'demo' },
            '2026-10-01T00:00:00Z',
        ),
    );
    assert.equal(await repository.save(changed, 1), true);
    assert.equal(await repository.save(changed, 1), false);
    assert.equal(await repository.save(read, null), false);
});
