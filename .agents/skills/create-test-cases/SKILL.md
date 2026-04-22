---
name: create-test-cases
description: "Design agent-compatible test cases for PICASso feature areas with zero-regression coverage guarantees. Use this skill whenever the user asks to create, write, refactor, review, or improve test cases, test scenarios, or test specifications — BEFORE any Playwright code is written. Also triggers for: 'write test cases for X', 'design tests for this feature', 'what tests do we need for X', 'refactor test cases', 'review test coverage for X', 'coverage gap analysis', 'are we testing everything', 'zero regression', or when the user mentions a feature area and wants test case specs rather than code. This skill produces structured test case documents that feed directly into the create-auto-tests skill for implementation."
---

# Test Case Design for PICASso Automation

Structured workflow for designing high-quality, agent-compatible test cases that guarantee zero-regression coverage when automated. This skill produces the test case specifications — the *what to test* — that the `create-auto-tests` skill then implements as Playwright TypeScript code.

## When to Use

- Designing test cases for a new or existing PICASso feature area
- Refactoring or improving existing test case coverage
- Performing coverage gap analysis across a feature area
- Reviewing test cases before they move to automation
- Creating test case specifications from tracker scenarios
- Answering "what tests do we need?" or "is this feature fully covered?"

**This skill is the STEP BEFORE `create-auto-tests`.** It produces the test case specs; that skill produces the code.

## Prerequisites

Load these files before starting:

1. `.github/instructions/test-case-design.instructions.md` — **The canonical rules** for agent-compatible language, measurable assertions, exploratory testing, and zero-regression coverage. This is the authoritative reference. Read it first.
2. `.github/instructions/testing-patterns.instructions.md` — Locator priority, web-first assertions (informs what's technically feasible)
3. `.github/instructions/outsystems-picasso.instructions.md` — OSUI widget patterns (informs which UI elements need special handling)

## The 8-Step Design Workflow

### Step 1: Identify Feature Area & Load Knowledge

Match the user's request to a feature area using `docs/ai/knowledge-base/feature-areas.md`:

```
auth | landing | products | releases | doc | reports | backoffice | integrations | other
```

Then load Tier 2 context (read only what's needed — don't load everything):

1. **Feature registry:** `docs/ai/knowledge-base/feature-registry/<area>.md` — existing feature IDs, scenario prefixes, POM methods
2. **Exploration findings:** `docs/ai/knowledge-base/exploration-findings.md` — actual UI elements from DOM snapshot (canonical element names)
3. **Knowledge file:** `docs/ai/knowledge-base/knowledge/<topic>.md` — business rules, workflows, edge cases (if exists for this area)

### Step 2: Query Tracker for Current State

Get the full picture of what's already tested vs. pending:

```bash
# All scenarios for this area
npx tsx scripts/tracker.ts list -a <area>

# Just pending ones
npx tsx scripts/tracker.ts list -a <area> --auto-state pending
```

Classify each existing scenario:
- **automated + passed** → already covered, don't duplicate
- **automated + skipped** → may need fixing, note for later
- **automated + failed-defect** → product bug, keep assertion strong
- **pending** → candidate for design in this session
- **on-hold** → check if still valid or if it was a duplicate

**Read existing test case details** for every scenario in the area — both automated and pending:

```bash
npx tsx scripts/tracker.ts show <SCENARIO-ID>
```

Check whether each scenario already has `steps` and `expected_results` in the `scenario_details` table. If a scenario is automated but missing details, backfill them from the spec file code. If a pending scenario has vague or incomplete steps, refactor them to meet the quality rules in Step 5.

**Mandatory steps-gap audit (run before proceeding to Step 3):**

```bash
sqlite3 config/scenarios.db "SELECT s.id, s.title FROM scenarios s LEFT JOIN scenario_details sd ON s.id = sd.scenario_id WHERE s.feature_area = '<area>' AND (sd.steps IS NULL OR sd.steps = '' OR sd.steps = '[]') ORDER BY s.id"
```

If this returns rows, those scenarios are missing steps. Fix them NOW — either by writing specs and running the backfill script, or by calling `upsertScenarioDetails` directly — before moving to coverage gap analysis. Do NOT carry forward scenarios with empty steps.

### Step 3: Run Coverage Gap Analysis

Apply the **Five Coverage Dimensions** (from `test-case-design.instructions.md` §4.1):

| # | Dimension | Question | Check Against |
|---|-----------|----------|---------------|
| 1 | **Happy Path** | Does the primary workflow succeed? | Every feature needs ≥1 E2E happy path |
| 2 | **Negative / Validation** | Does the system reject invalid input? | Every input field: empty, boundary, invalid-type |
| 3 | **Role-Based Access** | Can unauthorized users do things they shouldn't? | Every CRUD action: allowed role + denied role |
| 4 | **State Transitions** | Do status changes follow the state machine? | Every allowed transition + ≥1 illegal transition |
| 5 | **Data Integrity** | Is saved data correct and retrievable? | Create → Read → Edit → Read → Delete → Confirm-gone |

Build a gap table:

```markdown
| Dimension | Status | Gap |
|-----------|--------|-----|
| Happy Path | ✅/⚠️/❌ | <what's missing> |
| Negative | ✅/⚠️/❌ | <what's missing> |
| ...
```

### Step 4: Create New Scenarios for Uncovered Features

The gap analysis from Step 3 identifies *what's missing*. This step fills those gaps by minting **new scenario IDs** and writing full test case specifications for them.

#### 4a. Mine the Knowledge Sources for Uncovered Features

Systematically cross-reference these sources against the existing tracker scenarios to find features with ZERO test coverage:

1. **User Guide** — read via corpus index (`docs/ai/knowledge-base/corpus/user-guide-index.md`), then surgical `read_file(startLine, endLine)`. Every described UI action, button, toggle, dialog, validation message, and empty state is a candidate feature.
2. **Exploration findings** — DOM snapshot (`docs/ai/knowledge-base/exploration-findings.md`) reveals actual UI elements. Any element visible in the DOM but absent from the tracker is a gap.
3. **Feature registry** — `docs/ai/knowledge-base/feature-registry/<area>.md` may list feature IDs with NO scenarios (e.g., a prefix like `RELEASE-ROLES-*` with 0 rows in the DB).
4. **Change impact** — `docs/ai/knowledge-base/change-impact.md` lists recent changes that may need new coverage.

For each uncovered feature, ask: *"If this feature broke, would any existing test catch it?"* If NO → it needs a new scenario.

#### 4b. Mint New Scenario IDs

Follow the naming convention from `feature-registry/<area>.md`:

- Reuse an existing prefix when the feature belongs to an established subsection (e.g., `RELEASE-QUESTIONNAIRE-017` extends the questionnaire series)
- Create a new prefix when the feature is an entirely new subsection (e.g., `RELEASE-ROLES-001` for a previously untested tab)
- Register any new prefix in the feature registry file in the same PR

**ID format:** `<AREA>-<SUBSECTION>-<NNN>` where NNN is zero-padded 3 digits, sequential within the prefix.

> **HARD RULE — ID format: `<AREA>-<SUBSECTION>-<NNN>`.**
> - `AREA` = one of the feature-registry area prefixes (e.g., `RELEASE`, `DOC`, `PRODUCT`, `LANDING`, `AUTH`, `ACTIONS`, `ROLES`, `STAGE`, `REPORT`, `INT`, `BACKOFFICE`, `MAINTENANCE`)
> - `SUBSECTION` = feature sub-area, 1–3 hyphenated words (e.g., `PROCREQ-LOCK`, `DPP-TAB`, `SIGNOFF-DUAL`)
> - `NNN` = zero-padded 3-digit sequence, continuing from the highest existing number for that prefix
>
> **Validation:** Before inserting ANY new ID, run: `sqlite3 config/scenarios.db "SELECT MAX(CAST(SUBSTR(id, LENGTH('<PREFIX>-') + 1) AS INTEGER)) FROM scenarios WHERE id LIKE '<PREFIX>-%'"`  to find the next available number.
>
> **Never use placeholder IDs like `WF07-0026`, `WF14-0015`, or `WF##-####`.** Those were a legacy import pattern that caused 790+ scenarios to require bulk renaming. They are NOT valid for new scenarios. Every new ID must come from — or extend — the feature registry. If no existing prefix fits, create one and add it to `docs/ai/knowledge-base/feature-registry/<area>.md` in the same change.
>
> **Description field rule:** Do NOT prefix the description with the scenario ID (e.g., `"PRODUCT-DETAIL-009: Verify the …"`). The tracker UI renders the ID separately; repeating it in description causes visible duplication. Write the description as a plain sentence starting with a capital letter.

#### 4c. Assign Priorities

| Priority | Criteria |
|----------|----------|
| **P1** | Happy-path E2E for core feature; state-transition critical path; data-loss risk |
| **P2** | Negative/validation; role-based access; secondary workflows; filter/sort functionality |
| **P3** | Edge cases; UI cosmetic; tooltip content; boundary values with low business impact |

Every new subsection MUST have at least 1 P1 scenario (the happy path).

#### 4d. Write Full Specifications

For every new scenario, write the complete specification using the Step 7 template (Step, Action, Expected Result table). Do NOT defer this — every new scenario enters the tracker with steps and expected results populated.

### Step 5: Deduplicate

Cross-reference pending tracker scenarios against automated ones. Common patterns:
- WF02-* scenarios that duplicate LANDING-* scenarios (imported at different times)
- Visibility-only tests (e.g., "filter is visible") vs. functional tests ("filter narrows results")
- Same feature described with different wording

For each duplicate pair, decide:
- **True duplicate** → **remove** the duplicate from the tracker (`npx tsx scripts/tracker.ts remove <ID>`). Do not put on-hold — delete it cleanly.
- **Overlapping but different** → keep both, clarify the distinction in the title/description
- **Visibility + Functional** → keep both (visibility = P2 smoke, functional = P2 regression)

### Step 6: Assign Subsections & Insert into Tracker DB

Every scenario MUST be assigned a `subsection` value before insertion into the tracker DB. Subsections group scenarios within a workflow for organized reporting and targeted test runs.

#### 6a. Identify or Create Subsections

Query existing subsections for the workflow:

```bash
sqlite3 config/scenarios.db "SELECT DISTINCT subsection FROM scenarios WHERE workflow = '<workflow>' AND subsection IS NOT NULL ORDER BY subsection"
```

Map each scenario to a subsection based on the UI feature area it tests. Examples:
- `Release Details Tab` — scenarios testing the Release Details content tab
- `Roles & Responsibilities` — scenarios testing the R&R tab CRUD
- `Questionnaire` — scenarios for questionnaire start/fill/submit/edit
- `Cancel Release` — scenarios for the cancel flow
- `Process Requirements — Filters` — granular sub-grouping when a tab has many scenarios

**Rules:**
- Use existing subsection names when scenarios fit an established group
- Create new subsections when a batch of ≥3 scenarios covers a distinct UI area not yet grouped
- Keep subsection names human-readable and consistent (Title Case, 2–5 words)
- A single scenario should belong to exactly ONE subsection

#### 6b. Insert into Tracker with Subsection

When adding scenarios to the DB, always include the `subsection` field:

```bash
npx tsx scripts/tracker.ts add -i <ID> -t "<title>" -p <priority> -a <area> -w "<workflow>" --subsection "<subsection>"
```

Or when using a batch script, include `subsection` in the INSERT statement:

```sql
INSERT INTO scenarios (id, title, priority, feature_area, workflow, subsection, automation_state, execution_status)
VALUES (?, ?, ?, ?, ?, ?, 'pending', 'not-executed')
```

#### 6c. Populate Steps and Expected Results

Every inserted scenario MUST have `steps` and `expected_results` populated in `scenario_details` immediately after insertion. This is NON-NEGOTIABLE — a scenario without steps is unusable by downstream skills and invisible in the tracker UI.

**Two ways to populate:**

1. **Programmatic (preferred for batch inserts):** call `upsertScenarioDetails(id, steps, expectedResults, executionNotes)` from `src/tracker/crud.ts` in the same script that inserts the scenario row.
2. **From markdown specs:** after writing the specification document under `specs/`, run the backfill script to parse every `| Step | Action | Expected Result |` table and write it to `scenario_details`:

   ```bash
   # Dry-run (shows what would be written)
   npx tsx scripts/backfill-scenario-details-from-specs.ts

   # Apply
   npx tsx scripts/backfill-scenario-details-from-specs.ts --write

   # Restrict to a subset of ID prefixes
   npx tsx scripts/backfill-scenario-details-from-specs.ts --write --only WF05 WF06

   # Overwrite existing rows (rare — use when refactoring)
   npx tsx scripts/backfill-scenario-details-from-specs.ts --write --overwrite
   ```

**Audit query — MANDATORY before closing the task.** Run this for every workflow you touched; it must return zero rows:

```bash
sqlite3 config/scenarios.db "SELECT s.id FROM scenarios s LEFT JOIN scenario_details sd ON s.id = sd.scenario_id WHERE s.workflow = '<workflow>' AND (sd.steps IS NULL OR sd.steps = '' OR sd.steps = '[]')"
```

If any rows return, those scenarios are missing steps — fix them before reporting the task done. Either add the missing step tables to the spec file and re-run the backfill, or call `upsertScenarioDetails` directly.

### Step 7: Write Test Case Specifications

For each new or updated scenario, produce a specification following these **mandatory rules**:

#### Rule 1: Consistent UI Element Naming

Use the **exact** element name from the DOM snapshot (exploration findings). One name per element across all test cases. Always include the widget type:

```
✅ Click the `Add Role` button in the Roles tab
❌ Click Add Role
❌ Click the add role button
```

#### Rule 2: Automation-Friendly Verbs Only

| Verb | Meaning |
|------|---------|
| **Navigate** | Go to URL / follow link |
| **Click** | Single click on button, link, tab, checkbox |
| **Type** | Enter text into input field |
| **Select** | Choose from dropdown/listbox |
| **Hover** | Move pointer over element |
| **Scroll** | Scroll element into view |
| **Clear** | Remove text from input |
| **Upload** | Attach a file |
| **Verify** / **Assert** / **Confirm** | Check a condition (binary pass/fail) |
| **Wait** | Wait for a condition |

**Banned:** "Check" (ambiguous), "Ensure" (vague), "Should" (passive), "Validate" (overloaded)

#### Rule 3: Measurable Expected Results

Expected results describe an **observable state**, not a verification action. Strip `Verify/Confirm/Assert` from expected results — those belong in test steps.

> ✅ `The Login button is visible`  
> ❌ `Verify the Login button is visible`

| Category | Observable State Template | Playwright assertion |
|----------|--------------------------|---------------------|
| Visibility | `The <element> is visible` | `expect(loc).toBeVisible()` |
| State | `The <element> is disabled` | `expect(loc).toBeDisabled()` |
| Text | `The <element> contains "<text>"` | `expect(loc).toContainText()` |
| URL | `The URL contains <path>` | `expect(page).toHaveURL()` |
| Count | `At least 1 row is visible in <grid>` | `expect(loc).toHaveCount()` |
| Attribute | `The <tab> has aria-selected="true"` | `expect(loc).toHaveAttribute()` |

**Banned vague results:** "Page looks correct", "Verify the page loaded", "Data loads properly", "Form works", "No errors", "Displays correctly"

#### Rule 4: Step Precision (Where + What + How)

```markdown
# BAD — ambiguous
| 3 | Add a role | Role is added |

# GOOD — precise
| 3 | Click the `Add Role` button in the Roles tab | The Add Role dialog opens; the `Role` dropdown is visible |
```

#### Rule 5: Environment-Agnostic

| Fragile | Robust |
|---------|--------|
| Verify 42 rows | Verify at least 1 row |
| Verify URL is `https://qa.leap...` | Verify URL contains `/product-detail` |
| Verify user `John Doe` | Verify `Created By` column is not empty |

#### Specification Template

```markdown
#### `<SCENARIO-ID>` — <Title>

**Preconditions:** <role, URL, data state>

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to … | The `…` heading is visible |
| 2 | Click … | The `…` dialog is open |
| 3 | Verify … | The `…` is visible / contains "…" |

**Coverage dimension:** <which of the 5 dimensions this covers>
**Note:** <skip conditions, known issues, on-hold criteria>
```

> **Expected Result column rule:** Use observable states — no `Verify/Confirm/Assert` prefixes.
> Steps use action verbs. Expected Results describe the resulting state.

### Step 8: Review Gate

Every test case must pass ALL 13 checks before moving to automation:

| # | Check | How to verify |
|---|-------|---------------|
| 1 | Every step uses an allowed verb | Manual review of step tables |
| 2 | Every expected result is machine-verifiable | No vague "looks correct" / "works properly" |
| 3 | No vague terms from the banned list | Grep spec for "should", "ensure", "check", "validate" |
| 4 | UI element names match latest DOM snapshot | Cross-ref with exploration-findings.md |
| 5 | Negative cases for every input field | Coverage gap table shows ✅ for Negative |
| 6 | Role-based access tested (allowed + denied) | Coverage gap table shows ✅ for Role-Based |
| 7 | State transitions: happy path + ≥1 illegal | Coverage gap table shows ✅ for State Transitions |
| 8 | Data integrity: create + read-back | Coverage gap table shows ✅ for Data Integrity |
| 9 | Cross-feature side effects identified | Documented in scenario notes |
| 10 | No environment-specific hardcoded values | No absolute URLs, user names, or counts |
| **11** | **Every scenario ID follows `AREA-SUBSECTION-NNN` format** | `sqlite3 config/scenarios.db "SELECT id FROM scenarios WHERE id GLOB 'WF*' AND feature_area='<area>'"` returns 0 rows |
| **12** | **Every scenario has steps + expected results populated** | Step 6c audit query returns 0 rows |
| **13** | **No description starts with `<ID>: `** | `sqlite3 config/scenarios.db "SELECT id FROM scenarios WHERE description LIKE id || ':%' AND feature_area='<area>'"` returns 0 rows |

> **BLOCKING:** Checks 11–13 are non-negotiable gates. If any fail, do NOT report the task as complete.

## Output Format

The skill produces a structured markdown document with:

1. **Coverage Analysis** — current state from tracker + gap table (Steps 2–3)
2. **New Scenario Inventory** — list of new scenario IDs minted to fill gaps, grouped by subsection, with priority breakdown (Step 4)
3. **Deduplication Table** — existing vs. pending overlaps + actions (Step 5)
4. **Test Case Specifications** — detailed step tables for ALL scenarios (existing + new) grouped by subsection (Steps 4d + 7)
5. **Subsection Assignment Map** — which scenarios belong to which subsection (Step 6)
6. **Review Gate Checklist** — all 10 checks marked (Step 8)
7. **Tracker Actions** — CLI commands to import new scenarios + remove duplicates (Step 6)
8. **Summary** — total counts (existing + new), priority breakdown, zero-regression assessment

Save to: `specs/<area>-<workflow-slug>-test-cases.md`

## After This Skill

When the test cases are approved:

1. **Verify tracker state:** Run the Step 6c audit query to confirm every scenario has steps + expected results + subsection assigned.
2. **Export for review (optional):** Use the `tracker-scenario-import-export` skill to export to xlsx for stakeholder review.
3. **Automate:** Use the `create-auto-tests` skill to convert test case specs into Playwright code.
4. **Update registry:** Add any new feature IDs or prefixes to `docs/ai/knowledge-base/feature-registry/<area>.md`.

## Tips for High-Quality Test Cases

**The mutation testing question:** For every assertion, ask: "If I removed this assertion, would any other test catch the bug?" If NO, that assertion is critical — document it prominently.

**Filter test pattern:** Every filter test should follow: record initial count → apply filter → verify count changed → reset → verify count restored. This proves the filter is functional AND reversible.

**Navigation test pattern:** Click link → verify URL changed → verify target page heading visible → verify key data element present. Don't stop at URL — the page must actually load.

**Cross-feature verification:** When feature A creates data consumed by feature B, test both directions. E.g., creating a product should make it appear in the release creation dropdown.

**Skip vs. fail:** Use `test.skip()` for environment-specific unavailability (feature not deployed, no test data). Use `test.fail()` for product defects. Never weaken an assertion to make a test pass.
