import type { PurchaseInvoice } from '../../domain/purchases/purchase-batch.ts';
import type { PurchaseContext } from '../../domain/purchases/purchase-context.ts';

export interface PurchaseSource {
    fetch(context: PurchaseContext): Promise<readonly PurchaseInvoice[]>;
}
