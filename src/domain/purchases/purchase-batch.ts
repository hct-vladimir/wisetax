import { failure, success, type Result } from '../common/result.ts';
import { isRecord, isRevision, isText, type PurchaseContext } from './purchase-context.ts';

export type ReviewDecision = 'include' | 'exclude';

export interface PurchaseInvoice {
    readonly id: string;
    readonly invoiceNumber: string;
    readonly issuerName: string;
    readonly issuedOn: string;
    readonly amountMinor: number;
}

export interface PurchaseReview {
    readonly decision: ReviewDecision;
    readonly note: string;
    readonly actor: string;
    readonly reviewedAt: string;
}

export interface ReviewedPurchase extends PurchaseInvoice {
    readonly review: PurchaseReview | null;
}

export interface PurchaseBatch {
    readonly context: PurchaseContext;
    readonly revision: number;
    readonly purchases: readonly ReviewedPurchase[];
    readonly approval: {
        readonly revision: number;
        readonly actor: string;
        readonly approvedAt: string;
    } | null;
}

function isValidDate(value: unknown, period: string): value is string {
    if (
        typeof value !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
        !value.startsWith(period + '-')
    )
        return false;
    const date = new Date(value + 'T00:00:00.000Z');
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function createBatch(context: PurchaseContext, invoices: unknown): Result<PurchaseBatch> {
    if (!Array.isArray(invoices))
        return failure('INVALID_INPUT', 'The source did not return a valid batch.');
    const ids = new Set<string>();
    const purchases: ReviewedPurchase[] = [];
    let totalMinor = 0;
    for (const invoice of invoices) {
        if (
            !isRecord(invoice) ||
            !isText(invoice.id, 100) ||
            !isText(invoice.invoiceNumber, 100) ||
            !isText(invoice.issuerName, 300) ||
            !isValidDate(invoice.issuedOn, context.period) ||
            !Number.isSafeInteger(invoice.amountMinor) ||
            (invoice.amountMinor as number) < 0 ||
            ids.has(invoice.id)
        ) {
            return failure(
                'INVALID_INPUT',
                'The batch contains an invalid invoice or a duplicate identifier.',
            );
        }
        const amountMinor = invoice.amountMinor as number;
        totalMinor += amountMinor;
        if (!Number.isSafeInteger(totalMinor))
            return failure('INVALID_INPUT', 'The batch total exceeds the supported range.');
        ids.add(invoice.id);
        purchases.push({
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            issuerName: invoice.issuerName,
            issuedOn: invoice.issuedOn,
            amountMinor,
            review: null,
        });
    }
    return success({ context: { ...context }, revision: 1, purchases, approval: null });
}

export interface ReviewInput {
    readonly invoiceId: string;
    readonly expectedRevision: number;
    readonly decision: ReviewDecision;
    readonly note: string;
    readonly actor: string;
}

export function validateReviewInput(input: ReviewInput): Result<ReviewInput> {
    if (
        !isRecord(input) ||
        !isText(input.invoiceId, 100) ||
        !isRevision(input.expectedRevision) ||
        !isText(input.actor, 100) ||
        typeof input.note !== 'string' ||
        input.note.length > 2000 ||
        !['include', 'exclude'].includes(input.decision) ||
        (input.decision === 'exclude' && !input.note.trim())
    ) {
        return failure('INVALID_INPUT', 'Check the decision, actor and exclusion reason.');
    }
    return success(input);
}

export function reviewPurchase(
    batch: PurchaseBatch,
    input: ReviewInput,
    reviewedAt: string,
): Result<PurchaseBatch> {
    const validation = validateReviewInput(input);
    if (!validation.ok) return validation;
    if (batch.revision !== input.expectedRevision)
        return failure('CONFLICT', 'The batch changed. Reload it before reviewing.');
    if (!batch.purchases.some((purchase) => purchase.id === input.invoiceId))
        return failure('NOT_FOUND', 'The invoice does not belong to the selected batch.');
    if (!Number.isSafeInteger(batch.revision + 1))
        return failure('CONFLICT', 'The batch revision exceeds the supported range.');
    return success({
        ...batch,
        revision: batch.revision + 1,
        approval: null,
        purchases: batch.purchases.map((purchase) =>
            purchase.id !== input.invoiceId
                ? purchase
                : {
                      ...purchase,
                      review: {
                          decision: input.decision,
                          note: input.note.trim(),
                          actor: input.actor.trim(),
                          reviewedAt,
                      },
                  },
        ),
    });
}

export interface ApprovalInput {
    readonly expectedRevision: number;
    readonly actor: string;
}

export function validateApprovalInput(input: ApprovalInput): Result<ApprovalInput> {
    if (!isRecord(input) || !isRevision(input.expectedRevision) || !isText(input.actor, 100)) {
        return failure('INVALID_INPUT', 'Provide a valid revision and actor for approval.');
    }
    return success(input);
}

export function approveBatch(
    batch: PurchaseBatch,
    input: ApprovalInput,
    approvedAt: string,
): Result<PurchaseBatch> {
    const validation = validateApprovalInput(input);
    if (!validation.ok) return validation;
    if (batch.revision !== input.expectedRevision)
        return failure(
            'CONFLICT',
            'The batch changed. Review the current revision before approval.',
        );
    if (batch.approval) return failure('CONFLICT', 'This revision already has local approval.');
    if (!batch.purchases.length || batch.purchases.some((purchase) => !purchase.review)) {
        return failure(
            'REVIEW_INCOMPLETE',
            'Complete the review of a nonempty batch before approval.',
        );
    }
    if (!Number.isSafeInteger(batch.revision + 1))
        return failure('CONFLICT', 'The batch revision exceeds the supported range.');
    const revision = batch.revision + 1;
    return success({
        ...batch,
        revision,
        approval: { revision, actor: input.actor.trim(), approvedAt },
    });
}
