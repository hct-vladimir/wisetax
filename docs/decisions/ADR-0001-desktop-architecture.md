---
id: ADR-WTX-0001
type: decision-record
decision_id: ADR-WTX-0001
version: 0.1.0
status: Accepted
language: en
created: 2026-10-01
last_reviewed: 2026-10-02
---

# ADR-WTX-0001: Desktop Clean Architecture with module slices

## Context

Before TS-WTX-001, desktop was a scaffold without functional code. Node.js/TypeScript, Playwright and SQLite were the intended direction; UI, packaging and the database driver had not been selected.

The owner agreed on Presentation, Application, Domain and Infrastructure; purchases, rcv and declarations modules; commands/queries by use case; and interfaces with implementations assembled explicitly without a dependency container. MedhPortal provides a conceptual reference, without importing its .NET, MediatR, EF Core or database-first obligations.

Product sources: [0.1 scope](../../../product/drafts/DRAFT-20261001-wisetax-v0.1.md) and [first slice/UI](../../../product/drafts/DRAFT-20261001-first-slice-and-ui.md). These remain drafts; this ADR does not authorize tax operations.

## Decision

Organize src into presentation, application, domain, infrastructure and bootstrap. Group features in application/features by purchases, rcv and declarations. Add minimal client/context modeling only where needed by a specified flow.

Each module groups commands and queries by operation. Requests, handlers, results and validation belong near the slice; do not move types to shared merely because a file grows. Centralize only genuinely common module contracts/rules.

- presentation/desktop: window lifecycle and local communication, with thin transport handlers.
- presentation/ui/features: components, interaction and view state.
- application/features: use cases, validation and coordination.
- application/services: interfaces for external capabilities and variable inputs, such as SIN integration, files and Clock.
- application/repositories: persistence read/write interfaces (the finalized location from TS-WTX-002).
- application/workflows: durable coordination across purchases, RCV and forms.
- domain: business values, rules, states and approvals, without Electron/Playwright/SQLite imports.
- infrastructure: SIN/Playwright, persistence/SQLite, credential and file implementations.
- bootstrap: explicit composition of concrete implementations and use cases.

Keep input/output contracts near the use case. IPC channel details belong to presentation/desktop/ipc; DTOs/messages are not services.

Do not require a DI container, injection decorators or mediator. Bootstrap constructs objects/functions and supplies implementations. Application does not instantiate concrete adapters. Manual composition preserves dependency inversion.

obtain-purchases is a command when it saves a local batch; list-purchases is a query. Keep local approve-purchases separate from a future apply-approved-purchases portal operation.

The planned workflow persists client/period context and independent RCV/form progress. No SQLite transaction spans SIN. Reconcile an uncertain external side effect before retrying. Persistent workflow state does not restore a valid browser session automatically.

## Dependencies

Application depends on Domain and its own interfaces; Infrastructure implements those interfaces. Presentation uses Application through the appropriate transport. The composition root connects concrete implementations across layers.

If Electron is selected, the renderer must not import SQLite, Playwright, credentials or privileged handlers. Its bridge exposes specific validated operations. SIN automation must not block the UI; the concrete process model belongs to a Technical Spec.

## Alternatives considered

- Global technical folders: easy scaffold, weaker use-case locality as code grows.
- Slices without outer boundaries: fast initially, but couple rules to SIN selectors/storage.
- Clean Architecture with many mandatory layers/projects: excessive ceremony at this volume.
- DI container/mediator: unnecessary for initial slices; manual composition is sufficient.
- Microservices or comprehensive event sourcing: outside current local scope.

## Consequences

Synthetic integrations make use cases testable and persistence replaceable with bounded work. The terminology remains familiar within the portfolio. Import rules are necessary, and services must not become classes containing every use case.

A later SaaS migration still needs its own authentication, authorization, isolation, synchronization and deployment design.

Electron + Angular remains a proposal. Angular is not required by Electron; if selected for UI, it does not introduce a container into the Application engine.

## Verification and review triggers

Planned integration checks: layer/renderer imports, handler behavior with simulated interfaces, persistence/reopen, client/period isolation, approval invalidation, reconciliation without duplicate writes, IPC contracts and desktop build.

Initial scaffold checks covered only documents/structure. Current synthetic core checks additionally cover formatting, imports, types and behavior tests; they do not establish SIN/SQLite or renderer properties.

Revisit for new UI/runtime choices, multiple executors, parallelism, multi-device synchronization, a remote backend or SaaS deployment design.

## Adoption and historical clarification

The owner accepted this layer/composition direction and requested reorganization plus initial code on 2026-10-01. [TS-WTX-001](../../../engineering/archive/TS-WTX-001-purchases-foundation.md) applies it to the synthetic core; UI/SQLite remain later scope.

At the owner's request, [TS-WTX-002](../../../engineering/archive/TS-WTX-002-repository-layout-and-formatting.md) finalized application/repositories, infrastructure/persistence/repositories and Clock in application/services. These replace the initial application/common/interfaces location, preserving dependency direction and contracts. Repositories cover reads and writes. tools/check-architecture.mjs checks the implemented source boundaries.

The 2026-10-02 English translation preserves the accepted architecture and this clarification; it does not select a UI framework or database driver.

## Links

- [Local standards](../DESKTOP_STANDARDS.md).
- [Engineering](../../../engineering/README.md).
- [Decision Record Standard](../../../.saas/framework/standards/architecture/DECISION_RECORD_STANDARD.md).
