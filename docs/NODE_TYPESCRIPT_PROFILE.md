---
id: WISETAX-NODE-TYPESCRIPT-PROFILE-001
type: coding-profile
document_id: WISETAX-NODE-TYPESCRIPT-PROFILE-001
version: 0.1.0
status: Draft
language: en
created: 2026-10-02
last_reviewed: 2026-10-02
---

# Local Node.js and TypeScript Coding Profile

## Scope and adoption

Reusable engineering baseline for Node.js/TypeScript code. This is a local candidate for later framework promotion, not a profile shipped by the pinned framework. Do not add its ID to framework-lock.yaml or the shared manifest. Repository-specific architecture, business contracts and desktop integrations belong in [CODING_STANDARDS.md](CODING_STANDARDS.md).

The owner selected local adoption first. Draft status describes maturity; follow these local conventions for current work and record justified deviations in the assigned Technical Spec. Promotion must generalize this document, review consumers, publish a framework revision and update adoption explicitly.

## Language, naming and formatting

Use English for documentation, identifiers, comments, test descriptions, developer messages and synthetic fixtures. Product localization is an explicit presentation concern; never translate externally supplied identifiers or legal field names merely to satisfy coding style.

Use descriptive camelCase for values/functions, PascalCase for types/classes, and kebab-case filenames. Name interfaces by capability without an I prefix. Prefer named exports and small cohesive files. Four spaces, UTF-8, LF and a final newline; the repository pins its formatter. Editor settings do not format existing files automatically.

## Toolchain and modules

Pin a supported Node release, package manager and direct development tools in repository metadata and lockfiles. Use npm ci for reproducible installs; review dependency updates with their runtime/build compatibility. Keep dependency choices proportionate to a demonstrated need.

Use ESM and node: imports for Node built-ins. Keep side effects out of module initialization; startup/composition owns them. Use import type for type-only dependencies. Each execution environment must declare its module resolution and supported syntax.

Type checking and execution are separate. Node's native TypeScript support strips supported syntax and does not type-check or apply tsconfig. Run tsc --noEmit independently. If using native stripping, stay within erasable syntax and use the source extensions expected by Node; compile extensions according to the build configuration. Do not assume enums, parameter properties or decorators work in this execution mode.

## Types and validation

Enable strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes and consistent filename casing. Prefer unknown over any at untrusted boundaries, narrowing through validation. TypeScript interfaces disappear at runtime: validate external data, IPC payloads, files and persisted records before use.

Prefer discriminated unions for alternatives/results, readonly contracts where mutation is not intended, and explicit public input/output types. Avoid unchecked casts and non-null assertions in production; if unavoidable, document the invariant locally. Do not suppress type errors to make a build pass. Prefer literal unions over runtime enums when native stripping is used.

## Composition and dependencies

Express replaceable capabilities through focused interfaces. Pass implementations explicitly through constructors or functions; a container is optional, not a prerequisite. Do not instantiate concrete integrations in business use cases. Avoid generic repositories, shared utility collections or abstraction layers without a concrete consumer.

Keep domain computation deterministic where possible. Inject clocks or other variable inputs when behavior depends on them. Classes are useful for stateful capabilities; plain functions are appropriate for transformations and composition.

## Async execution and failures

Await operations whose result or completion matters. Do not use async forEach or discard rejected promises. Use concurrent execution only for independent work with defined failure handling; select Promise.all or allSettled according to the caller's contract.

Separate expected validation/conflict outcomes from unexpected integration failures. Do not catch and return empty data, false success or an unrelated error. Catch at boundaries where recovery, safe reporting or cleanup is possible. Use finally for resources that require release. Define timeouts/cancellation and retry semantics in the integration specification; never blindly retry a side effect.

Do not block the UI with synchronous I/O or heavy computation. Synchronous tooling/CLI operations are acceptable where responsiveness is not a runtime requirement.

## Data, security and observability

Choose exact representations for money and identifiers; define units and supported ranges in the consuming contract. Never log credentials, session material, tax documents or sensitive payloads. Expose stable error codes and safe diagnostics. Keep secrets and operational data outside tracked source.

Validate file paths and external input before privileged operations. Parameterize database values in implementations. Security guidance for a selected runtime or provider supplements this baseline.

## Verification and enforcement

Test observable behavior and boundary failures using synthetic data. Prefer deterministic tests with injected dependencies; avoid tests that simply repeat implementation. Separate unit/contract tests from live integration operations.

Each repository documents its exact checks and gaps. Formatting, type checking, architectural imports, runtime validation and tests cover different concerns. Manual review remains necessary for naming, safe logging, async ownership and dependency decisions. This profile does not claim an ESLint rule set exists.

References: [Node.js TypeScript support](https://nodejs.org/docs/latest-v24.x/api/typescript.html), [TypeScript strict](https://www.typescriptlang.org/tsconfig/strict.html).
