---
id: WISETAX-DESKTOP-GUIDE-001
type: repository-guide
document_id: WISETAX-DESKTOP-GUIDE-001
version: 0.3.0
status: Draft
language: en
created: 2026-10-01
last_reviewed: 2026-10-02
---

# WiseTax Desktop

Local WiseTax implementation repository. Logical role: desktop.

## Current state

Executable TypeScript purchases core with synthetic fixtures and an in-memory repository. It obtains, lists, reviews and locally approves batches with client/period isolation and revision checks. There is no Electron/Angular window, SQLite, installed Playwright or SIN integration. State is lost when the process exits. Manual include/exclude decisions demonstrate intent; they do not classify or validate tax eligibility.

Accepted foundation: [EN-WTX-001](../product/specs/EN-WTX-001-purchases-foundation.md) and [TS-WTX-001](../engineering/archive/TS-WTX-001-purchases-foundation.md). Toolchain: Node.js 24.19.0/npm 11.17.0, with TypeScript and Node types pinned in package-lock.json.

## Structure

```text
src/
    presentation/
        desktop/ipc/                 # reserved: windows and desktop transport
        ui/features/
            purchases/               # reserved: review workbench
            rcv/                     # reserved
            declarations/            # reserved
        cli/purchases-demo.ts        # executable synthetic demo
    application/
        features/
            purchases/
                commands/
                    obtain-purchases/
                    review-purchase/
                    approve-purchases/
                queries/list-purchases/
            rcv/                     # reserved: consolidate-rcv
            declarations/            # reserved: submit-declaration
        services/                    # external capabilities and clock
        repositories/                # persistence interfaces: reads/writes
        workflows/                   # reserved: durable coordination
    domain/purchases/                # batches, decisions, approval and revisions
    infrastructure/
        sin/fixtures/                # synthetic data; no portal access
        persistence/repositories/    # in-memory implementation
        time/
        credentials/                 # reserved
        files/                       # reserved
    bootstrap/                       # explicit composition; no container
migrations/                          # reserved: future SQLite
tests/                               # core behavior
docs/                                # standards and architecture decisions
```

Bootstrap wires concrete implementations. Domain/Application do not import Infrastructure or runtime integrations. See the [ADR](docs/decisions/ADR-0001-desktop-architecture.md) and [standards index](docs/DESKTOP_STANDARDS.md).

## Run and verify

```powershell
npm ci
npm run demo:purchases
npm run validate
npm run build
node dist/src/presentation/cli/purchases-demo.js
```

validate runs document/structure, formatting, import architecture, type checking and node:test checks. Tests/demo use Node's native TypeScript support; tsc checks types separately. build emits JavaScript to ignored dist. These commands require no browser installation or credentials.

The demo obtains three fictitious invoices, demonstrates incomplete approval rejection, records simulated decisions and approves locally. It does not record or submit anything to SIN.

## Standards and language

Use the [local Node.js/TypeScript profile](docs/NODE_TYPESCRIPT_PROFILE.md) as the reusable base and [coding standards](docs/CODING_STANDARDS.md) for WiseTax specifics. [Visual standards](docs/VISUAL_STANDARDS.md) cover desktop appearance and interaction; business rules remain in specifications and Domain/Application.

Documentation, code identifiers/comments, tests, developer messages and fixtures use English. Future Spanish accountant UI copy belongs to explicit Presentation localization. Workspace specifications may use Spanish.

Four-space formatting is enforced with .editorconfig and pinned Prettier. npm run format applies formatting; format:check verifies it and is included in validate. Changing .editorconfig alone does not rewrite files.

## Persistence and next delivery

application/repositories owns read/write contracts; infrastructure/persistence/repositories owns implementations. Command handlers coordinate writes; query handlers read. Future SQL, transactions and the SQLite driver remain inside Infrastructure.

Product/engineering artifacts live in the [workspace](../README.md). Future embedded schema/migrations belong here; no separate db repository is needed. Keep real data outside the checkout.

The foundation was closed on 2026-10-02: EN-WTX-001 Accepted, TS-WTX-001/002 Implemented and archived. There are no blocking decisions for the synthetic core. Specify UI tooling/packaging and SQLite next, preserving context, decisions and revision-based approval. Real tax options and the portal workflow require accountant review. Existing commits are local; there are no configured remotes or pushes.
