---
id: WISETAX-DESKTOP-AGENTS-001
type: agent-guide
document_id: WISETAX-DESKTOP-AGENTS-001
version: 0.2.0
status: Draft
language: en
created: 2026-10-01
last_reviewed: 2026-10-02
---

# WiseTax Desktop Agent Guide

First read the [workspace guide](../AGENTS.md), registry, lock and standards under ../.saas/framework. Then read [DESKTOP_STANDARDS.md](docs/DESKTOP_STANDARDS.md), its linked local profile/coding/visual standards, the assigned product/technical sources and affected code.

- Logical role: desktop. Do not rename it app or assume a mobile product.
- Keep product artifacts in ../product and all Technical Specs/intake in ../engineering.
- Use English documentation, code identifiers/comments, tests, developer output and synthetic data. Workspace specifications may use Spanish. Future Spanish product copy belongs to Presentation localization.
- Separate Presentation, Domain, Application, automation and persistence. Use interfaces and explicit Bootstrap composition; no container is needed.
- The owner authorized the structure and synthetic purchases core through EN-WTX-001/TS-WTX-001. Current language/standards refinement follows TS-WTX-003. Discovery drafts do not authorize tax operations.
- Apply the local Node.js/TypeScript profile and WiseTax overlay; do not misrepresent them as shared framework profiles.
- Visual standards cover presentation, including semantic colors. Business states, transitions, approval conditions and retry rules belong to specifications and Domain/Application.
- Never track secrets, sessions, tax data or real receipts/evidence in Git.
- Do not connect to SIN, create a real-data database or submit declarations during checks.
- Do not install browsers or choose a UI framework/SQLite driver without the relevant technical decision.
- Check Git status independently and preserve unrelated changes. Never commit or push without an explicit request.
- After metadata/spec changes, run npm ci and npm run validate in the workspace and independently in desktop for its affected scope.
