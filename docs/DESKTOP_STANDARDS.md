---
id: WISETAX-DESKTOP-STANDARDS-001
type: repository-standards
document_id: WISETAX-DESKTOP-STANDARDS-001
version: 0.1.0
status: Draft
created: 2026-10-01
last_reviewed: 2026-10-01
---

# Estándares locales de WiseTax Desktop

## Índice y alcance

Sistema de producto: [../product](../../product/README.md). Sistema técnico: [../engineering](../../engineering/README.md). Adopción y revisión: [registro](../../workspace-registry.yaml), [lock](../../framework-lock.yaml) y [guía](../../AGENTS.md).

| Área            | Fuente                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------- |
| Producto        | [STD-PRODUCT-SPEC](../../.saas/framework/standards/product/PRODUCT_SPEC_STANDARDS.md)                   |
| Technical Specs | [STD-TECH-SPEC](../../.saas/framework/standards/technical/TECHNICAL_SPEC_STANDARDS.md)                  |
| Seguridad       | [STD-SECURITY](../../.saas/framework/standards/quality/SECURE_SOFTWARE_BASELINE.md)                     |
| Evidencia       | [STD-EVIDENCE](../../.saas/framework/standards/quality/VERIFICATION_AND_EVIDENCE_STANDARD.md)           |
| Recuperación    | [STD-RELIABILITY](../../.saas/framework/standards/operations/RELIABILITY_AND_OBSERVABILITY_BASELINE.md) |
| Accesibilidad   | [STD-ACCESSIBILITY](../../.saas/framework/standards/design/ACCESSIBILITY_BASELINE.md)                   |
| Diseño          | [STD-VISUAL-DESIGN](../../.saas/framework/standards/design/VISUAL_DESIGN_BASELINE.md)                   |

Son criterios seleccionados para diseñar el producto local, con alcance proporcional a escritorio. Servicios web, hosting, telemetría cloud y multitenancy SaaS no se incorporan como funciones del MVP. La implementación deberá especificar cómo se cumplen los controles aplicables de credenciales delegadas y sesiones, sin confundirlas con contraseñas de autenticación propias.

## Convenciones iniciales

- Tooling Node.js 24 LTS; patch y npm fijados en .nvmrc y packageManager.
- TypeScript 5.9.3 con strict, imports type y sintaxis erasable; Node ejecuta demo/tests, tsc verifica tipos y genera build. UI pendiente de Technical Spec posterior.
- Playwright como biblioteca de automatización; pruebas separadas de las operaciones reales.
- SQLite embebido y migrations dentro del repo; driver y esquema por especificar.
- La UI invoca workflows, que coordinan automatización y persistencia; no mezclar selectores del SIN con componentes de revisión.
- Importes con representación exacta, identificadores de factura conservados como texto cuando corresponda, contexto cliente/período explícito.
- Aprobaciones con versión de datos; escrituras con verificación posterior y reconciliación ante resultado incierto.
- Fixtures sintéticas y pruebas de aislamiento, recuperación y ausencia de doble ejecución cuando se implemente el flujo.
- Credenciales, cookies y datos reales fuera de Git; logs sin payloads sensibles.

## Checks disponibles

npm ci instala el lock. npm run validate ejecuta documentos/estructura, reglas de imports, typecheck y pruebas del núcleo. npm run build genera JavaScript; npm run demo:purchases ejecuta el recorrido sintético. No hay empaquetado ni integración SIN verificados.

## Arquitectura adoptada y UI en refinamiento

[ADR-WTX-0001](decisions/ADR-0001-desktop-architecture.md) establece Presentation/Application/Domain/Infrastructure y features por módulo con CQRS. Usar interfaces y construcción explícita en bootstrap, sin contenedor de dependencias; no instanciar integraciones concretas dentro de los casos de uso. [VISUAL_STANDARDS.md](VISUAL_STANDARDS.md) registra la dirección visual Draft. El framework de interfaz y empaquetado permanece pendiente de Technical Spec.

## Núcleo purchases actual

[TS-WTX-001](../../engineering/archive/TS-WTX-001-purchases-foundation.md) define los contratos. Repositorio volátil con compare-and-swap; decisiones include/exclude manuales y aprobación local por versión. Cada revisión o aprobación avanza la revisión. Un cambio de decisión o nota elimina la aprobación. Excluir exige motivo. No implementar elegibilidad tributaria automática mediante estos valores.

## Formato y contratos de persistencia

- Cuatro espacios, UTF-8 y LF. .editorconfig orienta al editor; npm run format aplica Prettier 3.4.2 y npm run format:check lo comprueba. Ambos repositorios tienen configuración propia. No formatear el framework o repositorios anidados desde el workspace.
- application/repositories contiene contratos de lectura/escritura; infrastructure/persistence/repositories contiene implementaciones. application/services incluye Clock y PurchaseSource. No conservar carpetas common vacías.
- Repositorios específicos de la capacidad; evitar un IRepository genérico y abstraer SQL/driver/transactions dentro de Infrastructure. CQRS organiza casos de uso; no exige almacenes separados. Para proyecciones complejas futuras, añadir consultas específicas cuando exista necesidad.
- [TS-WTX-002](../../engineering/archive/TS-WTX-002-repository-layout-and-formatting.md) registra esta reorganización sin cambios de comportamiento ni conexiones DB.
