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

## The 6-Step Design Workflow

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

### Step 4: Deduplicate

Cross-reference pending tracker scenarios against automated ones. Common patterns:
- WF02-* scenarios that duplicate LANDING-* scenarios (imported at different times)
- Visibility-only tests (e.g., "filter is visible") vs. functional tests ("filter narrows results")
- Same feature described with different wording

For each duplicate pair, decide:
- **True duplicate** → **remove** the duplicate from the tracker (`npx tsx scripts/tracker.ts remove <ID>`). Do not put on-hold — delete it cleanly.
- **Overlapping but different** → keep both, clarify the distinction in the title/description
- **Visibility + Functional** → keep both (visibility = P2 smoke, functional = P2 regression)

### Step 5: Write Test Case Specifications

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

Every expected result must map to a Playwright assertion:

| Category | Template | Playwright |
|----------|----------|------------|
| Visibility | Confirm `<element>` is visible | `expect(loc).toBeVisible()` |
| State | Verify `<element>` is disabled | `expect(loc).toBeDisabled()` |
| Text | Verify `<element>` contains `"<text>"` | `expect(loc).toContainText()` |
| URL | Verify URL contains `<path>` | `expect(page).toHaveURL()` |
| Count | Verify `<grid>` has at least 1 row | `expect(loc).toHaveCount()` |
| Attribute | Verify `<tab>` has `aria-selected="true"` | `expect(loc).toHaveAttribute()` |

**Banned vague results:** "Page looks correct", "Data loads properly", "Form works", "No errors", "Displays correctly"

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
| 1 | Navigate to … | Verify the `…` heading is visible |
| 2 | Click … | Verify `…` opens / changes |
| 3 | Verify … | Confirm `…` is visible / contains "…" |

**Coverage dimension:** <which of the 5 dimensions this covers>
**Note:** <skip conditions, known issues, on-hold criteria>
```

### Step 6: Review Gate

Every test case must pass ALL 10 checks before moving to automation:

| # | Check |
|---|-------|
| 1 | Every step uses an allowed verb |
| 2 | Every expected result is machine-verifiable |
| 3 | No vague terms from the banned list |
| 4 | UI element names match latest DOM snapshot |
| 5 | Negative cases for every input field |
| 6 | Role-based access tested (allowed + denied) |
| 7 | State transitions: happy path + ≥1 illegal |
| 8 | Data integrity: create + read-back |
| 9 | Cross-feature side effects identified |
| 10 | No environment-specific hardcoded values |

## Output Format

The skill produces a structured markdown document with:

1. **Coverage Analysis** — current state from tracker + gap table
2. **Deduplication Table** — existing vs. pending overlaps + actions
3. **Test Case Specifications** — detailed step tables for each scenario
4. **Review Gate Checklist** — all 10 checks marked
5. **Tracker Actions** — CLI commands to import new scenarios + remove duplicates
6. **Summary** — counts, priority breakdown, zero-regression assessment

Save to: `specs/<area>-test-cases.md`

## After This Skill

When the test cases are approved:

1. **Import into tracker:** Use the `tracker-scenario-import-export` skill to create an xlsx and import. Ensure every imported scenario has both `steps` and `expected_results` populated — verify with an audit query after import.
2. **Automate:** Use the `create-auto-tests` skill to convert test case specs into Playwright code
3. **Update registry:** Add any new feature IDs to `docs/ai/knowledge-base/feature-registry/<area>.md`

## Tips for High-Quality Test Cases

**The mutation testing question:** For every assertion, ask: "If I removed this assertion, would any other test catch the bug?" If NO, that assertion is critical — document it prominently.

**Filter test pattern:** Every filter test should follow: record initial count → apply filter → verify count changed → reset → verify count restored. This proves the filter is functional AND reversible.

**Navigation test pattern:** Click link → verify URL changed → verify target page heading visible → verify key data element present. Don't stop at URL — the page must actually load.

**Cross-feature verification:** When feature A creates data consumed by feature B, test both directions. E.g., creating a product should make it appear in the release creation dropdown.

**Skip vs. fail:** Use `test.skip()` for environment-specific unavailability (feature not deployed, no test data). Use `test.fail()` for product defects. Never weaken an assertion to make a test pass.
