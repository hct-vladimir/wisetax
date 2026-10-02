import { demoFixtures } from '../infrastructure/sin/fixtures/demo-purchases.ts';
import { createPurchasesModule } from './create-purchases-module.ts';

export function createDemoModule() {
    return createPurchasesModule(demoFixtures);
}
