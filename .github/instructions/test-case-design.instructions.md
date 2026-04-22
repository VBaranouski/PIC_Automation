```instructions
# Test Case Design — Agent-Compatible, Zero-Regression Coverage

> Applies to every test case authored for this repository, whether written by a human or an agent.
> Companion to `testing-patterns.instructions.md` (code-level) and `quality-checklist.instructions.md` (pre-commit).
> This file governs the **test case specification** layer — before any code is written.

---

## 1. Agent-Compatible Test Case Language

Agents translate test steps into automation scripts verbatim. Ambiguity causes wrong locators, missing
assertions, and false passes. Follow these rules so the generated script matches intent on the first pass.

### 1.1 Consistent UI Element Naming

Use **one canonical name** per UI element across every test case in the repository.

| Rule | Bad | Good |
|------|-----|------|
| Same name everywhere | "Cart" in TC-1, "Basket" in TC-2 | "Shopping Cart" in both |
| Match DOM text exactly | "the submit thing" | `Submit` button (label from DOM) |
| Include widget type | "click Status" | Click the `Status` dropdown |
| Qualify ambiguous names | "click Edit" | Click `Edit Product` button in the Header section |

**Canonical names** come from the DOM snapshot taken during Playwright CLI validation (Step 4 of the
workflow). If the DOM label changes, update *all* test cases that reference it — never let two names
coexist for the same element.

### 1.2 Automation-Friendly Action Verbs

Use these verbs and only these verbs in test step descriptions:

| Verb | Meaning | Playwright Mapping |
|------|---------|-------------------|
| **Navigate** | Go to a URL or follow a link | `page.goto()` / `link.click()` + `waitForOSScreenLoad()` |
| **Click** | Single click on a button, link, tab, checkbox | `locator.click()` |
| **Type** | Enter text into an input field | `locator.fill()` or `locator.pressSequentially()` |
| **Select** | Choose a value from a dropdown/listbox | OSUI pattern from `outsystems-picasso.instructions.md` |
| **Hover** | Move pointer over an element | `locator.hover()` |
| **Scroll** | Scroll to bring an element into view | `locator.scrollIntoViewIfNeeded()` |
| **Clear** | Remove existing text from an input | `locator.clear()` |
| **Upload** | Attach a file | `locator.setInputFiles()` |
| **Verify** | Assert a visual/state condition (soft, informational) | `expect(locator).toBeVisible()` etc. |
| **Assert** | Assert a critical condition (test fails if false) | Same Playwright calls — both are hard assertions |
| **Confirm** | Synonym for Verify/Assert in expected-result column | Same Playwright calls |
| **Wait** | Explicitly wait for a condition before next step | `waitForOSScreenLoad()` / web-first `expect()` |

**Banned verbs:** "Check" (ambiguous — click a checkbox or verify?), "Ensure" (vague),
"Should" (passive), "Validate" (overloaded). Rewrite to one of the verbs above.

### 1.3 Step Precision

Every test step must answer three questions:

1. **Where?** — Page, section, or container (e.g., "In the Roles tab of DOC Detail")
2. **What?** — Exact element (e.g., "`Add Role` button")
3. **How?** — Verb + parameters (e.g., "Click the `Add Role` button")

```markdown
# BAD — ambiguous
| 3 | Add a role | Role is added |

# GOOD — precise
| 3 | Click the `Add Role` button in the Roles tab | The Add Role dialog opens; the `Role` dropdown is visible |
```

---

## 2. Expected Results — Measurable Assertions

An agent needs a **binary** way to confirm success. Every expected result must be machine-verifiable.

### 2.1 Assertion Categories

| Category | Pattern | Example |
|----------|---------|---------|
| **Visibility** | Confirm `<element>` is visible / not visible | Confirm the `Welcome` heading is visible |
| **State** | Verify `<element>` is enabled / disabled / checked | Verify the `Submit` button is disabled |
| **Text content** | Verify `<element>` contains text `"<value>"` | Verify the banner contains text `"Product saved successfully"` |
| **URL** | Verify the URL contains `<path>` | Verify the URL contains `/product-detail` |
| **Count** | Verify `<container>` contains `<N>` `<items>` | Verify the Roles grid contains at least 1 row |
| **Attribute** | Verify `<element>` has attribute `<attr>` = `"<value>"` | Verify the tab has `aria-selected` = `"true"` |
| **Absence** | Confirm `<element>` is not present in the DOM | Confirm the `Delete` button is not visible for Viewer role |
| **Order** | Verify `<item A>` appears before `<item B>` | Verify `Draft` appears before `In Review` in the Status dropdown |
| **Download** | Verify a file download is triggered | Verify a `.xlsx` file download starts within 10 seconds |

### 2.2 Forbidden Vague Results

| Vague (banned) | Rewrite to |
|----------------|------------|
| "Page looks correct" | Verify the `<Page Heading>` heading is visible |
| "Data loads properly" | Verify the grid contains at least 1 data row |
| "Form works" | Verify the success banner `"Saved"` is visible after submit |
| "No errors" | Verify no `alert` role element is visible on the page |
| "Displays correctly" | Verify `<specific element>` is visible and contains `"<expected text>"` |
| "Should be updated" | Verify `<field>` contains text `"<new value>"` |

### 2.3 Boundary Assertions

For numeric fields, dates, and text inputs, include edge-case assertions:

```markdown
| Step | Action | Expected Result |
|------|--------|----------------|
| 4a | Type `""` (empty) into the `Product Name` field and click `Save` | Verify validation message `"Product Name is required"` is visible |
| 4b | Type a 256-character string into the `Product Name` field | Verify the field rejects or truncates input to 255 characters |
| 4c | Type `<script>alert(1)</script>` into the `Product Name` field | Verify the input is sanitized; no script execution occurs |
```

---

## 3. Exploratory Testing — Discovery Before Automation

Automation locks in known behavior. Exploratory testing discovers **unknown** behavior.
Run exploratory sessions before finalizing test cases for any feature area.

### 3.1 When to Explore

| Trigger | Action |
|---------|--------|
| New feature area enters scope | Run a full exploratory session before writing any test cases |
| UI change flagged in `change-impact.md` | Re-explore the affected screens; update knowledge files |
| Test failure on a previously passing scenario | Explore adjacent screens for cascading changes |
| Sprint boundary | Quick smoke exploration of all `P1` feature areas |

### 3.2 Exploratory Session Protocol

1. **Open the target screen** in Playwright headed browser (`npm run inspect` or `npm run codegen`).
2. **Walk every interactive element:** click every button, open every dropdown, type in every field.
3. **Document findings** in `docs/ai/knowledge-base/exploration-findings.md`:
   - New elements not covered by existing test cases
   - Changed labels, moved buttons, new validation messages
   - Broken flows or unexpected error states
4. **Cross-reference** findings against the feature registry (`docs/ai/knowledge-base/feature-registry/<area>.md`):
   - Mark discovered gaps as new scenario candidates.
   - Flag changed elements for locator updates in existing tests.
5. **Update the automation backlog:** add new `[ ]` entries to the testing plan or create tracker
   scenarios (`npm run tracker -- create ...`).

### 3.3 Documenting Exploration Findings

```markdown
## <Feature Area> — <Date>

### New Elements Discovered
- `Export to Excel` button added to the Reports grid toolbar (not in any test case)

### Changed UI Behavior
- `Status` dropdown now shows 6 options instead of 4; new values: `On Hold`, `Cancelled`

### Broken / Unexpected
- Clicking `Save` with empty `Product Name` shows no validation message (potential defect)

### Locator Updates Needed
- `Submit` button renamed to `Save Changes` — affects PRODUCT-CREATE-003, PRODUCT-EDIT-001
```

---

## 4. Full Functional Coverage Strategy — Zero-Regression Confidence

The goal: after automation runs green, we can state **"no regression defects in this feature area"**.
This requires more than happy-path tests. Apply the five coverage dimensions below.

### 4.1 The Five Coverage Dimensions

| # | Dimension | Question It Answers | Coverage Rule |
|---|-----------|-------------------|---------------|
| 1 | **Happy Path** | Does the primary workflow succeed? | Every feature has at least 1 end-to-end happy path (P1) |
| 2 | **Negative / Validation** | Does the system reject invalid input? | Every input field has: empty, boundary, invalid-type, injection test |
| 3 | **Role-Based Access** | Can unauthorized users see/do things they shouldn't? | Every CRUD action tested with: allowed role + denied role |
| 4 | **State Transitions** | Do status changes follow the allowed state machine? | Every status → next-status pair exercised, plus illegal transitions |
| 5 | **Data Integrity** | Is saved data retrievable and correct? | Create → Read-back → Edit → Read-back → Delete → Confirm-gone |

### 4.2 Coverage Completeness Checklist (per feature)

Before marking a feature area as "fully covered":

- [ ] **All CRUD operations** tested: Create, Read, Edit/Update, Delete (or archive/deactivate)
- [ ] **All form fields** have at least: valid input, empty input, boundary input test cases
- [ ] **All buttons** tested: enabled click, disabled state verification, double-click guard
- [ ] **All grid/table views** tested: data loads, sort (if applicable), filter, pagination, empty state
- [ ] **All tabs/navigation** tested: each tab loads its content, switching tabs preserves state
- [ ] **All dropdowns/selects** tested: selection changes dependent fields, default value correct
- [ ] **All error states** tested: network error, validation error, concurrent edit, timeout
- [ ] **All roles** from `picasso-roles-and-access.md` tested for this feature's privileges
- [ ] **State machine completeness**: every allowed transition + at least 1 disallowed transition
- [ ] **Cross-feature integration**: actions in this feature that affect other features are verified in both
- [ ] **Idempotency**: repeating the same action doesn't create duplicates or corrupt state
- [ ] **Browser refresh resilience**: refreshing mid-flow doesn't lose data or break navigation

### 4.3 Regression Test Pyramid

```
┌─────────────────────────────┐
│   E2E Smoke (P1 happy paths) │  ← Runs every commit (~2 min)
│   @smoke tag                 │
├─────────────────────────────┤
│   Feature Tests (P1 + P2)    │  ← Runs every PR merge (~10 min)
│   Per-area spec files        │
├─────────────────────────────┤
│   Full Regression (P1–P3)    │  ← Runs nightly / pre-release (~30 min)
│   All spec files             │
├─────────────────────────────┤
│   Edge Cases + Exploratory   │  ← Runs weekly / on-demand
│   P3 + manual sessions       │
└─────────────────────────────┘
```

### 4.4 Mutation Testing Mindset

For every assertion in a test, ask: **"If I removed this assertion, would any other test catch the bug?"**

- If YES → the assertion is redundant (but may still add clarity — keep it).
- If NO → the assertion is **critical** — it's the only guard for that behavior. Document it.

Apply this when reviewing test cases:

```markdown
# Weak — only checks visibility, not content
| 5 | Navigate to Product Detail | Verify the Product Detail page is visible |

# Strong — checks that the correct product loaded
| 5 | Navigate to Product Detail | Verify the `Product Name` heading contains "Test Product Alpha" |
| 5a | | Verify the `Product ID` field shows the expected ID |
| 5b | | Verify the `Status` badge shows "Active" |
```

### 4.5 Dependency Verification

When a test creates or modifies data, verify the downstream effects:

```markdown
# Product creation should cascade to release and DOC
| 8 | Navigate to the Releases tab | Verify the newly created product appears in the Product dropdown |
| 9 | Navigate to My DOCs tab | Verify no DOC exists yet for the new product (clean state) |
```

### 4.6 Environment-Agnostic Assertions

Never assert on data that changes between environments:

| Fragile | Robust |
|---------|--------|
| Verify 42 rows in the grid | Verify at least 1 row is visible in the grid |
| Verify URL is `https://qa.leap...` | Verify URL contains `/product-detail` |
| Verify user `John Doe` appears | Verify the `Created By` column is not empty |
| Verify date is `2026-04-22` | Verify the `Created Date` column is not empty |

---

## 5. Test Case Review Gate

Before a test case moves from STEPS (Step 2) to CODE (Step 3) in the workflow, it must pass this gate:

| # | Check | Pass? |
|---|-------|-------|
| 1 | Every step uses an allowed verb from §1.2 | |
| 2 | Every expected result is machine-verifiable (§2.1 categories) | |
| 3 | No vague terms from §2.2 forbidden list | |
| 4 | UI element names match the latest DOM snapshot | |
| 5 | Negative cases included for every input field | |
| 6 | Role-based access tested for allowed + denied | |
| 7 | State transitions cover happy path + at least 1 illegal transition | |
| 8 | Data integrity: create + read-back assertions present | |
| 9 | Cross-feature side effects identified and asserted | |
| 10 | No environment-specific hardcoded values | |

**If any check fails, the test case is sent back to STEPS for revision before coding begins.**

---

## Summary — The Zero-Regression Promise

A feature area earns zero-regression status when:

1. ✅ All five coverage dimensions (§4.1) have automated scenarios
2. ✅ The coverage completeness checklist (§4.2) is fully checked
3. ✅ Every test case passed the review gate (§5)
4. ✅ Exploratory testing (§3) found no untested behaviors
5. ✅ All tests run green in CI on the latest build
6. ✅ Mutation testing mindset (§4.4) confirmed no single-assertion gaps

When all six conditions hold, the automation suite **is the regression test** — manual regression
becomes redundant for that area.
```
