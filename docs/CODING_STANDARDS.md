---
id: WISETAX-CODING-STANDARDS-001
type: repository-standards
document_id: WISETAX-CODING-STANDARDS-001
version: 0.1.0
status: Draft
language: en
created: 2026-10-02
last_reviewed: 2026-10-02
---

# WiseTax Desktop Coding Standards

## Base and scope

Apply the [local Node.js/TypeScript profile](NODE_TYPESCRIPT_PROFILE.md), the adopted cross-cutting standards in [DESKTOP_STANDARDS.md](DESKTOP_STANDARDS.md), and these repository-specific rules. Architecture follows [ADR-WTX-0001](decisions/ADR-0001-desktop-architecture.md). Product and technical specifications remain in the workspace.

All engineering content is English. Existing error codes are stable; current safe error text and synthetic CLI output are English. Future accountant-facing Spanish labels and error translations belong to Presentation localization, mapped from stable codes rather than parsed messages. Do not import localization into Domain or Application.

## Current toolchain

Node.js 24.19.0, npm 11.17.0, TypeScript 5.9.3 and Prettier 3.4.2 are pinned. Preserve strict compiler settings, including native-stripping compatibility. Source imports use .ts; the JavaScript build rewrites relative extensions. Development tests/demo run source TypeScript, while tsc independently checks types and emits the build.

No UI framework, SQLite driver or packaging tool is selected by this document. Playwright, SQLite and Electron are planned integrations; their installation and contracts require the next Technical Spec.

## Layers and vertical slices

| Layer          | Responsibility                                  | Allowed source dependencies                                      |
| -------------- | ----------------------------------------------- | ---------------------------------------------------------------- |
| Domain         | Business values, invariants and pure operations | Domain                                                           |
| Application    | Commands, queries and capability interfaces     | Application, Domain                                              |
| Infrastructure | External and persistence implementations        | Infrastructure, Application, Domain                              |
| Bootstrap      | Explicit composition                            | Bootstrap, Infrastructure, Application, Domain                   |
| Presentation   | CLI, future desktop transport and UI            | Presentation, Application, Domain; CLI/desktop may use Bootstrap |

UI source must not import Bootstrap or Infrastructure. The future renderer must not access Node, SQLite, Playwright or secrets; its validated bridge contract requires a separate implementation/security review. The current import checker covers source dependencies, not runtime renderer isolation.

Organize purchases, rcv and declarations under application/features. Keep command/query requests and handlers near their use case. Share types only when there is a real common contract. Avoid mediators and dependency containers for the current core; Bootstrap supplies implementations directly. Workflows coordinate multiple capabilities when such flows are specified.

## Repositories and services

application/repositories owns purpose-specific persistence interfaces for both reads and writes. infrastructure/persistence/repositories owns implementations, mapping and future SQL/transactions. Commands coordinate mutations; queries coordinate reads. CQRS does not require separate stores.

PurchaseBatchRepository.find reads a client/period batch. save(batch, expectedRevision) uses null for insert-only or an expected revision for a conditional update. An update advances the revision by one; failed compare-and-swap returns a conflict without overwriting state. A future SQLite adapter must implement this atomically and pass equivalent contract tests.

application/services owns external capabilities such as PurchaseSource and Clock. PurchaseSource obtains source invoices; it remains separate from local persistence when SQLite arrives. Do not rename DTOs or IPC messages to services, expose raw SQL in handlers, or add generic IRepository/UnitOfWork abstractions without a demonstrated requirement.

## Purchases contracts

The accepted synthetic foundation is defined by [TS-WTX-001](../../engineering/archive/TS-WTX-001-purchases-foundation.md). Keep client/period context explicit on reads and writes. Store invoice identifiers as text and amounts as validated nonnegative safe integer BOB minor units; also validate aggregate range. Source records must have unique IDs and valid dates in the selected period.

Manual include/exclude decisions are demonstration intent, not automated tax eligibility. Exclusion requires a reason. Reviews and approval advance revisions; a review change removes prior approval. Approval requires a nonempty fully reviewed batch and records its resulting revision. Preserve these domain rules and their tests; presentation colors must not define them.

Never equate an absent fixture with a valid empty portal result. Integration failures must not persist partial batches or replace reviewed data. Local approval and an eventual portal operation remain separate use cases.

## Future integration boundaries

Keep SIN selectors/navigation inside Infrastructure. Specify identity checks, timeouts, cancellation, session intervention and uncertain-result reconciliation before portal writes. Never let a SQLite transaction span a browser operation. Keep real credentials, cookies, data, backups and evidence outside Git; sanitize diagnostics.

Future desktop composition must define Electron main/preload/renderer boundaries, packaging and IPC validation. Do not infer that the current CLI composition is a production desktop startup design.

## Required checks and known gaps

npm run validate checks document/structure metadata, formatting, source-layer imports, strict types and 12 existing behavior tests. npm run build emits JavaScript. Run the source and compiled purchases demos for foundation changes. npm ci and validation run independently in workspace and desktop after metadata/spec changes.

Prettier enforces formatting; tsc enforces types; tools/check-architecture.mjs checks imports; node:test covers the synthetic core. English metadata is checked, but English prose and safe async/logging conventions require review. There is no general-purpose linter, packaged desktop, graphical accessibility test, SQLite or live SIN integration check yet. Add enforcement when an actual new boundary is implemented, without claiming coverage prematurely.
