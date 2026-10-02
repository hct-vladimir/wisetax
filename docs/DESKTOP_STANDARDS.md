---
id: WISETAX-DESKTOP-STANDARDS-001
type: repository-standards
document_id: WISETAX-DESKTOP-STANDARDS-001
version: 0.2.0
status: Draft
language: en
created: 2026-10-01
last_reviewed: 2026-10-02
---

# WiseTax Desktop Standards Index

## Ownership and adopted baseline

Product system of record: [product](../../product/README.md). Technical system of record: [engineering](../../engineering/README.md). Framework identity/adoption: [registry](../../workspace-registry.yaml), [lock](../../framework-lock.yaml) and [workspace guide](../../AGENTS.md).

| Area            | Shared source                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------------- |
| Product         | [STD-PRODUCT-SPEC](../../.saas/framework/standards/product/PRODUCT_SPEC_STANDARDS.md)                   |
| Technical Specs | [STD-TECH-SPEC](../../.saas/framework/standards/technical/TECHNICAL_SPEC_STANDARDS.md)                  |
| Security        | [STD-SECURITY](../../.saas/framework/standards/quality/SECURE_SOFTWARE_BASELINE.md)                     |
| Evidence        | [STD-EVIDENCE](../../.saas/framework/standards/quality/VERIFICATION_AND_EVIDENCE_STANDARD.md)           |
| Reliability     | [STD-RELIABILITY](../../.saas/framework/standards/operations/RELIABILITY_AND_OBSERVABILITY_BASELINE.md) |
| Accessibility   | [STD-ACCESSIBILITY](../../.saas/framework/standards/design/ACCESSIBILITY_BASELINE.md)                   |
| Visual design   | [STD-VISUAL-DESIGN](../../.saas/framework/standards/design/VISUAL_DESIGN_BASELINE.md)                   |

Apply controls proportionately to a local desktop product. Web hosting, cloud telemetry and SaaS multitenancy are not added as MVP features. Future integration specs must address delegated credentials and sessions explicitly. Shared standards retain their source status; this document does not approve them.

## Local extension layers

| Document                                                   | Responsibility                                                           |
| ---------------------------------------------------------- | ------------------------------------------------------------------------ |
| [NODE_TYPESCRIPT_PROFILE.md](NODE_TYPESCRIPT_PROFILE.md)   | Portable local coding baseline; candidate for later framework promotion  |
| [CODING_STANDARDS.md](CODING_STANDARDS.md)                 | WiseTax architecture, purchases/persistence contracts and checks         |
| [VISUAL_STANDARDS.md](VISUAL_STANDARDS.md)                 | Desktop layout, semantic appearance, keyboard, scaling and accessibility |
| [ADR-WTX-0001](decisions/ADR-0001-desktop-architecture.md) | Accepted layer/slice organization and explicit composition               |

The local coding profile is not in framework v0.6.0; do not add it to the lock or manifest until a separate shared revision is published/adopted. Local refinements must not silently weaken the adopted cross-cutting baseline. Record a conflict/exception with criterion, reason, impact, owner, review/remediation date and applicable approval path in the assigned specification.

## Language and current implementation

Engineering documents and implementation content use English. Workspace specs and discovery artifacts may use Spanish. Future Spanish UI content is localized in Presentation. Visual guidance must not define business transitions or tax treatment.

The current implementation is the synthetic purchases core with in-memory persistence and manual decisions. [TS-WTX-001](../../engineering/archive/TS-WTX-001-purchases-foundation.md) defines its contracts, [TS-WTX-002](../../engineering/archive/TS-WTX-002-repository-layout-and-formatting.md) records layout/formatting, and [TS-WTX-003](../../engineering/archive/TS-WTX-003-english-documentation-and-desktop-standards.md) records this refinement.

Planned Playwright/SIN, embedded SQLite, Electron/UI and packaging need their own specifications. Approval, reconciliation and operational isolation are engineering/product concerns documented by those sources, not by visual state tables.

## Available checks

npm ci installs the lock. npm run validate checks documents/structure, formatting, architecture imports, strict types and the synthetic behavior suite. npm run build emits JavaScript; npm run demo:purchases executes the synthetic flow. No packaged UI, SQLite or SIN integration is verified.
