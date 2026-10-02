---
id: WISETAX-VISUAL-STANDARDS-001
type: repository-standards
document_id: WISETAX-VISUAL-STANDARDS-001
version: 0.2.0
status: Draft
language: en
created: 2026-10-01
last_reviewed: 2026-10-02
---

# WiseTax Desktop Visual Standards

## Scope and baseline

Draft visual direction for the future desktop UI; no graphical interface is implemented. Extend [STD-VISUAL-DESIGN](../../.saas/framework/standards/design/VISUAL_DESIGN_BASELINE.md) and [STD-ACCESSIBILITY](../../.saas/framework/standards/design/ACCESSIBILITY_BASELINE.md) with desktop conventions. These cross-cutting UI baselines apply to desktop interfaces too. Electron presents HTML-based content, so web accessibility principles still apply alongside native window behavior.

This document defines appearance, layout, interaction presentation and visual accessibility. It does not define tax eligibility, approval conditions, workflow transitions, persistence, session handling or retry policy. Those belong to product/technical specifications and Application/Domain. A feature may map its specified status to a semantic visual role below without deriving business meaning from a color.

The direction is independent of Angular or other component libraries. UI tooling and final theme scope require their own specification.

## Window and workspace composition

Prefer the native Windows frame, title bar and minimize/maximize/close controls initially. Custom chrome needs a demonstrated benefit and validation of dragging, resizing, keyboard access and system controls.

Use a restrained workbench layout: compact navigation, page title/context region, primary content area, and optional detail pane. Prefer a table with adjacent detail for dense records. On narrower windows, place detail below content or use an accessible secondary view. Navigation, primary actions and readable content must remain reachable.

Define and test a practical minimum window size during UI implementation; do not choose it solely to fit a fixed mockup. Support maximize and restored layouts. Restore saved window bounds only when visible on the current monitor configuration. Keep menus/dialogs within visible bounds.

Use logical CSS sizes and flexible containers. Validate Windows scaling at 100%, 125%, 150% and 200%, movement between monitors and in-app zoom. Do not shrink fonts to fit columns or depend on physical pixels.

## Typography, spacing and density

Use the system font stack, with Segoe UI on Windows. Initial body text: 14px; secondary labels: 12px; headings: 20–24px. Essential information must not depend on tiny metadata. Support text enlargement without clipping.

Use a 4px spacing scale, commonly 8/12/16/24px. Prefer restrained 6–8px corner radii. Establish hierarchy through alignment, whitespace and contrast before adding shadows.

Default to comfortable pointer targets, typically 32–36 CSS px high. Meet baseline target-size/spacing requirements and provide clear padding for compact icon controls. Density changes must preserve readable labels, keyboard access and focus visibility.

Use right-aligned tabular digits for numeric columns and explicit unit/currency labels. Keep dates and identifiers readable; if truncation is necessary, offer the complete value through keyboard-accessible detail or expansion, not a hover-only tooltip.

## Candidate color tokens

| Token            | Light   | Dark reference |
| ---------------- | ------- | -------------- |
| canvas           | #F4F6FA | #141922        |
| surface          | #FFFFFF | #1C2330        |
| text             | #182337 | #EDF2FA        |
| muted-text       | #526176 | #ACB9CE        |
| border           | #DCE2EC | #354154        |
| primary          | #254FA0 | #A9C8FF        |
| on-primary       | #FFFFFF | #14294C        |
| selected-surface | #EAF0FC | #263650        |
| success-text     | #246647 | #92D6AE        |
| warning-text     | #765300 | #EFCD80        |
| error-text       | #A4262C | #FFB4B8        |
| focus            | #254FA0 | #A9C8FF        |
| disabled-text    | #687487 | #A2AEC0        |

These are candidate tokens, not validated color combinations. Check actual foreground/background pairs, hover/selection/focus variants and disabled presentation before accepting UI. Light is the initial proposal; the dark column is an exploratory reference, not a commitment to ship both themes.

Meet adopted contrast requirements: 4.5:1 for normal text, 3:1 for large text and applicable controls/graphics. The decorative border token is not sufficient by itself to identify an interactive control. Use stronger semantic outlines where needed. Respect Windows high contrast/forced colors; do not rely on fixed palette colors or suppress system outlines.

## Semantic visual roles

| Role        | Visual representation                                                                |
| ----------- | ------------------------------------------------------------------------------------ |
| Neutral     | Plain text or restrained badge with a descriptive label                              |
| Information | Text plus an information icon when useful                                            |
| Warning     | Warning text/icon; short label and supporting explanation                            |
| Error       | Error text/icon with adjacent descriptive text                                       |
| Success     | Success text/icon with an explicit label                                             |
| Busy        | Progress indicator with a text label; reduced-motion alternative                     |
| Selected    | Selected surface plus a non-color marker or semantic selected state                  |
| Focused     | Clearly visible outline distinct from selection                                      |
| Disabled    | Muted treatment preserving legibility; explanatory text when supplied by the feature |

Status labels and permitted actions come from the feature specification. Color, icon or badge alone must never communicate status. Do not imply that a green badge confirms an external tax operation unless the feature explicitly supplies that meaning.

## Controls, tables and dialogs

Prefer semantic HTML and platform-familiar controls. Use a consistent button hierarchy and one visually dominant action per region. Icon-only actions need accessible names; avoid hiding essential actions until hover.

Tables need associated headers, readable row spacing and distinguishable hover, selection and focus. Use horizontal scrolling only for genuinely two-dimensional content; keep surrounding controls responsive. A styled table is not automatically an ARIA grid: choose a grid only if its keyboard model is implemented.

Use persistent field labels, associated helper/error text, and predictable alignment. Place primary/supporting content consistently. Use dialogs for focused interactions, with a clear title, visible dismissal when allowed by the feature, contained focus and return to the trigger. Do not nest modals.

## Keyboard, focus and feedback

All controls must be usable by keyboard. Follow visual reading order for Tab; preserve focus through content updates. Use platform-familiar shortcuts and visible menu accelerators where applicable, without overriding reserved OS shortcuts. Add arrow-key navigation only for components with an established accessible pattern.

Use semantic progress and polite live announcements for meaningful updates; reserve interruptive alerts for important errors. Do not announce every row change. Keep labels and messages concise; translated product copy must fit without clipping.

Respect reduced-motion preferences and avoid decorative animation. Check screen-reader navigation in the actual desktop window, including dialogs and the native/application boundary.

## Evidence before UI acceptance

Use synthetic representative content: 20–30 rows, long names/identifiers, large values and multiline detail. Check restored/maximized/narrow windows, multiple monitor configurations, Windows scaling, keyboard-only navigation, focus, screen reader, contrast and the themes selected for delivery.

Check zoom at 200% and reflow at 400% (or the adopted equivalent viewport), allowing the baseline exception for two-dimensional tables. Use automated accessibility checks plus manual desktop review. A browser mockup or token table does not establish compliance for a packaged application.

References: [Electron accessibility](https://www.electronjs.org/docs/latest/tutorial/accessibility).
