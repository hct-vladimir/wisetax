import type { PurchaseBatchRepository } from '../../../application/repositories/purchase-batch-repository.ts';
import type { PurchaseBatch } from '../../../domain/purchases/purchase-batch.ts';
import type { PurchaseContext } from '../../../domain/purchases/purchase-context.ts';

export class InMemoryPurchaseBatchRepository implements PurchaseBatchRepository {
    private readonly batches = new Map<string, PurchaseBatch>();

    private key(context: PurchaseContext): string {
        return JSON.stringify([context.clientId, context.period]);
    }

    async find(context: PurchaseContext): Promise<PurchaseBatch | null> {
        const batch = this.batches.get(this.key(context));
        return batch ? structuredClone(batch) : null;
    }

    async save(batch: PurchaseBatch, expectedRevision: number | null): Promise<boolean> {
        const key = this.key(batch.context);
        const current = this.batches.get(key);
        if (
            expectedRevision === null
                ? !!current
                : !current || current.revision !== expectedRevision
        )
            return false;
        if (
            expectedRevision === null
                ? batch.revision !== 1
                : batch.revision !== expectedRevision + 1
        )
            return false;
        // No await between comparison and replacement: atomic within this local process.
        this.batches.set(key, structuredClone(batch));
        return true;
    }
}
