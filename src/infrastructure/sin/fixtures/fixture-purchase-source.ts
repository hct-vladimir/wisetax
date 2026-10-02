import type { PurchaseSource } from '../../../application/services/purchase-source.ts';
import type { PurchaseInvoice } from '../../../domain/purchases/purchase-batch.ts';
import type { PurchaseContext } from '../../../domain/purchases/purchase-context.ts';

export interface PurchaseFixture {
    readonly context: PurchaseContext;
    readonly invoices: readonly PurchaseInvoice[];
}

// Development adapter only; no browser, tax classification or SIN connection.
export class FixturePurchaseSource implements PurchaseSource {
    private readonly fixtures: readonly PurchaseFixture[];

    constructor(fixtures: readonly PurchaseFixture[]) {
        this.fixtures = structuredClone(fixtures);
    }

    async fetch(context: PurchaseContext): Promise<readonly PurchaseInvoice[]> {
        const fixture = this.fixtures.find(
            (entry) =>
                entry.context.clientId === context.clientId &&
                entry.context.period === context.period,
        );
        // Missing fixture is an error, not a claim that the portal had no purchases.
        if (!fixture) throw new Error('No synthetic source is configured for this context.');
        return structuredClone(fixture.invoices);
    }
}
