import { createDemoModule } from '../../bootstrap/create-demo-module.ts';
import type { Result } from '../../domain/common/result.ts';

function unwrap<T>(result: Result<T>): T {
    if (!result.ok) throw new Error(`${result.error.code}: ${result.error.message}`);
    return result.value;
}

const purchases = createDemoModule();
const context = { clientId: 'demo-business-a', period: '2026-09' };
console.log('WiseTax — synthetic purchases demo. In-memory storage.');
let batch = unwrap(await purchases.obtain.execute({ context }));
console.table(
    batch.purchases.map((invoice) => ({
        invoice: invoice.invoiceNumber,
        supplier: invoice.issuerName,
        amountMinorBOB: invoice.amountMinor,
    })),
);

const blocked = await purchases.approve.execute({
    context,
    expectedRevision: batch.revision,
    actor: 'demo-accountant',
});
if (blocked.ok || blocked.error.code !== 'REVIEW_INCOMPLETE')
    throw new Error('Incomplete approval was not blocked.');
console.log('Approval blocked:', blocked.error.message);

for (const invoice of batch.purchases) {
    batch = unwrap(
        await purchases.review.execute({
            context,
            invoiceId: invoice.id,
            expectedRevision: batch.revision,
            decision: invoice.id === 'demo-103' ? 'exclude' : 'include',
            note:
                invoice.id === 'demo-103'
                    ? 'Synthetic exclusion to demonstrate review.'
                    : 'Synthetic demonstration decision.',
            actor: 'demo-accountant',
        }),
    );
}
batch = unwrap(
    await purchases.approve.execute({
        context,
        expectedRevision: batch.revision,
        actor: 'demo-accountant',
    }),
);
const listed = unwrap(await purchases.list.execute({ context }));
console.log(
    `Local approval of revision ${listed.approval?.revision}; ${listed.purchases.length} purchases reviewed.`,
);
console.log(
    'These decisions are synthetic; nothing was recorded or submitted to SIN. State is lost on exit.',
);
