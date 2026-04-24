# Knowledge — Informative Banner: BackOffice Configuration

> Tier 2 · on-demand · distilled from Confluence 497457251 (02. Already in Prod)
> Feature area: `backoffice` · Feature-ID: `backoffice.banner.config`
> Last verified: 2026-04-24

## Overview

The Custom Banners Configuration feature allows TechAdmin and SuperUser roles to create informational or warning banners that are displayed system-wide across PICASso. Banners are configured in BackOffice → Notification Configuration → Custom Banners Configuration. Each banner has a type (info/warning), a date range for display, a rich-text message, and an activation toggle. When multiple banners are active simultaneously, a consolidated "You have N notifications" banner is shown.

## Key UI Elements

**BackOffice — Custom Banners Configuration page** (`/GRC_BackOffice/CustomBannerConfig`)

- `Custom Banners Configuration` link inside Notification Configuration section
- Table columns: `Banner name`, `Notification type`, `Start Date and Time`, `End Date and Time`, `Last Update`, `Is Active` (toggle), `Actions` (three-dot icon → Edit / Delete)
- `Create banner` button (also shown as `Add severity input` in empty state)
- `Search` field — filters by message text
- `Filter by type` dropdown — values: `info`, `warning`
- `Reset` button — clears all filters
- `Show active only` toggle — hides inactive banners when ON

**Create / Edit Banner popup fields:**

| Field | Type | Mandatory | Notes |
|---|---|---|---|
| Name | Free text | Yes | Unique banner name |
| Notification Type | Dropdown | Yes | Values: `info`, `warning` |
| Start Date and Time | Datetime picker | Yes | When banner becomes active in UI |
| End Date and Time | Datetime picker | Yes | When banner disappears from UI |
| Message Text | SK editor | Yes | Supports bold, italic, clickable links |
| Make Active | Checkbox | No | Unchecked by default; activates banner in UI when checked |

**Front Office — Banner appearance:**

- `info` type → light blue banner
- `warning` type → light orange banner
- X (close) icon per banner — user-dismissible; once closed, does not reappear
- Consolidated banner: "You have N notifications" when N ≥ 2 are active simultaneously
- Expanded view: banners shown newest to oldest; individual X close icons; `Dismiss all` link

## Workflows / Business Rules

1. Banner is visible in the UI only when: `Is Active = true` AND current date/time is within `Start Date` and `End Date`.
2. Once a user closes a banner (X icon), it will not reappear for that user — even on page navigation.
3. `Dismiss all` closes every active banner at once for the current user session.
4. When editing an active banner and changing the message, the updated text reflects immediately in the UI.
5. When the `Notification Type` changes (info ↔ warning), the banner color updates accordingly in the UI.
6. Deleting a banner requires a confirmation popup that displays the banner name.
7. Changing `Is Active` toggle directly on the list row (not via Edit popup) takes effect immediately.

## Edge Cases & Validations

- **End Date before Start Date** → validation error; Save blocked.
- **Empty Name** → inline validation error on Save.
- **Empty Notification Type** → inline validation error on Save.
- **Empty Message Text** → inline validation error on Save.
- **Multiple active banners**: consolidated "You have N notifications" wrapper; expand to see all.
- **Show active only** toggle: OFF = all banners shown; ON = only `Is Active = true` shown.

## Role-Based Access

| Role | Can | Cannot |
|---|---|---|
| `TechAdmin` | View list, Create, Edit, Delete, toggle Is Active | — |
| `SuperUser` | View list, Create, Edit, Delete, toggle Is Active | — |
| `Security Manager`, `Product Owner`, and all non-admin roles | View banners in front office UI | Access Custom Banners Configuration page |

**Privileges:**
- `VIEW_MAINTENANCE_CUSTOM_BANNERS_CONFIGURATION` — view the config page
- `EDIT_CUSTOM_BANNERS_CONFIGURATION` — create and edit banners

Both privileges are assigned to `SuperUser` and `TechAdmin` roles.

## Related Features

- `other.maintenance-mode` — Maintenance Mode also lives in BackOffice → Notification Configuration; shares the same admin role gate.
- `backoffice.sast.config` — Another BackOffice-only config feature added in the same Confluence batch.

## Sources

- **Confluence:** page-id `497457251` — "Informative Banner in the BackOffice" (02. Already in Prod)
- **Jira:** PIC-5241
- **Scenarios:** `BACKOFFICE-BANNER-*` (40 scenarios across 5 subsections)
- **Spec file:** `specs/backoffice-informative-banner-test-cases.md`
