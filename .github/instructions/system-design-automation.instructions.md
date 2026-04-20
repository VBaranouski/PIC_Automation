```instructions
# System Design Automation UI Reference

Use this file as the design-system source of truth when creating or updating:

- tracker UI screens and modal flows
- internal dashboards, analytics, and report launch surfaces
- generated HTML documentation or visual summaries requested by the user
- new frontend-oriented automation utilities, workflow explorers, and support screens

This instruction file is for the **test automation application itself**, not for styling the PICASso product under test.

---

## Design Intent

### Creative North Star

Design every automation-facing surface as **The Kinetic Observatory**:

- mission-control, not generic SaaS dashboard
- editorial and data-dense, but calm under sustained use
- dark-mode first, with tonal layering instead of box-heavy separation
- action color used surgically, never sprayed across the page

The UI should feel precise, technical, and high-value. Prioritize rhythm, hierarchy, and scanning speed over ornamental density.

---

## Applicability Rules

Apply this design reference when the task involves any of the following:

- a new tracker page, modal, workflow view, summary screen, or operational panel
- an HTML report, dashboard, or generated documentation page intended for humans to read in-browser
- a frontend refresh of existing automation tooling that currently lacks a coherent visual language
- requested documentation that needs screenshots, layout guidance, component guidance, or a visual spec

Do **not** override established third-party UIs such as Allure itself unless the task explicitly asks for a custom wrapper or companion screen.

---

## Core Visual Language

### Palette

Use the existing tracker palette and keep token names stable when possible:

| Token | Hex | Primary Use |
|------|-----|-------------|
| `surface` | `#0e0e0e` | app background, root canvas |
| `surface_container_low` | `#131313` | content zones, sidebars, section wells |
| `surface_container` | `#1a1a1a` | active cards and focus blocks |
| `surface_container_high` | `#20201f` | secondary controls, filter surfaces |
| `surface_container_highest` | `#262626` | popovers, menus, elevated floating UI |
| `primary` | `#ff9157` | mandatory action, active edge, CTA emphasis |
| `primary_dim` | `#ff7520` | gradient end, pressed state, intensity ramp |
| `tertiary` | `#81ecff` | system activity, machine-origin messages, info signals |
| `error` | `#ff7351` | failed tests, destructive outcomes, defect state |
| `secondary` | `#e3e2e2` | strong supporting foreground |
| `secondary_fixed_dim` | `#d5d4d4` | long-form body text |
| `on_surface` | `#ffffff` | high-priority text only |
| `on_surface_variant` | `#adaaaa` | metadata, helper text, passive labels |
| `outline_variant` | `#484847` | ghost boundary only |

### No-Line Rule

Default section separation must come from:

1. surface shifts
2. spacing rhythm
3. tonal stacking

Do not default to visible dividers or boxed grids. A line is a last resort, not the baseline layout tool.

### Accent Discipline

- `primary` is for must-act controls, active tabs, selected workflow edges, and critical attention points
- `tertiary` is for system intelligence, live state, automation-generated signals, or neutral technical emphasis
- `error` is reserved for failure, defects, destructive actions, and broken health states

If everything is highlighted, nothing is highlighted.

---

## Typography

### Font Roles

- `Manrope` for major metrics, page titles, and section-defining headlines
- `Inter` for control labels, tables, metadata, body copy, and technical detail

### Hierarchy Rules

- Use uppercase `label` styling with modest tracking for section headers and control groups
- Use large Manrope headlines for top-level dashboard or screen identity
- Use `secondary_fixed_dim` instead of pure white for multi-line explanatory copy
- Reserve `on_surface` for short, high-priority text and current focus states

### Editorial Tone

Screens should read like a premium operations interface. Prefer short, exact copy. Avoid marketing language, decorative slogans, or vague headings.

---

## Depth, Structure, and Motion

### Layering Principle

Use depth by surface tier, not card shadows:

- Level 0: `surface`
- Level 1: `surface_container_low`
- Level 2: `surface_container`
- Level 3: `surface_container_highest`

### Shadows

Use ambient shadow only for truly floating states such as dialogs, dragged items, or temporary overlays.

Recommended shadow:

```css
box-shadow: 0 16px 32px -4px rgba(0, 0, 0, 0.45);
```

Avoid standard soft gray card shadows.

### Glass Rule

For modals, overlays, floating action trays, or support panels:

- allow `surface_bright` or equivalent elevated tone at reduced opacity
- use strong backdrop blur only where it improves depth and focus
- keep transparency subtle; this is a control room, not a glassmorphism demo

### Motion

Animation should clarify hierarchy transitions:

- stagger reveals for dashboard blocks or workflow groups
- use understated open/close transitions for drawers and modals
- avoid constant pulsing except for live execution indicators or transient status beacons

Do not add decorative motion with no informational value.

---

## Layout Rules

### Spatial Rhythm

- major functional blocks should have generous separation
- use negative space as the default list separator
- prefer `4px`, `8px`, `16px`, `24px`, and `32px` rhythm steps
- dense data is acceptable, but crowding is not

### Asymmetry

Favor intentional asymmetry when it improves scanning:

- side navigation can feel anchored and architectural
- headline and controls do not need perfect mirror alignment
- summary metrics can use varied card spans if hierarchy becomes clearer

Avoid random imbalance. Asymmetry should feel designed, not unfinished.

### Responsive Behavior

Any new screen or generated HTML page must remain readable on laptop and mobile widths:

- preserve hierarchy before preserving exact layout symmetry
- stack utility controls before shrinking them into unusable density
- keep primary actions visible without requiring pixel hunting

---

## Component Guidance

### Buttons

**Primary button**
- background: gradient from `primary` to `primary_dim`
- text: `on_primary`
- border: none
- radius: medium (`0.375rem`)

**Secondary button**
- background: `surface_container_high`
- border: ghost border using `outline_variant` at low opacity
- text: `on_surface`

**Tertiary button**
- transparent background
- no border by default
- text: `primary`

### Cards and Panels

- do not use internal divider lines between stacked items
- separate cards with vertical spacing
- active or selected cards should use a left light bar or tonal rise, not a full bright border
- nested technical details may sit on `surface_container_lowest` to create an etched inset effect

### Status Chips and Pips

- status chips should use full rounding (`9999px`)
- pair text with color; color alone is insufficient
- use `tertiary` for in-progress or machine activity
- use `error` for failure states
- use `primary` sparingly for active human-driven state

### Progress Indicators

- keep linear progress to roughly `2px` height
- track color: `surface_variant` or equivalent neutral dark rail
- fill: gradient leaning from `primary` toward a cooler highlight only when the state implies motion

### Inputs

- background: `surface_container_highest`
- border: none by default
- focus ring: `0 0 0 2px rgba(255, 145, 87, 0.3)`
- if a boundary is required, use ghost border opacity only

### Navigation

- active navigation items should combine tonal contrast with a precise accent edge or icon tint
- avoid filling every nav item with bright backgrounds
- keep labels compact and operational

### Tables and Scenario Lists

- avoid grid-like chrome when showing scenario inventory
- favor row spacing, tonal grouping, and clear column emphasis
- critical identifiers such as scenario IDs should be visually scannable and stable in placement

---

## Documentation Output Rules

When a user asks for documentation, specs, or HTML summaries, this design system still applies.

### For Markdown Documentation

- describe screens in terms of tokens, layering, and component states
- include concise rationale for why a pattern exists
- document status colors and interaction behavior explicitly
- write like an engineering design reference, not like product marketing

### For HTML Documentation or Generated Summaries

- use the dark token set above
- include the Manrope plus Inter pairing when external fonts are appropriate
- keep pages presentation-ready without becoming ornamental
- ensure screenshots, metrics, and status summaries visually match tracker UI conventions

### For Implementation Specs

When documenting a new feature or screen, include these sections when relevant:

1. Purpose
2. Primary user action
3. Information hierarchy
4. Layout structure
5. Component states
6. Empty, loading, success, and failure states
7. Accessibility and responsiveness notes

---

## Accessibility and Readability Rules

- never rely on icon-only status communication
- maintain visible text labels for actions and state
- ensure focus states are obvious against dark surfaces
- reduce glare by keeping long-form text off pure white
- use contrast shifts and spatial grouping to support extended reading sessions

---

## Do and Don't

### Do

- use tonal transitions instead of heavy borders
- treat metrics and logs with editorial hierarchy
- keep orange accents rare and intentional
- let system-generated activity read differently from human action through `tertiary`
- make complex screens breathable before making them denser

### Don't

- do not fall back to generic white cards on dark backgrounds
- do not introduce purple as a default accent
- do not separate every row with a divider line
- do not rely on drop shadows for normal card hierarchy
- do not use pure white for long-form body copy
- do not crowd filters, controls, and summary metrics into one flat toolbar

---

## Implementation Preference for This Repo

When editing tracker UI or adjacent internal HTML in this repository:

- preserve and extend the existing token vocabulary already present in `src/tracker/ui/index.html`
- prefer CSS variables or Tailwind theme tokens over one-off hardcoded colors
- keep component styling centralized and reusable where practical
- if adding a new surface, make it look native to the current tracker UI rather than introducing a separate mini-theme

---

## Acceptance Check Before Finalizing UI Work

Before treating a UI-facing task as complete, verify:

- the screen clearly fits the Kinetic Observatory visual model
- primary orange appears only where attention or action is required
- sections are separated mainly through tone and spacing, not lines
- typography uses Manrope for display emphasis and Inter for operational detail
- loading, empty, and failure states are explicitly designed
- the result is readable on desktop and mobile widths
- generated documentation matches the same visual language if the task includes docs
```