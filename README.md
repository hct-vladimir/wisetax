---
id: WISETAX-DESKTOP-GUIDE-001
type: repository-guide
document_id: WISETAX-DESKTOP-GUIDE-001
version: 0.2.0
status: Draft
created: 2026-10-01
last_reviewed: 2026-10-01
---

# WiseTax Desktop

Repositorio de implementación local de WiseTax. Rol lógico: desktop.

## Estado actual

Núcleo TypeScript de purchases ejecutable con fixtures sintéticas y repositorio en memoria. Obtener, consultar, revisar y aprobar localmente un lote, con aislamiento cliente/período y control de versiones. No hay ventana Electron/Angular, base SQLite, Playwright instalado ni integración SIN. El estado se pierde al terminar el proceso. Las decisiones include/exclude son intenciones manuales de demostración, sin clasificación ni validación tributaria.

Alcance autorizado: [EN-WTX-001](../product/specs/EN-WTX-001-purchases-foundation.md) y [TS-WTX-001](../engineering/archive/TS-WTX-001-purchases-foundation.md). Node 24.19.0/npm 11.17.0; TypeScript y tipos de Node fijados en package-lock.

## Estructura

```text
src/
    presentation/
        desktop/ipc/                 # reservado: ventana y transporte Electron
        ui/features/
            purchases/                # reservado: mesa de revisión
            rcv/                      # reservado
            declarations/             # reservado
        cli/purchases-demo.ts       # demostración ejecutable
    application/
        features/
            purchases/
                commands/
                    obtain-purchases/
                    review-purchase/
                    approve-purchases/
                queries/list-purchases/
            rcv/                      # reservado: consolidate-rcv
            declarations/             # reservado: submit-declaration
        services/                   # capacidades externas y reloj
        repositories/               # contratos de persistencia: lecturas/escrituras
        workflows/                  # reservado: coordinación durable
    domain/purchases/             # lote, decisiones, aprobación y revisiones
    infrastructure/
        sin/fixtures/               # datos simulados; sin portal
        persistence/repositories/   # implementación en memoria
        time/
        credentials/                # reservado
        files/                      # reservado
    bootstrap/                    # construcción explícita, sin contenedor
migrations/                     # reservado: SQLite futuro
tests/                          # comportamiento del núcleo
```

Implementaciones concretas se conectan únicamente desde bootstrap. Domain y Application no importan infraestructura ni dependencias de runtime. [ADR](docs/decisions/ADR-0001-desktop-architecture.md) y [estándares](docs/DESKTOP_STANDARDS.md).

## Ejecutar y verificar

```powershell
npm ci
npm run demo:purchases
npm run validate
npm run build
node dist/src/presentation/cli/purchases-demo.js
```

validate ejecuta estructura/documentos, reglas de imports, typecheck y pruebas node:test. test y demo usan TypeScript nativo de Node; tsc verifica tipos por separado. build genera JavaScript en dist, ignorado por Git. No instalar navegadores ni configurar claves para estos comandos.

La demo obtiene tres facturas ficticias, muestra el bloqueo de aprobación pendiente, registra decisiones y aprueba localmente. No es una app desktop completa; no presenta ni registra nada en el SIN.

## Próximo paso

Núcleo y contratos cerrados como base de desarrollo. Especificar persistencia SQLite y UI Electron/Angular como siguiente entrega. Mantener contexto, decisiones y aprobación por versión al conectar esos adaptadores. El flujo real y las opciones tributarias requieren revisión con el contador.

Producto e ingeniería viven en el [workspace](../README.md). Esquema y migraciones futuros pertenecerán a este repo; no habrá repo db separado para el almacenamiento embebido. Datos reales fuera del checkout. La base está registrada en commits locales; no hay remotos configurados ni push.

## Formato y persistencia

Indentación de cuatro espacios, con .editorconfig y Prettier fijado. Ejecutar npm run format para aplicar y npm run format:check para verificar. validate incluye la verificación de formato. Cambiar .editorconfig por sí solo no reescribe archivos.

Las interfaces application/repositories incluyen lecturas y escrituras. Sus implementaciones viven en infrastructure/persistence/repositories; el repositorio actual es en memoria. Los handlers de commands coordinan inserts/updates y los de queries consultan; SQL, transacciones y driver SQLite quedarán dentro de Infrastructure al implementarse.

## Cierre de la base — 2026-10-02

EN-WTX-001 Accepted; TS-WTX-001 y TS-WTX-002 Implemented y archivadas en el workspace. Estándares locales en docs/DESKTOP_STANDARDS.md y docs/VISUAL_STANDARDS.md. No quedan decisiones bloqueantes del núcleo simulado; no constituye una entrega operativa del SIN.
