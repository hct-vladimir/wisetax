import {
    reviewPurchase,
    validateReviewInput,
    type PurchaseBatch,
    type ReviewInput,
} from '../../../../../domain/purchases/purchase-batch.ts';
import {
    validateContext,
    type PurchaseContext,
} from '../../../../../domain/purchases/purchase-context.ts';
import { failure, type Result } from '../../../../../domain/common/result.ts';
import type { PurchaseBatchRepository } from '../../../../repositories/purchase-batch-repository.ts';
import type { Clock } from '../../../../services/clock.ts';

export interface ReviewPurchaseCommand extends ReviewInput {
    readonly context: PurchaseContext;
}

export class ReviewPurchaseHandler {
    private readonly repository: PurchaseBatchRepository;
    private readonly clock: Clock;

    constructor(repository: PurchaseBatchRepository, clock: Clock) {
        this.repository = repository;
        this.clock = clock;
    }

    async execute(command: ReviewPurchaseCommand): Promise<Result<PurchaseBatch>> {
        const context = validateContext(command?.context);
        if (!context.ok) return context;
        const input = validateReviewInput(command);
        if (!input.ok) return input;
        const current = await this.repository.find(context.value);
        if (!current) return failure('NOT_FOUND', 'No existe un lote para este cliente y período.');
        const changed = reviewPurchase(current, command, this.clock.now());
        if (!changed.ok) return changed;
        return (await this.repository.save(changed.value, current.revision))
            ? changed
            : failure('CONFLICT', 'El lote cambió mientras revisabas. Consulta la versión actual.');
    }
}
