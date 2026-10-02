import { createDemoModule } from '../../bootstrap/create-demo-module.ts';
import type { Result } from '../../domain/common/result.ts';

function unwrap<T>(result: Result<T>): T {
    if (!result.ok) throw new Error(`${result.error.code}: ${result.error.message}`);
    return result.value;
}

const purchases = createDemoModule();
const context = { clientId: 'demo-comercial-a', period: '2026-09' };
console.log('WiseTax — demo sintética de purchases. Almacenamiento en memoria.');
let batch = unwrap(await purchases.obtain.execute({ context }));
console.table(
    batch.purchases.map((invoice) => ({
        factura: invoice.invoiceNumber,
        proveedor: invoice.issuerName,
        centavosBOB: invoice.amountMinor,
    })),
);

const blocked = await purchases.approve.execute({
    context,
    expectedRevision: batch.revision,
    actor: 'contador-demo',
});
if (blocked.ok || blocked.error.code !== 'REVIEW_INCOMPLETE')
    throw new Error('La aprobación incompleta no se bloqueó.');
console.log('Aprobación bloqueada:', blocked.error.message);

for (const invoice of batch.purchases) {
    batch = unwrap(
        await purchases.review.execute({
            context,
            invoiceId: invoice.id,
            expectedRevision: batch.revision,
            decision: invoice.id === 'demo-103' ? 'exclude' : 'include',
            note:
                invoice.id === 'demo-103'
                    ? 'Exclusión ficticia para demostrar la revisión.'
                    : 'Decisión ficticia de demostración.',
            actor: 'contador-demo',
        }),
    );
}
batch = unwrap(
    await purchases.approve.execute({
        context,
        expectedRevision: batch.revision,
        actor: 'contador-demo',
    }),
);
const listed = unwrap(await purchases.list.execute({ context }));
console.log(
    `Aprobación local de la versión ${listed.approval?.revision}; ${listed.purchases.length} compras revisadas.`,
);
console.log(
    'Las decisiones son ficticias; no se registró ni declaró nada en el SIN. El estado se pierde al terminar.',
);
