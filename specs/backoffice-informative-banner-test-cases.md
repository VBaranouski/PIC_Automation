# WF 19. Informative Banner: BackOffice Configuration — Test Case Specifications

> **Generated:** 2026-04-24 · **Feature Area:** `backoffice` · **Workflow:** Informative Banner: BackOffice Configuration
> **Confluence:** https://confluence.se.com/spaces/PIC/pages/497457251
> **Skill:** `create-test-cases` v2

---

## 1. Coverage Analysis

### 1.1 Current Tracker State

| Metric | Count |
|--------|-------|
| Total scenarios | 0 |
| Automated | 0 |
| Pending | 0 |
| On-Hold | 0 |

### 1.2 Five-Dimension Coverage Gap Table

| Dimension | Status | Gap |
|-----------|--------|-----|
| Happy Path | ❌ | No scenarios exist — Create banner, List, Edit, Delete, Front Office display all missing |
| Negative / Validation | ❌ | Missing: empty required fields, End Date before Start Date |
| Role-Based Access | ❌ | Missing: SuperUser/TechAdmin allowed, non-admin denied |
| State Transitions | ❌ | Missing: Inactive → Active (Is Active toggle), Active → display in UI |
| Data Integrity | ❌ | Missing: saved banner persists and reflects in UI |

---

## 2. Test Case Specifications

### 2.1 Custom Banners Configuration — Access (RBAC)

#### `BACKOFFICE-BANNER-ACCESS-001` — Custom Banners Configuration link visible in Notification Configuration

**Preconditions:** User is logged in as `TechAdmin` (holds `VIEW_MAINTENANCE_CUSTOM_BANNERS_CONFIGURATION` privilege). BackOffice is accessible.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to BackOffice → Notification Configuration section | The Notification Configuration section is visible |
| 2 | Verify the `Custom Banners Configuration` link is listed | The `Custom Banners Configuration` link is visible in the Notification Configuration section |
| 3 | Click the `Custom Banners Configuration` link | The Custom Banners Configuration page opens (URL contains `/GRC_BackOffice/CustomBannerConfig`) |

**Coverage dimension:** Role-Based Access — allowed role access  
**Note:** Verify privilege `VIEW_MAINTENANCE_CUSTOM_BANNERS_CONFIGURATION` is held by `TechAdmin` per access-privileges.md.

---

#### `BACKOFFICE-BANNER-ACCESS-002` — Non-admin cannot access Custom Banners Configuration page

**Preconditions:** User is logged in as `Security Manager` (does NOT hold `VIEW_MAINTENANCE_CUSTOM_BANNERS_CONFIGURATION` privilege). BackOffice URL is known.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate directly to `/GRC_BackOffice/CustomBannerConfig` | The page is not accessible; the user is redirected to the landing page or an access-denied screen |

**Coverage dimension:** Role-Based Access — denied role access  
**Note:** `Security Manager` is in the Product roles group; it does not hold `BACKOFFICE_ACCESS` or banner-specific privileges.

---

### 2.2 Custom Banners Configuration — Create Banner

#### `BACKOFFICE-BANNER-CREATE-001` — "Create banner" button opens Create Banner popup with all required fields

**Preconditions:** User is logged in as `TechAdmin`. The Custom Banners Configuration page is open. No banners exist (empty state visible).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to BackOffice → Notification Configuration → `Custom Banners Configuration` | The Custom Banners Configuration page opens with the empty state message and `Create banner` button |
| 2 | Click the `Create banner` button | The Create Banner popup opens |
| 3 | Verify popup contains all required fields | The popup contains: `Name` (free text), `Notification Type` dropdown (info/warning), `Start Date and Time` (datetime picker), `End Date and Time` (datetime picker), `Message Text` (SK editor supporting bold/italic/link), `Make Active` checkbox (unchecked by default), `Save` button, `Cancel` button, X close icon |

**Coverage dimension:** Happy Path — popup layout  
**Note:** `Make Active` checkbox must be unchecked by default per requirements.

---

#### `BACKOFFICE-BANNER-CREATE-002` — Creating a banner with all fields filled saves and appears in list

**Preconditions:** User is logged in as `TechAdmin`. The Custom Banners Configuration page is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Create banner` button | The Create Banner popup opens |
| 2 | Type a unique name (e.g., "Test Info Banner") in the `Name` field | The Name field contains the typed text |
| 3 | Select `info` from the `Notification Type` dropdown | The `info` option is selected |
| 4 | Set `Start Date and Time` to a future date/time | The Start Date and Time picker shows the selected value |
| 5 | Set `End Date and Time` to a date/time after the start date | The End Date and Time picker shows the selected value |
| 6 | Type a message in the `Message Text` editor | The editor contains the typed message |
| 7 | Click `Save` | The popup closes; the new banner row is visible in the Custom Banners Configuration table with the correct Name, Notification Type, Start/End Date and Time |

**Coverage dimension:** Happy Path — E2E create  
**Note:** Independent scenario; uses its own navigation.

---

#### `BACKOFFICE-BANNER-CREATE-003` — Saving Create Banner popup without Name shows validation error

**Preconditions:** User is logged in as `TechAdmin`. The Custom Banners Configuration page is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Create banner` button | The Create Banner popup opens |
| 2 | Leave the `Name` field empty | The Name field is empty |
| 3 | Fill all other mandatory fields (Notification Type, Start/End Date, Message Text) | Other fields are populated |
| 4 | Click `Save` | The popup remains open; an inline validation error is shown on the `Name` field |

**Coverage dimension:** Negative / Validation — required field empty

---

#### `BACKOFFICE-BANNER-CREATE-004` — Saving Create Banner popup without Notification Type shows validation error

**Preconditions:** User is logged in as `TechAdmin`. The Custom Banners Configuration page is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Create banner` button | The Create Banner popup opens |
| 2 | Fill the `Name` field and other mandatory fields; leave `Notification Type` unselected | Notification Type shows default placeholder |
| 3 | Click `Save` | The popup remains open; an inline validation error is shown on the `Notification Type` field |

**Coverage dimension:** Negative / Validation — required dropdown empty

---

#### `BACKOFFICE-BANNER-CREATE-005` — Saving with End Date before Start Date shows validation error

**Preconditions:** User is logged in as `TechAdmin`. The Create Banner popup is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Fill `Name`, `Notification Type`, and `Message Text` | Fields are populated |
| 2 | Set `Start Date and Time` to a future date (e.g., tomorrow) | Start Date is set |
| 3 | Set `End Date and Time` to a date before the Start Date | End Date picker shows the selected value |
| 4 | Click `Save` | The popup remains open; an inline validation error is shown for the date range (end must be after start) |

**Coverage dimension:** Negative / Validation — date range constraint

---

#### `BACKOFFICE-BANNER-CREATE-006` — Clicking Cancel on Create Banner popup discards all input

**Preconditions:** User is logged in as `TechAdmin`. The Create Banner popup is open with some fields filled.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Fill the `Name` field with "Draft Banner" | The field contains "Draft Banner" |
| 2 | Click `Cancel` | The popup closes; no new banner row is added to the table |

**Coverage dimension:** Happy Path — cancel flow

---

### 2.3 Custom Banners Configuration — List & Filters

#### `BACKOFFICE-BANNER-LIST-001` — Configuration page shows table with expected columns

**Preconditions:** User is logged in as `TechAdmin`. At least one banner has been created.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Custom Banners Configuration | The page is open |
| 2 | Verify table column headers | The table contains: `Banner name`, `Notification type`, `Start Date and Time`, `End Date and Time`, `Last Update`, `Is Active` (toggle), `Actions` (three-dot icon) |

**Coverage dimension:** Happy Path — list layout

---

#### `BACKOFFICE-BANNER-LIST-002` — Empty state shows message and Create banner button

**Preconditions:** User is logged in as `TechAdmin`. No banners have been created.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Custom Banners Configuration | The page shows an empty state message and the `Create banner` button is visible |

**Coverage dimension:** Happy Path — empty state  
**Note:** Condition-dependent; skip if banner data pre-exists and cannot be cleaned.

---

#### `BACKOFFICE-BANNER-LIST-003` — Search by message text narrows results

**Preconditions:** User is logged in as `TechAdmin`. At least two banners exist with different message text.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Custom Banners Configuration | The banners list is visible with at least 2 rows |
| 2 | Type a unique keyword from one banner's message in the search field | The list is narrowed to show only banners whose message text matches the keyword |
| 3 | Clear the search field | All banners are visible again |

**Coverage dimension:** Happy Path — filter by text

---

#### `BACKOFFICE-BANNER-LIST-004` — Filter by Notification Type narrows results

**Preconditions:** User is logged in as `TechAdmin`. At least one `info` and one `warning` banner exist.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Custom Banners Configuration | The list shows all banners |
| 2 | Select `info` from the `Filter by type` dropdown | Only banners with `Notification type = info` are visible |
| 3 | Select `warning` from the `Filter by type` dropdown | Only banners with `Notification type = warning` are visible |

**Coverage dimension:** Happy Path — filter by type

---

#### `BACKOFFICE-BANNER-LIST-005` — Reset button clears all applied filters

**Preconditions:** User is logged in as `TechAdmin`. Search and type filter have been applied.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Apply a search keyword and filter by type | The list is narrowed |
| 2 | Click the `Reset` button | All filters are cleared; the full banners list is restored |

**Coverage dimension:** Happy Path — filter reset

---

#### `BACKOFFICE-BANNER-LIST-006` — "Show active only" toggle hides inactive banners when ON

**Preconditions:** User is logged in as `TechAdmin`. At least one active and one inactive banner exist.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Custom Banners Configuration | Both active and inactive banners are visible in the list |
| 2 | Enable the `Show active only` toggle | Only banners with `Is Active = true` are displayed |
| 3 | Disable the `Show active only` toggle | Both active and inactive banners are visible again |

**Coverage dimension:** State Transitions — active/inactive filter

---

### 2.4 Custom Banners Configuration — Edit & Delete

#### `BACKOFFICE-BANNER-EDIT-001` — Three-dot Actions → Edit opens popup pre-filled with banner data

**Preconditions:** User is logged in as `TechAdmin`. At least one banner exists in the list.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Custom Banners Configuration | The list with at least one banner is visible |
| 2 | Click the three-dot `Actions` icon on any banner row | A dropdown with `Edit` and `Delete` options appears |
| 3 | Click `Edit` | The Edit Banner popup opens pre-filled with the existing banner's Name, Notification Type, Start/End Date, Message Text, and Is Active state |

**Coverage dimension:** Happy Path — edit flow access

---

#### `BACKOFFICE-BANNER-EDIT-002` — Saving edited banner updates the list

**Preconditions:** User is logged in as `TechAdmin`. The Edit Banner popup is open for an existing banner.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Change the `Name` field to a new unique value | The Name field shows the new value |
| 2 | Click `Save` | The popup closes; the banner row in the list shows the updated Name; the `Last Update` date/time is refreshed |

**Coverage dimension:** Data Integrity — edit persists

---

#### `BACKOFFICE-BANNER-EDIT-003` — Activating a banner via Is Active toggle updates display in PICASso UI

**Preconditions:** User is logged in as `TechAdmin`. An inactive banner exists with valid Start Date in the past and End Date in the future.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Custom Banners Configuration | The banner row shows `Is Active = false` (toggle OFF) |
| 2 | Click the `Is Active` toggle on the banner row | The toggle switches to ON |
| 3 | Navigate to the PICASso landing page as any user | The configured banner is displayed in the expected color (info = light blue, warning = light orange) |

**Coverage dimension:** State Transitions — inactive → active → displayed in UI

---

#### `BACKOFFICE-BANNER-DELETE-001` — Three-dot Actions → Delete shows confirmation popup with banner name

**Preconditions:** User is logged in as `TechAdmin`. At least one banner exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the three-dot `Actions` icon on a banner row | The dropdown with `Edit` and `Delete` options appears |
| 2 | Click `Delete` | A warning confirmation popup is displayed; the popup contains the banner name |

**Coverage dimension:** Happy Path — delete confirmation

---

#### `BACKOFFICE-BANNER-DELETE-002` — Confirming deletion removes the banner from the list

**Preconditions:** User is logged in as `TechAdmin`. The delete confirmation popup is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Confirm` (or equivalent confirmation action) in the delete popup | The popup closes; the deleted banner row is no longer visible in the list |

**Coverage dimension:** Data Integrity — delete confirmed

---

### 2.5 Front Office Display

#### `BACKOFFICE-BANNER-DISPLAY-001` — Active Info banner appears as light blue banner throughout the app

**Preconditions:** An `info` banner is active (Is Active = true, current date within Start/End range). User is logged in as any non-TechAdmin role that can access PICASso.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the PICASso landing page | A light blue banner is visible at the top of the page containing the configured message text |
| 2 | Navigate to any other PICASso page (e.g., a product detail page) | The light blue banner remains visible |

**Coverage dimension:** Happy Path — info banner display

---

#### `BACKOFFICE-BANNER-DISPLAY-002` — Active Warning banner appears as light orange banner throughout the app

**Preconditions:** A `warning` banner is active (Is Active = true, current date within Start/End range).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the PICASso landing page | A light orange banner is visible at the top of the page containing the configured message text |

**Coverage dimension:** Happy Path — warning banner display

---

#### `BACKOFFICE-BANNER-DISPLAY-003` — User can close banner with X icon; banner does not reappear in same session

**Preconditions:** An active banner is visible in PICASso UI.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the X (close) icon on the active banner | The banner disappears from the page |
| 2 | Navigate to another PICASso page | The closed banner does not reappear on the new page |

**Coverage dimension:** State Transitions — banner closed

---

#### `BACKOFFICE-BANNER-DISPLAY-004` — Multiple active banners show consolidated "You have N notifications" banner

**Preconditions:** Two or more banners are active at the same time.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to any PICASso page | A single consolidated banner "You have N notifications" is displayed (where N ≥ 2) |
| 2 | Click the consolidated banner to expand it | All active banners are displayed one by one from newest to oldest |
| 3 | Verify `Dismiss all` link is visible | The `Dismiss all` link is visible in the expanded view |

**Coverage dimension:** Happy Path — multiple banners consolidated

---

#### `BACKOFFICE-BANNER-DISPLAY-005` — "Dismiss all" closes all active banners at once

**Preconditions:** Multiple active banners are visible; the consolidated banner is expanded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Dismiss all` link | All banners disappear from the page |
| 2 | Navigate to another page | No banners are visible |

**Coverage dimension:** State Transitions — dismiss all banners
