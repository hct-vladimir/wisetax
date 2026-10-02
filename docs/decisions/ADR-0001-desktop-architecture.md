---
id: ADR-WTX-0001
type: decision-record
decision_id: ADR-WTX-0001
version: 0.1.0
status: Accepted
created: 2026-10-01
last_reviewed: 2026-10-01
---

# ADR-WTX-0001: Desktop con Clean Architecture y slices por módulo

## Contexto

Observed antes de TS-WTX-001: desktop contenía un scaffold sin código funcional. El producto utiliza Node.js/TypeScript, Playwright y SQLite como dirección prevista; interfaz, empaquetado y driver aún no se han seleccionado.

La conversación acuerda Presentation, Application, Domain e Infrastructure; agrupación purchases, rcv y declarations; comandos/consultas por caso de uso; interfaces con implementaciones y ensamblado explícito sin contenedor de dependencias. Se toma la organización de MedhPortal como referencia conceptual, sin copiar sus obligaciones .NET, MediatR, EF Core ni database-first.

Fuente de producto: [alcance 0.1](../../../product/drafts/DRAFT-20261001-wisetax-v0.1.md) y [primera slice/UI](../../../product/drafts/DRAFT-20261001-first-slice-and-ui.md). Son drafts: este ADR no autoriza implementación tributaria.

## Decisión

Organizar src en presentation, application, domain, infrastructure y bootstrap. Features dentro de application/features, con módulos purchases, rcv y declarations. Añadir clientes/contexto mínimo solo donde el recorrido lo requiera.

Cada módulo agrupa commands y queries por operación. Request, handler, resultado y validación pertenecen a la slice; no mover tipos a shared solo por tamaño. Centralizar únicamente tipos/reglas realmente comunes del módulo.

- presentation/desktop: lifecycle de ventanas y comunicación local; handlers de transporte delgados.
- presentation/ui/features: componentes, interacción y estado de vista.
- application/features: casos de uso, validación y coordinación.
- application/services: interfaces de capacidades externas que necesitan los casos de uso, como integración SIN y archivos.
- application/common/interfaces: interfaces de persistencia y dependencias transversales necesarias.
- application/workflows: coordinación durable entre compras, RCV y formularios.
- domain: reglas, estados, aprobaciones y valores de negocio, sin imports Electron/Playwright/SQLite.
- infrastructure: implementaciones SIN/Playwright, persistencia/SQLite, credenciales y archivos.
- bootstrap: punto de composición explícita de implementaciones y casos de uso.

Los contratos de entrada/salida se conservan junto al caso de uso. Los detalles de canales IPC pertenecen a presentation/desktop/ipc; no llamar services a DTOs o mensajes.

No usar contenedor DI, decoradores de inyección o mediador obligatorio. Bootstrap construye objetos o funciones y pasa las implementaciones requeridas. Application no instancia directamente sus adaptadores concretos. Este ensamblado manual conserva la inversión de dependencias aunque no utilice una biblioteca DI.

Obtain-purchases es comando si guarda un lote local; list-purchases es consulta. Separar approve-purchases local de apply-approved-purchases en el portal.

El workflow guarda estado por cliente/período y seguimiento independiente de RCV y cada formulario. Ninguna transacción SQLite abarca el SIN. Tras efecto externo incierto, reconciliar antes de reintentar. Persistir estado no implica restaurar una sesión de navegador válida.

## Dependencias

Application depende de Domain y de sus propias interfaces; Infrastructure depende de esas interfaces y las implementa. Presentation usa la superficie pública de Application a través del transporte apropiado. Solo el punto de composición conecta clases concretas de distintas capas.

Si se elige Electron, renderer no importa SQLite, Playwright, credenciales ni handlers privilegiados. El puente expone operaciones concretas validadas. La integración SIN debe ejecutarse sin bloquear la UI; el proceso concreto se define en Technical Spec.

## Alternativas consideradas

- Carpetas técnicas globales: fácil scaffold, peor localidad cuando crece cada caso de uso.
- Slices sin fronteras externas: rápidas al inicio, pero acoplan reglas a selectores SIN y almacenamiento.
- Clean Architecture con muchas capas/proyectos obligatorios: mayor ceremonial para este volumen.
- Contenedor DI y mediador: no necesarios para las primeras slices; ensamblado manual suficiente.
- Microservicios o event sourcing integral: fuera del alcance local actual.

## Consecuencias

Permite probar workflows con integración SIN simulada y reemplazar la persistencia con trabajo acotado. Mantiene terminología familiar del portfolio. Exige controlar imports y no convertir services en clases que concentren todos los casos de uso.

No garantiza una migración SaaS automática: autenticación, autorización, aislamiento, sincronización y despliegue seguirán necesitando diseño propio.

Electron + Angular es una propuesta pendiente. Angular no es requisito de Electron. Su uso en la UI, si se selecciona, no añade contenedor al motor Application.

## Verificación prevista

Cuando exista implementación: typecheck; reglas de imports entre capas y renderer; pruebas de handlers con interfaces simuladas; persistencia/reapertura; aislamiento por cliente/período; invalidación de aprobaciones; reconciliación sin doble escritura; contratos IPC y build de desktop.

La validación actual solo comprueba estructura y documentos. No se presenta como prueba funcional de estas propiedades.

## Disparadores de revisión

Nuevas decisiones de UI/runtime, varios ejecutores, paralelismo, necesidad de sincronización entre equipos, backend remoto o primer diseño de despliegue SaaS.

## Enlaces

- [Estándares locales](../DESKTOP_STANDARDS.md).
- [Engineering](../../../engineering/README.md).
- [Decision Record Standard](../../../.saas/framework/standards/architecture/DECISION_RECORD_STANDARD.md).

## Adopción de la estructura

El propietario aceptó las propuestas y solicitó reorganización y código inicial el 2026-10-01. Se acepta la dirección de capas y composición manual. [TS-WTX-001](../../../engineering/archive/TS-WTX-001-purchases-foundation.md) aplica esta decisión al núcleo simulado; Electron/Angular y SQLite siguen pendientes para una entrega posterior. La arquitectura se comprueba con tools/check-architecture.mjs.

## Aclaración de ubicación — 2026-10-01

A solicitud del propietario, [TS-WTX-002](../../../engineering/archive/TS-WTX-002-repository-layout-and-formatting.md) concreta los contratos de persistencia en application/repositories, sus implementaciones en infrastructure/persistence/repositories y Clock en application/services. Estas ubicaciones reemplazan la carpeta common/interfaces de la descripción inicial; la dirección de dependencias y los contratos permanecen iguales. Repositorios cubren lecturas y escrituras. La validación actual también incluye typecheck, formato y las pruebas del núcleo simulado; las propiedades del SIN/SQLite siguen pendientes.
