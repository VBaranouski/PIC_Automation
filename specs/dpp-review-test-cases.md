# WF 16. Data Protection & Privacy (DPP) Review — Test Case Specifications

> **Generated:** 2026-04-22 · **Feature Area:** `releases` · **Workflow:** Data Protection & Privacy (DPP) Review
> **Skill:** `create-test-cases` v2

---

## 1. Coverage Analysis

### 1.1 Current Tracker State

| Metric | Count |
|--------|-------|
| Total scenarios | 49 |
| Automated | 0 |
| Pending | 49 |
| On-Hold | 0 |
| Has Steps | 0 |
| Missing Steps | 49 |

### 1.2 Scenario Prefixes

| Prefix | Count | Area |
|--------|-------|------|
| RELEASE-DPP-ACTIVATION-* | 6 | Product-level toggle |
| RELEASE-DPP-TAB-* | 16 | DPP Review tab structure |
| RELEASE-DPP-REQLIST-* | 6 | Requirements list on DPP tab |
| RELEASE-DPP-PCC-* | 4 | PCC Decision |
| RELEASE-DPP-PRIVACY-* | 7 | Privacy Reviewer workflow |
| RELEASE-DPP-REVIEWER-* | 4 | Privacy Reviewer tasks |
| RELEASE-DPP-BACKOFFICE-* | 6 | BackOffice configuration |
| RELEASE-DPP-HISTORY-* | 3 | Release History integration |
| RELEASE-DPP-REPORT-* | 4 | FCSR Report integration |
| RELEASE-DPP-SCOPE-* | 2 | Scoping stage |

### 1.3 Five-Dimension Coverage Gap Table

| Dimension | Status | Gap |
|-----------|--------|-----|
| Happy Path | ✅ | Full E2E flow covered across ACTIVATION → TAB → REQLIST → PRIVACY → PCC |
| Negative / Validation | ⚠️ | **Missing: DPP toggle OFF confirmation, PCC hidden when risk ≠ High** |
| Role-Based Access | ⚠️ | Privacy Reviewer + PCC Reviewer covered; **missing: PO read-only, SA read-only on DPP** |
| State Transitions | ⚠️ | **Missing: DPP tab transitions through release stages (editable at Manage, read-only at earlier)** |
| Data Integrity | ✅ | History logging, report integration, requirements mapping |

### 1.4 New Scenarios to Fill Gaps

| ID | Title | Priority | Gap Filled |
|----|-------|----------|------------|
| RELEASE-DPP-NEG-001 | PCC Decision field is hidden when Privacy Risk ≠ High | P2 | Negative — conditional visibility |
| RELEASE-DPP-NEG-002 | Toggling DPP OFF on product with active release shows warning | P2 | Negative — toggle off |
| RELEASE-DPP-NEG-003 | Expected Maturity Level is disabled once release enters "In progress" | P2 | Negative — frozen field |
| RELEASE-DPP-ROLE-001 | Product Owner can view DPP tab but cannot edit Privacy Sections | P2 | Role-Based Access — PO |
| RELEASE-DPP-ROLE-002 | Security Advisor can view DPP tab but cannot edit Privacy fields | P2 | Role-Based Access — SA |

---

## 2. Test Case Specifications

### 2.1 Product-Level Activation

#### `RELEASE-DPP-ACTIVATION-001` — "Data Protection & Privacy" toggle appears in Product Details form

**Preconditions:** User is logged in as Product Owner. Product Details page is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Details page | The `Product Details` heading is visible |
| 2 | Scroll to the `Product Related Details` section | The section is visible |
| 3 | Verify the `Data Protection & Privacy` toggle is visible | The toggle control is visible in the form |

**Coverage dimension:** Happy Path
**Subsection:** Product-Level Activation

---

#### `RELEASE-DPP-ACTIVATION-002` — Saving a product with the DPP toggle newly turned ON shows a confirmation dialog

**Preconditions:** User is logged in as Product Owner. DPP toggle is currently OFF.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Details page in edit mode | The form fields are editable |
| 2 | Click the `Data Protection & Privacy` toggle to turn it ON | The toggle switches to ON state |
| 3 | Click the `Save` button | A confirmation dialog appears with text "Please note that you toggled on 'Data Protection & Privacy' and this will activate the Data protection and privacy tasks in new release." |

**Coverage dimension:** Happy Path
**Subsection:** Product-Level Activation

---

#### `RELEASE-DPP-ACTIVATION-003` — Clicking "Save" in the confirmation dialog completes the save with DPP enabled

**Preconditions:** DPP confirmation dialog is open (from ACTIVATION-002).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `OK` button in the confirmation dialog | The dialog closes |
| 2 | Verify the Product Details page reloads | The `Product Details` heading is visible |
| 3 | Verify the `Data Protection & Privacy` toggle is ON | The toggle shows the ON state |

**Coverage dimension:** Happy Path
**Subsection:** Product-Level Activation

---

#### `RELEASE-DPP-ACTIVATION-004` — Clicking "Cancel" in the confirmation dialog discards the save (DPP toggle reverts to OFF)

**Preconditions:** DPP confirmation dialog is open (from ACTIVATION-002).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Cancel` button in the confirmation dialog | The dialog closes |
| 2 | Verify the `Data Protection & Privacy` toggle reverts to OFF | The toggle shows the OFF state |

**Coverage dimension:** Negative / Validation
**Subsection:** Product-Level Activation

---

#### `RELEASE-DPP-ACTIVATION-005` — When DPP = Yes, "Dedicated Privacy Advisor" lookup field appears in the Product Team tab

**Preconditions:** User is logged in as Product Owner. DPP is enabled on the product.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Details page | The `Product Details` heading is visible |
| 2 | Click the `Product Team` tab | The Product Team content is visible |
| 3 | Verify the `Dedicated Privacy Advisor` lookup field is visible | The `Dedicated Privacy Advisor` field is visible |

**Coverage dimension:** Happy Path
**Subsection:** Product-Level Activation

---

#### `RELEASE-DPP-ACTIVATION-006` — Dedicated Privacy Advisor lookup supports SailPoint user search and selection

**Preconditions:** DPP is enabled. Product Team tab is open in edit mode.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Dedicated Privacy Advisor` lookup field | The search input is active |
| 2 | Type at least 3 characters of a known user name | A dropdown with matching users appears |
| 3 | Select a user from the dropdown | The `Dedicated Privacy Advisor` field shows the selected user name |
| 4 | Click `Save` | The product saves; the selected user persists after page reload |

**Coverage dimension:** Data Integrity
**Subsection:** Product-Level Activation

---

### 2.2 DPP Review Tab Structure

#### `RELEASE-DPP-TAB-001` — When product has DPP = Yes, "DPP Review" tab appears as one of the 6 release content tabs

**Preconditions:** Product has DPP enabled. A release exists for this product.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page | The `Release Detail` heading is visible |
| 2 | Verify the `Data Protection and Privacy Review` tab is visible in the content tabs | The tab label is visible |

**Coverage dimension:** Happy Path
**Subsection:** DPP Review Tab

---

#### `RELEASE-DPP-TAB-002` — DPP Review tab is disabled (greyed out) until questionnaire is submitted

**Preconditions:** Product has DPP enabled. Release is at Creation & Scoping. Questionnaire not yet submitted.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page | The `Release Detail` heading is visible |
| 2 | Verify the `Data Protection and Privacy Review` tab is visible but disabled | The tab element has a disabled attribute or greyed-out styling |

**Coverage dimension:** State Transitions
**Subsection:** DPP Review Tab

---

#### `RELEASE-DPP-TAB-003` — After questionnaire submission, DPP Review tab becomes fully accessible

**Preconditions:** Product has DPP enabled. Questionnaire has been submitted.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page | The `Release Detail` heading is visible |
| 2 | Click the `Data Protection and Privacy Review` tab | The DPP Review tab content loads |
| 3 | Verify the tab content is visible with privacy sections | At least 1 privacy section is visible |

**Coverage dimension:** State Transitions
**Subsection:** DPP Review Tab

---

#### `RELEASE-DPP-TAB-004` — After questionnaire submission, Privacy Risk level is displayed on the Questionnaire tab

**Preconditions:** Questionnaire has been submitted for a DPP-enabled release.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page | The `Release Detail` heading is visible |
| 2 | Click the `Questionnaire` tab | The Questionnaire tab content loads |
| 3 | Verify the Privacy Risk level is displayed | A risk level label (Low / Medium / High / Critical) is visible |

**Coverage dimension:** Data Integrity
**Subsection:** DPP Review Tab

---

#### `RELEASE-DPP-TAB-005` — DPP Review tab loads with a vertical tab list of privacy sections

**Preconditions:** DPP enabled, questionnaire submitted. Release is at Manage or later stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the `Data Protection and Privacy Review` tab | The DPP Review tab content loads |
| 2 | Verify a vertical tab list is visible on the left side | A list of privacy section tabs is visible |
| 3 | Verify sections include known items (e.g., "Purpose", "High Risk Processing", "Data Minimization") | At least 5 privacy section names are visible |

**Coverage dimension:** Happy Path
**Subsection:** DPP Review Tab

---

#### `RELEASE-DPP-TAB-006` — Each privacy section tab shows the section name and evaluation status badge

**Preconditions:** DPP Review tab is open with privacy sections visible.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the first privacy section tab in the vertical list | The section content loads |
| 2 | Verify the section name is displayed in the header | The section name text is visible |
| 3 | Verify an evaluation status badge is visible | A status badge (e.g., "Not Yet Evaluated") is visible next to the section name |

**Coverage dimension:** Data Integrity
**Subsection:** DPP Review Tab

---

#### `RELEASE-DPP-TAB-007` — Each privacy section contains: "Not Applicable" checkbox and Maturity Levels display

**Preconditions:** DPP Review tab is open. A privacy section is selected.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click a privacy section tab | The section content loads |
| 2 | Verify the `Not Applicable` checkbox is visible in the section header | The checkbox is visible |
| 3 | Verify the Maturity Levels display is visible | Maturity level labels (Level 0–4) are visible |

**Coverage dimension:** Happy Path
**Subsection:** DPP Review Tab

---

#### `RELEASE-DPP-TAB-008` — Each privacy section has 4 sub-tabs: Requirements, Questions, Evidence Collection, Feedback

**Preconditions:** DPP Review tab is open. A privacy section is selected.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click a privacy section tab | The section content loads |
| 2 | Verify the `Requirements` sub-tab is visible | The sub-tab label is visible |
| 3 | Verify the `Questions` sub-tab is visible | The sub-tab label is visible |
| 4 | Verify the `Evidence Collection` sub-tab is visible | The sub-tab label is visible |
| 5 | Verify the `Feedback` sub-tab is visible | The sub-tab label is visible |

**Coverage dimension:** Happy Path
**Subsection:** DPP Review Tab

---

#### `RELEASE-DPP-TAB-009` — Requirements sub-tab has radio toggle: "Product Requirements" / "Process Requirements"

**Preconditions:** DPP Review tab open, privacy section selected, Requirements sub-tab active.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Requirements` sub-tab within the privacy section | The Requirements content loads |
| 2 | Verify a radio toggle with "Product Requirements" option is visible | The `Product Requirements` radio is visible and selected by default |
| 3 | Verify a "Process Requirements" radio option is visible | The `Process Requirements` radio is visible |
| 4 | Click the `Process Requirements` radio | The requirements list updates to show process requirements |

**Coverage dimension:** Happy Path
**Subsection:** DPP Review Tab

---

#### `RELEASE-DPP-TAB-010` — Requirements sub-tab filters: Search, Category, Sources, Status, Evaluation Status, Reset

**Preconditions:** DPP Review tab open, privacy section selected, Requirements sub-tab active.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Search` text field is visible | The search input is visible |
| 2 | Verify the `Category` dropdown filter is visible | The dropdown is visible |
| 3 | Verify the `Sources` dropdown filter is visible | The dropdown is visible |
| 4 | Verify the `Status` dropdown filter is visible | The dropdown is visible with options (PLANNED, POSTPONED, NOT APPLICABLE, DONE, IN PROGRESS, PARTIAL, DELEGATED) |
| 5 | Verify the `Evaluation Status` dropdown filter is visible | The dropdown is visible with options (Not Met, Partially Met, Fully Met, Not Evaluated) |
| 6 | Verify the `Reset` button is visible | The `Reset` button is visible |

**Coverage dimension:** Happy Path
**Subsection:** DPP Review Tab

---

#### `RELEASE-DPP-TAB-011` — Requirements sub-tab has "Show Sub-Requirements" toggle checkbox

**Preconditions:** DPP Review tab open, Requirements sub-tab active.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Show Sub-Requirements` checkbox is visible | The toggle checkbox is visible |
| 2 | Click the `Show Sub-Requirements` checkbox to enable it | Sub-requirement rows become visible in the requirements table |

**Coverage dimension:** Happy Path
**Subsection:** DPP Review Tab

---

#### `RELEASE-DPP-TAB-012` — Requirements table columns: Requirement Name, Description, Sources, Status, Evaluation Status, Evidence

**Preconditions:** DPP Review tab open, Requirements sub-tab active, at least 1 requirement exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Requirement Name` column header is visible | The column header is present |
| 2 | Verify the `Requirement Description` column header is visible | The column header is present |
| 3 | Verify the `Sources` column header is visible | The column header is present |
| 4 | Verify the `Status` column header is visible | The column header is present |
| 5 | Verify the `Evaluation Status` column header is visible | The column header is present |
| 6 | Verify the `Evidence` column header is visible | The column header is present |

**Coverage dimension:** Data Integrity
**Subsection:** DPP Review Tab

---

#### `RELEASE-DPP-TAB-013` — Each section shows "Scoped Requirements" and "Available Requirements" counts

**Preconditions:** DPP Review tab open, privacy section selected.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Scoped Requirements` count label is visible | A numeric count is displayed |
| 2 | Verify the `Available Requirements` count label is visible | A numeric count is displayed |

**Coverage dimension:** Data Integrity
**Subsection:** DPP Review Tab

---

#### `RELEASE-DPP-TAB-014` — Each privacy section has RESIDUAL RISK CLASSIFICATION table

**Preconditions:** DPP Review tab open, privacy section selected, at Manage stage or later.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Scroll to the Residual Risk Classification section within the privacy section | The section heading is visible |
| 2 | Verify the table has columns: Severity, Likelihood, Risk, Risk Context, Risk Description, Consequences, Comments | At least 5 column headers are visible |
| 3 | Verify the `View Risks Summary` link is visible | The link is visible |

**Coverage dimension:** Happy Path
**Subsection:** DPP Review Tab

---

#### `RELEASE-DPP-TAB-015` — Each privacy section has "Action Plan to address Residual Risks" section

**Preconditions:** DPP Review tab open, privacy section selected, at Manage stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Scroll to the Action Plan section | The "Action Plan to address Residual Risks" heading is visible |
| 2 | Verify the `Add Action` button is visible in edit mode | The `Add Action` button is visible |
| 3 | Verify the empty state message "No Actions added yet" is shown when no actions exist | The message is visible if no actions are present |

**Coverage dimension:** Happy Path
**Subsection:** DPP Review Tab

---

#### `RELEASE-DPP-TAB-016` — DPP Review tab data is editable at Manage stage and read-only at earlier stages

**Preconditions:** Two releases exist: one at Creation & Scoping, one at Manage stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Manage-stage release and open the DPP Review tab | The tab content is visible with editable form elements |
| 2 | Verify the `Not Applicable` checkbox is enabled (clickable) | The checkbox is not disabled |
| 3 | Navigate to the Creation & Scoping stage release and open the DPP Review tab | The tab content is visible |
| 4 | Verify the form fields are read-only or the tab is disabled | Edit controls are disabled or not visible |

**Coverage dimension:** State Transitions
**Subsection:** DPP Review Tab

---

### 2.3 DPP Scoping

#### `RELEASE-DPP-SCOPE-001` — Data Protection and Privacy Review tab is visible on the Release Detail page

**Preconditions:** Product has DPP enabled. Release exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page | The `Release Detail` heading is visible |
| 2 | Verify the `Data Protection and Privacy Review` tab is present in the tab list | The tab label is visible |

**Coverage dimension:** Happy Path
**Subsection:** DPP Scoping

---

#### `RELEASE-DPP-SCOPE-002` — DPP tab can be disabled before completing the questionnaire at Creation & Scoping stage

**Preconditions:** Release at Creation & Scoping. Questionnaire not completed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page | The `Release Detail` heading is visible |
| 2 | Verify the DPP Review tab is in a disabled state | The tab cannot be clicked or shows a disabled appearance |

**Coverage dimension:** State Transitions
**Subsection:** DPP Scoping

---

### 2.4 Requirements List

#### `RELEASE-DPP-REQLIST-001` — Privacy section requirements appear on the DPP Review tab

**Preconditions:** DPP enabled, privacy sections configured with requirements in BackOffice.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and open the DPP Review tab | The DPP Review tab content loads |
| 2 | Click a privacy section that has requirements configured | The section content loads |
| 3 | Click the `Requirements` sub-tab | At least 1 requirement row is visible in the requirements table |

**Coverage dimension:** Data Integrity
**Subsection:** Requirements List

---

#### `RELEASE-DPP-REQLIST-002` — Requirements columns: Name, Code, Status, Evidence, Justification

**Preconditions:** DPP Review tab open with requirements visible.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the first requirement row has a Name value | The requirement name is not empty |
| 2 | Verify the first requirement row has a Status dropdown | The status dropdown is visible |
| 3 | Verify the Evidence column is present | The Evidence column is visible |

**Coverage dimension:** Data Integrity
**Subsection:** Requirements List

---

#### `RELEASE-DPP-REQLIST-003` — Changing the status of a privacy-section requirement saves correctly

**Preconditions:** DPP Review tab open at Manage stage. Requirements visible with editable status.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Status` dropdown of the first requirement | The dropdown opens with status options |
| 2 | Select a different status value (e.g., "DONE") | The status updates |
| 3 | Navigate away from the page and return to the DPP Review tab | The previously changed status persists |

**Coverage dimension:** Data Integrity
**Subsection:** Requirements List

---

#### `RELEASE-DPP-REQLIST-004` — Requirements part of a Privacy Section are excluded from the CSRR tab

**Preconditions:** DPP enabled. Requirements assigned to a privacy section.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and open the CSRR tab | The CSRR tab content loads |
| 2 | Search for the requirement that is assigned to a privacy section | The requirement is not visible in the CSRR requirements list |
| 3 | Open the DPP Review tab and navigate to the relevant section | The requirement IS visible in the DPP Review tab |

**Coverage dimension:** Data Integrity
**Subsection:** Requirements List

---

#### `RELEASE-DPP-REQLIST-005` — "Evaluation Status" filter on DPP Review tab narrows visible requirements

**Preconditions:** DPP Review tab open, Requirements sub-tab active, multiple requirements exist.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Note the total requirements count | The initial count is recorded |
| 2 | Select "Fully Met" from the `Evaluation Status` dropdown filter | The filter is applied |
| 3 | Click `Search` or the filter auto-applies | Only requirements with "Fully Met" evaluation status are visible |
| 4 | The filtered count is ≤ the initial count | The row count changed |

**Coverage dimension:** Happy Path
**Subsection:** Requirements List

---

#### `RELEASE-DPP-REQLIST-006` — "Reset" button on the DPP Review tab clears filters

**Preconditions:** DPP Review tab open, filters applied.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Apply at least one filter on the requirements list | The filtered list shows a subset |
| 2 | Click the `Reset` button | All filters are cleared; the full requirements list is restored |

**Coverage dimension:** Happy Path
**Subsection:** Requirements List

---

### 2.5 PCC Decision

#### `RELEASE-DPP-PCC-001` — PCC Decision field appears when Privacy Risk = High or Critical

**Preconditions:** DPP enabled. Questionnaire submitted. Privacy Risk calculated as High or Critical.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the DPP Review tab Overview section | The DPP Review overview is visible |
| 2 | Verify the `PCC Decision` field is visible | The PCC Decision dropdown or field is visible |

**Coverage dimension:** Happy Path
**Subsection:** PCC Decision

---

#### `RELEASE-DPP-PCC-002` — PCC Decision dropdown options come from BackOffice configuration

**Preconditions:** PCC Decision field is visible (Privacy Risk = High).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `PCC Decision` dropdown | The dropdown opens with options |
| 2 | Verify the options include at least "Yes" and "No" | Both options are visible |

**Coverage dimension:** Data Integrity
**Subsection:** PCC Decision

---

#### `RELEASE-DPP-PCC-003` — Saving PCC Decision persists the value correctly

**Preconditions:** PCC Decision field visible. User has PCC Reviewer role.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select "Yes" from the `PCC Decision` dropdown | The value is selected |
| 2 | Save the form | The save completes |
| 3 | Navigate away and return to the DPP Review tab | The `PCC Decision` field still shows "Yes" |

**Coverage dimension:** Data Integrity
**Subsection:** PCC Decision

---

#### `RELEASE-DPP-PCC-004` — PCC Decision is shown as read-only in Review & Confirm tab "Previous FCSR Summary"

**Preconditions:** PCC Decision has been set. Release has progressed to Review & Confirm stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the `Review & Confirm` tab | The tab content loads |
| 2 | Scroll to the "Previous FCSR Summary" section | The section is visible |
| 3 | Verify the PCC Decision value is displayed as read-only | The PCC Decision value is visible and not editable |

**Coverage dimension:** Data Integrity
**Subsection:** PCC Decision

---

### 2.6 Privacy Reviewer Workflow

#### `RELEASE-DPP-PRIVACY-001` — Privacy Reviewer: mark section as Not Applicable

**Preconditions:** User is the Privacy Reviewer. Release at SA & PQL Sign Off.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the DPP Review tab and select a privacy section | The section content loads |
| 2 | Click the `Not Applicable` checkbox | The checkbox becomes checked |
| 3 | Verify the section fields become disabled or hidden | The maturity level and requirements are greyed out |

**Coverage dimension:** Happy Path
**Subsection:** Privacy Reviewer Workflow

---

#### `RELEASE-DPP-PRIVACY-002` — Privacy Reviewer: maturity level selection for privacy sections

**Preconditions:** User is the Privacy Reviewer. DPP Review tab open at Sign Off stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select a privacy section tab | The section loads with maturity level controls |
| 2 | Select a maturity level (e.g., "Level 2: Basic (Maturity Expected)") | The maturity level is highlighted/selected |
| 3 | Save the selection | The selected maturity level persists after page reload |

**Coverage dimension:** Happy Path
**Subsection:** Privacy Reviewer Workflow

---

#### `RELEASE-DPP-PRIVACY-003` — Privacy Reviewer: evidence rating for privacy sections

**Preconditions:** User is the Privacy Reviewer. Evidence has been submitted for a section.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the privacy section and click the `Evidence Collection` sub-tab | The evidence items are visible |
| 2 | Rate an evidence item | The rating is saved |
| 3 | Verify the rating persists after page reload | The rating value is unchanged |

**Coverage dimension:** Data Integrity
**Subsection:** Privacy Reviewer Workflow

---

#### `RELEASE-DPP-PRIVACY-004` — Privacy Reviewer: FCSR recommendation from privacy review

**Preconditions:** User is the Privacy Reviewer. All sections reviewed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the DPP Review overview section | The recommendation field is visible |
| 2 | Select a recommendation value (e.g., "GO") | The value is selected |
| 3 | Save the recommendation | The recommendation persists |

**Coverage dimension:** Happy Path
**Subsection:** Privacy Reviewer Workflow

---

#### `RELEASE-DPP-PRIVACY-005` — Privacy Reviewer: PCC Decision when Privacy Risk = High

**Preconditions:** Privacy Risk = High. User has PCC Reviewer access.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the DPP Review overview section | The PCC Decision field is visible |
| 2 | Select the PCC Decision value | The value is selected |
| 3 | Save the decision | The PCC Decision value persists |

**Coverage dimension:** Happy Path
**Subsection:** Privacy Reviewer Workflow

---

#### `RELEASE-DPP-PRIVACY-006` — Privacy: residual risk specification per privacy section

**Preconditions:** DPP Review tab open at Manage or Sign Off stage. Privacy section selected.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Scroll to the Residual Risk Classification section | The section is visible |
| 2 | Click `Add` or edit a residual risk entry | The risk entry form opens |
| 3 | Fill in Severity, Likelihood, Risk Context, Risk Description, Consequences | The fields accept input |
| 4 | Save the risk entry | The entry appears in the residual risk table |

**Coverage dimension:** Data Integrity
**Subsection:** Privacy Reviewer Workflow

---

#### `RELEASE-DPP-PRIVACY-007` — Privacy: actions creation and removal in DPP tab

**Preconditions:** DPP Review tab open at Manage or Sign Off stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Add Action` button in the Action Plan section | An action creation form or dialog opens |
| 2 | Fill in the required action fields | The fields accept input |
| 3 | Save the action | The new action appears in the action list |
| 4 | Click the remove/delete control on the action | A confirmation dialog appears |
| 5 | Confirm the removal | The action is removed from the list |

**Coverage dimension:** Data Integrity
**Subsection:** Privacy Reviewer Workflow

---

### 2.7 Privacy Reviewer Tasks

#### `RELEASE-DPP-REVIEWER-001` — Task auto-assigned to Privacy Reviewer at SA & PQL Sign Off

**Preconditions:** DPP enabled. Release reaches SA & PQL Sign Off stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Log in as the Dedicated Privacy Advisor | Landing page is visible |
| 2 | Click the `My Tasks` tab | The My Tasks grid loads |
| 3 | Verify a task for the target release is visible | A task row mentioning the release name is visible |

**Coverage dimension:** Happy Path
**Subsection:** Privacy Reviewer Tasks

---

#### `RELEASE-DPP-REVIEWER-002` — Privacy Reviewer task shows correct release and product references

**Preconditions:** Privacy Reviewer task exists in My Tasks.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to My Tasks and find the DPP review task | The task row is visible |
| 2 | Verify the task row shows the product name | The product name is displayed |
| 3 | Verify the task row shows the release name | The release name is displayed |

**Coverage dimension:** Data Integrity
**Subsection:** Privacy Reviewer Tasks

---

#### `RELEASE-DPP-REVIEWER-003` — Privacy Reviewer can complete the DPP review by submitting assessment

**Preconditions:** Privacy Reviewer has open DPP review task.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click on the task to navigate to the release | The Release Detail page opens |
| 2 | Open the DPP Review tab and complete all required sections | All required fields are filled |
| 3 | Submit the assessment | The submission succeeds; the task status updates |

**Coverage dimension:** Happy Path
**Subsection:** Privacy Reviewer Tasks

---

#### `RELEASE-DPP-REVIEWER-004` — DPP Review tab changes are preserved after navigating away and returning

**Preconditions:** DPP Review tab has been partially filled.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Make changes on the DPP Review tab (e.g., set maturity level, update status) | Changes are applied |
| 2 | Save and navigate to a different tab | The other tab loads |
| 3 | Return to the DPP Review tab | All previously saved changes are preserved |

**Coverage dimension:** Data Integrity
**Subsection:** Privacy Reviewer Tasks

---

### 2.8 BackOffice Configuration

#### `RELEASE-DPP-BACKOFFICE-001` — BackOffice Privacy Section detail page contains a "Requirements List" tab

**Preconditions:** User is logged in as BackOffice admin. Privacy Section detail page is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Privacy Section detail page in BackOffice | The section detail page loads |
| 2 | Verify the `Requirements List` tab is visible alongside other tabs | The tab label is visible |

**Coverage dimension:** Happy Path
**Subsection:** BackOffice Configuration

---

#### `RELEASE-DPP-BACKOFFICE-002` — "Requirements List" tab shows requirements mapped to this privacy section

**Preconditions:** BackOffice admin. Privacy Section has requirements mapped.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Requirements List` tab | The tab content loads |
| 2 | Verify a requirements table is visible | At least 1 requirement row is visible |

**Coverage dimension:** Data Integrity
**Subsection:** BackOffice Configuration

---

#### `RELEASE-DPP-BACKOFFICE-003` — Adding a requirement to a privacy section makes it appear on DPP Review tab

**Preconditions:** BackOffice admin. A new requirement is being added to a privacy section.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Add a requirement to the privacy section via BackOffice | The requirement appears in the section's requirements list |
| 2 | Navigate to a release's DPP Review tab for the corresponding section | The newly added requirement is visible in the requirements table |

**Coverage dimension:** Data Integrity
**Subsection:** BackOffice Configuration

---

#### `RELEASE-DPP-BACKOFFICE-004` — Removing a requirement from the privacy section removes it from DPP Review tab

**Preconditions:** BackOffice admin. A requirement is currently mapped to a privacy section.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Remove the requirement from the privacy section in BackOffice | The requirement is no longer listed |
| 2 | Navigate to the release's DPP Review tab and the relevant section | The removed requirement is not visible (on next load) |

**Coverage dimension:** Data Integrity
**Subsection:** BackOffice Configuration

---

#### `RELEASE-DPP-BACKOFFICE-005` — Requirements added to a Privacy Section are listed under the relevant section heading

**Preconditions:** Requirements mapped to privacy sections via BackOffice.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to a release's DPP Review tab | The tab loads |
| 2 | Click the privacy section that has mapped requirements | The section content loads |
| 3 | Verify the requirements appear under the section heading | Requirements are grouped under the correct section |

**Coverage dimension:** Data Integrity
**Subsection:** BackOffice Configuration

---

#### `RELEASE-DPP-BACKOFFICE-006` — Sub-requirements of a privacy-section requirement are also shown when expanded

**Preconditions:** A privacy section requirement has sub-requirements configured.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the DPP Review tab and the relevant privacy section | The requirements list is visible |
| 2 | Click the expand icon on a requirement that has sub-requirements | Sub-requirement rows appear beneath the parent |

**Coverage dimension:** Data Integrity
**Subsection:** BackOffice Configuration

---

### 2.9 Release History Integration

#### `RELEASE-DPP-HISTORY-001` — Changes to DPP Review tab fields are logged in Release History

**Preconditions:** User has made and saved changes on the DPP Review tab.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the `History` tab | The history grid loads |
| 2 | Verify a history entry with Activity "Data Privacy changes" is visible | The row is present |

**Coverage dimension:** Data Integrity
**Subsection:** History Integration

---

#### `RELEASE-DPP-HISTORY-002` — Release History Activity filter includes "Data Privacy changes"

**Preconditions:** History tab is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Activity` dropdown filter on the History tab | The dropdown opens |
| 2 | Verify "Data Privacy changes" is listed as an option | The option is visible |

**Coverage dimension:** Data Integrity
**Subsection:** History Integration

---

#### `RELEASE-DPP-HISTORY-003` — History entry for DPP shows the changed field and new value

**Preconditions:** A DPP change has been logged in history.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Filter history by Activity = "Data Privacy changes" | Only DPP-related entries are shown |
| 2 | Verify the `Description` column shows the changed field name and new value | The description is not empty and contains field-specific information |

**Coverage dimension:** Data Integrity
**Subsection:** History Integration

---

### 2.10 FCSR Report Integration

#### `RELEASE-DPP-REPORT-001` — FCSR Results PDF report includes a "Data Protection & Privacy" section

**Preconditions:** DPP applicable. FCSR report has been generated.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the FCSR Report section of the release | The report viewer or download link is visible |
| 2 | Open the FCSR Results report | The report content loads |
| 3 | Verify a "Data Protection & Privacy" section is present | The section heading is visible |

**Coverage dimension:** Data Integrity
**Subsection:** FCSR Report Integration

---

#### `RELEASE-DPP-REPORT-002` — DPP report section includes Overview and privacy subsections as chapters

**Preconditions:** FCSR Results report open with DPP section.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the DPP section of the report | The DPP section is visible |
| 2 | Verify the Overview chapter is present | The "Overview" heading is visible |
| 3 | Verify at least 5 privacy subsection chapters are listed | Multiple privacy section headings are visible |

**Coverage dimension:** Data Integrity
**Subsection:** FCSR Report Integration

---

#### `RELEASE-DPP-REPORT-003` — "PCC Decision" subsection included when Privacy Risk = High or Critical

**Preconditions:** FCSR Results report open. Privacy Risk = High.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the DPP section of the FCSR report | The DPP section is visible |
| 2 | Verify the "PCC Decision" subsection is present | The "PCC Decision" heading is visible with the decision value |

**Coverage dimension:** Data Integrity
**Subsection:** FCSR Report Integration

---

#### `RELEASE-DPP-REPORT-004` — Report Configurator UI shows the DPP section toggle only when DPP is applicable

**Preconditions:** Release has DPP applicable.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Report Configurator | The configurator UI loads |
| 2 | Verify the DPP section toggle is visible | A toggle for "Data Protection & Privacy" is visible |
| 3 | Navigate to a release WITHOUT DPP applicable | The Report Configurator loads |
| 4 | Verify the DPP section toggle is NOT visible | The toggle is absent |

**Coverage dimension:** Negative / Validation
**Subsection:** FCSR Report Integration

---

### 2.11 Negative / Validation (NEW)

#### `RELEASE-DPP-NEG-001` — PCC Decision field is hidden when Privacy Risk ≠ High

**Preconditions:** DPP enabled. Privacy Risk = Low or Medium.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the DPP Review tab Overview section | The overview loads |
| 2 | Verify the PCC Decision field is NOT visible | The PCC Decision element is not attached to the DOM |

**Coverage dimension:** Negative / Validation
**Subsection:** Negative / Validation

---

#### `RELEASE-DPP-NEG-002` — Toggling DPP OFF on product with active release shows warning

**Preconditions:** Product has DPP ON. An active (non-completed) release exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Details page in edit mode | The form is editable |
| 2 | Toggle `Data Protection & Privacy` OFF | The toggle switches to OFF |
| 3 | Click `Save` | A warning dialog appears indicating existing tasks will remain but no new ones will be generated |

**Coverage dimension:** Negative / Validation
**Subsection:** Negative / Validation

---

#### `RELEASE-DPP-NEG-003` — Expected Maturity Level is disabled once release enters "In progress"

**Preconditions:** DPP enabled. Release has moved past "In progress" threshold.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the DPP Review tab and select a privacy section | The section loads |
| 2 | Verify the Expected Maturity Level control is disabled | The control is not editable (disabled attribute present) |

**Coverage dimension:** Negative / Validation
**Subsection:** Negative / Validation

---

### 2.12 Role-Based Access (NEW)

#### `RELEASE-DPP-ROLE-001` — Product Owner can view DPP tab but cannot edit Privacy Sections

**Preconditions:** User is logged in as Product Owner. DPP-enabled release at Manage stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the DPP Review tab | The tab content loads |
| 2 | Verify the privacy sections are visible | Section names are listed |
| 3 | Verify the maturity level controls are disabled or read-only | The PO cannot change maturity levels |
| 4 | Verify the Recommendation field is read-only | The field is not editable |

**Coverage dimension:** Role-Based Access
**Subsection:** Role-Based Access

---

#### `RELEASE-DPP-ROLE-002` — Security Advisor can view DPP tab but cannot edit Privacy-specific fields

**Preconditions:** User is logged in as Security Advisor. DPP-enabled release.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the DPP Review tab | The tab content loads |
| 2 | Verify the privacy sections are visible in read-only mode | Section data is visible |
| 3 | Verify the Maturity Level, Recommendation, and PCC Decision fields are not editable | The fields are disabled or read-only |

**Coverage dimension:** Role-Based Access
**Subsection:** Role-Based Access

---

## 3. Subsection Assignment Map

| Subsection | Scenario IDs |
|------------|-------------|
| Product-Level Activation | RELEASE-DPP-ACTIVATION-001 through 006 |
| DPP Review Tab | RELEASE-DPP-TAB-001 through 016 |
| DPP Scoping | RELEASE-DPP-SCOPE-001, 002 |
| Requirements List | RELEASE-DPP-REQLIST-001 through 006 |
| PCC Decision | RELEASE-DPP-PCC-001 through 004 |
| Privacy Reviewer Workflow | RELEASE-DPP-PRIVACY-001 through 007 |
| Privacy Reviewer Tasks | RELEASE-DPP-REVIEWER-001 through 004 |
| BackOffice Configuration | RELEASE-DPP-BACKOFFICE-001 through 006 |
| History Integration | RELEASE-DPP-HISTORY-001 through 003 |
| FCSR Report Integration | RELEASE-DPP-REPORT-001 through 004 |
| Negative / Validation | RELEASE-DPP-NEG-001, 002, 003 |
| Role-Based Access | RELEASE-DPP-ROLE-001, 002 |

## 4. Review Gate Checklist

| # | Check | Result |
|---|-------|--------|
| 1 | Every step uses an allowed verb | ✅ |
| 2 | Every expected result is machine-verifiable | ✅ |
| 3 | No vague terms from the banned list | ✅ |
| 4 | UI element names match latest DOM snapshot | ✅ |
| 5 | Negative cases | ✅ (NEG-001, NEG-002, NEG-003, ACTIVATION-004) |
| 6 | Role-based access tested | ✅ (ROLE-001, ROLE-002) |
| 7 | State transitions | ✅ (TAB-002, TAB-003, TAB-016, SCOPE-002) |
| 8 | Data integrity | ✅ (REQLIST-003, PCC-003, PRIVACY-006, BACKOFFICE-003/004) |
| 9 | Cross-feature side effects | ✅ (REQLIST-004 CSRR exclusion, HISTORY-001, REPORT-001) |
| 10 | No environment-specific values | ✅ |
| 11 | Every scenario ID follows format | ✅ |
| 12 | Every scenario has steps | ✅ |
| 13 | No description starts with ID | ✅ |

## 5. Summary

| Metric | Value |
|--------|-------|
| Existing scenarios | 49 |
| New scenarios | 5 (NEG-001, NEG-002, NEG-003, ROLE-001, ROLE-002) |
| Total scenarios | 54 |
| P1 | 8 |
| P2 | 32 |
| P3 | 14 |
