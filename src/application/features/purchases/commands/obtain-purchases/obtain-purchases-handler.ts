import { createBatch, type PurchaseBatch } from '../../../../../domain/purchases/purchase-batch.ts';
import {
    validateContext,
    type PurchaseContext,
} from '../../../../../domain/purchases/purchase-context.ts';
import { failure, type Result } from '../../../../../domain/common/result.ts';
import type { PurchaseBatchRepository } from '../../../../repositories/purchase-batch-repository.ts';
import type { PurchaseSource } from '../../../../services/purchase-source.ts';

export interface ObtainPurchasesCommand {
    readonly context: PurchaseContext;
}

export class ObtainPurchasesHandler {
    private readonly repository: PurchaseBatchRepository;
    private readonly source: PurchaseSource;

    constructor(repository: PurchaseBatchRepository, source: PurchaseSource) {
        this.repository = repository;
        this.source = source;
    }

    async execute(command: ObtainPurchasesCommand): Promise<Result<PurchaseBatch>> {
        const context = validateContext(command?.context);
        if (!context.ok) return context;
        if (await this.repository.find(context.value))
            return failure('CONFLICT', 'Ya existe un lote para este cliente y período.');
        const batch = createBatch(context.value, await this.source.fetch(context.value));
        if (!batch.ok) return batch;
        return (await this.repository.save(batch.value, null))
            ? batch
            : failure('CONFLICT', 'Otro proceso creó el lote. Consulta la versión actual.');
    }
}
