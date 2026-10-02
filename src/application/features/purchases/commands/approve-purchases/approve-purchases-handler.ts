import {
    approveBatch,
    validateApprovalInput,
    type PurchaseBatch,
    type ApprovalInput,
} from '../../../../../domain/purchases/purchase-batch.ts';
import {
    validateContext,
    type PurchaseContext,
} from '../../../../../domain/purchases/purchase-context.ts';
import { failure, type Result } from '../../../../../domain/common/result.ts';
import type { PurchaseBatchRepository } from '../../../../repositories/purchase-batch-repository.ts';
import type { Clock } from '../../../../services/clock.ts';

export interface ApprovePurchasesCommand extends ApprovalInput {
    readonly context: PurchaseContext;
}

export class ApprovePurchasesHandler {
    private readonly repository: PurchaseBatchRepository;
    private readonly clock: Clock;

    constructor(repository: PurchaseBatchRepository, clock: Clock) {
        this.repository = repository;
        this.clock = clock;
    }

    async execute(command: ApprovePurchasesCommand): Promise<Result<PurchaseBatch>> {
        const context = validateContext(command?.context);
        if (!context.ok) return context;
        const input = validateApprovalInput(command);
        if (!input.ok) return input;
        const current = await this.repository.find(context.value);
        if (!current) return failure('NOT_FOUND', 'No batch exists for this client and period.');
        const approved = approveBatch(current, command, this.clock.now());
        if (!approved.ok) return approved;
        return (await this.repository.save(approved.value, current.revision))
            ? approved
            : failure(
                  'CONFLICT',
                  'The batch changed during approval. Reload the current revision.',
              );
    }
}
