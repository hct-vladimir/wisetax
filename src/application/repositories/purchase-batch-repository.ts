import type { PurchaseBatch } from '../../domain/purchases/purchase-batch.ts';
import type { PurchaseContext } from '../../domain/purchases/purchase-context.ts';

export interface PurchaseBatchRepository {
    find(context: PurchaseContext): Promise<PurchaseBatch | null>;
    // null means insert-only; otherwise compare-and-swap against the stored revision.
    save(batch: PurchaseBatch, expectedRevision: number | null): Promise<boolean>;
}
