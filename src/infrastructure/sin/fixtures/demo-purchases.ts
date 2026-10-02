import type { PurchaseFixture } from './fixture-purchase-source.ts';

export const demoFixtures: readonly PurchaseFixture[] = [
    {
        context: { clientId: 'demo-business-a', period: '2026-09' },
        invoices: [
            {
                id: 'demo-101',
                invoiceNumber: '000101',
                issuerName: 'Demo Supplier A',
                issuedOn: '2026-09-04',
                amountMinor: 125050,
            },
            {
                id: 'demo-102',
                invoiceNumber: '000102',
                issuerName: 'Demo Supplier B',
                issuedOn: '2026-09-12',
                amountMinor: 48990,
            },
            {
                id: 'demo-103',
                invoiceNumber: '000103',
                issuerName: 'Demo Supplier C',
                issuedOn: '2026-09-19',
                amountMinor: 32000,
            },
        ],
    },
];
