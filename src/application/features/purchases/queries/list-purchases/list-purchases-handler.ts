import type { PurchaseBatch } from '../../../../../domain/purchases/purchase-batch.ts';
import {
    validateContext,
    type PurchaseContext,
} from '../../../../../domain/purchases/purchase-context.ts';
import { failure, success, type Result } from '../../../../../domain/common/result.ts';
import type { PurchaseBatchRepository } from '../../../../repositories/purchase-batch-repository.ts';

export interface ListPurchasesQuery {
    readonly context: PurchaseContext;
}

export class ListPurchasesHandler {
    private readonly repository: PurchaseBatchRepository;

    constructor(repository: PurchaseBatchRepository) {
        this.repository = repository;
    }

    async execute(query: ListPurchasesQuery): Promise<Result<PurchaseBatch>> {
        const context = validateContext(query?.context);
        if (!context.ok) return context;
        const batch = await this.repository.find(context.value);
        return batch
            ? success(batch)
            : failure('NOT_FOUND', 'No batch exists for this client and period.');
    }
}
