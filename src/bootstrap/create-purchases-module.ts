import { ObtainPurchasesHandler } from '../application/features/purchases/commands/obtain-purchases/obtain-purchases-handler.ts';
import { ReviewPurchaseHandler } from '../application/features/purchases/commands/review-purchase/review-purchase-handler.ts';
import { ApprovePurchasesHandler } from '../application/features/purchases/commands/approve-purchases/approve-purchases-handler.ts';
import { ListPurchasesHandler } from '../application/features/purchases/queries/list-purchases/list-purchases-handler.ts';
import { InMemoryPurchaseBatchRepository } from '../infrastructure/persistence/repositories/in-memory-purchase-batch-repository.ts';
import {
    FixturePurchaseSource,
    type PurchaseFixture,
} from '../infrastructure/sin/fixtures/fixture-purchase-source.ts';
import { SystemClock } from '../infrastructure/time/system-clock.ts';

// Explicit composition for the development demo. A future desktop bootstrap can
// construct the same handlers with SQLite and the real SIN adapter.
export function createPurchasesModule(fixtures: readonly PurchaseFixture[]) {
    const repository = new InMemoryPurchaseBatchRepository();
    const source = new FixturePurchaseSource(fixtures);
    const clock = new SystemClock();
    return {
        obtain: new ObtainPurchasesHandler(repository, source),
        list: new ListPurchasesHandler(repository),
        review: new ReviewPurchaseHandler(repository, clock),
        approve: new ApprovePurchasesHandler(repository, clock),
    };
}
