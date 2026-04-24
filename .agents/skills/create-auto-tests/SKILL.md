---
name: create-auto-tests
description: End-to-end Playwright test automation workflow for any PICASso feature area — DOC lifecycle, products, releases, landing, auth, reports, backoffice, integrations. Use whenever the user asks to create, fix, extend, or batch-automate test scenarios from the tracker DB. Also triggers for fixing test failures, updating locators after OutSystems UI changes, running headed browser validation, or updating the tracker. Covers the full 8-step process: branch → tracker query → test scripting → headed browser validation → locator fixes → headless run → tracker update → commit. Applies to any scenario ID pattern (WF*-*, DOC-PRIV-*, PRODUCT-*, RELEASE-*, AUTH-*, LANDING-*, etc.).
---

# PICASso Test Automation Workflow

Proven 8-step workflow for automating any PICASso test scenarios — from tracker query to committed, passing tests.

## When to Use

- Creating new test specs from pending tracker scenarios (any feature area)
- Fixing test failures (locator issues, async loading, OutSystems partial refresh)
- Extending existing spec files with new scenarios
- Batch-automating tracker scenarios across any workflow
- Updating locators after OutSystems UI changes

## Prerequisites

**Also load this skill before generating any test code:**
- `.agents/skills/playwright-best-practices/SKILL.md` — canonical Playwright patterns (locators, assertions, POM, flaky-test prevention, CI/CD)

Read these instruction files before starting:
- `.github/instructions/automation-workflow.instructions.md` — master 7-step workflow
- `.github/instructions/testing-patterns.instructions.md` — 4-layer architecture, locator priority, Allure metadata
- `.github/instructions/outsystems-picasso.instructions.md` — OutSystems-specific patterns (OSUI selects, partial refresh, timeouts)
- `.github/instructions/naming.instructions.md` — file and scenario ID naming conventions

## Feature Areas & Project Structure

| Area | Test Dir | Page Object | Locator Factory | Fixture |
|------|----------|-------------|-----------------|---------|
| auth | `tests/auth/` | `LoginPage` | `auth.locators.ts` | `loginPage` |
| landing | `tests/landing/` | `LandingPage` | `landing.locators.ts` | `landingPage` |
| products | `tests/products/` | `NewProductPage` | `new-product.locators.ts` | `newProductPage` |
| releases | `tests/releases/` | `ReleaseDetailPage` | `release-detail.locators.ts` | `releaseDetailPage` |
| doc | `tests/doc/` | `DocDetailsPage` | `doc-details.locators.ts` | `docDetailsPage` |
| doc (controls) | `tests/doc/` | `ControlDetailPage` | `control-detail.locators.ts` | `controlDetailPage` |

All pages extend `BasePage` (`src/pages/base.page.ts`) which provides `goto()`, `waitForOSLoad()`, and `expectUrl()`.

## 8-Step Workflow

### Step 1: Create Branch
```bash
git checkout main && git pull origin main
git checkout -b feature/<area>-<scope>-scenarios
```
Use the feature area as prefix: `feature/doc-lifecycle-p1-scenarios`, `feature/releases-detail-tab`, `feature/products-history-edge`.

### Step 2: Identify & Script Test Scenarios

**Query tracker for pending scenarios:**
```bash
# By feature area and priority
npx tsx scripts/tracker.ts list --auto-state pending -a <area> -p P1

# All pending across all areas
npx tsx scripts/tracker.ts list --auto-state pending

# Available areas: auth | landing | products | releases | doc | reports | backoffice | integrations | other
# Available priorities: P1 | P2 | P3 | Edge
```

**Explore existing specs** in the target area to match patterns:
```bash
ls tests/<area>/
```

**Spec file template:**
```typescript
import { test, expect } from '../../src/fixtures';
import * as allure from 'allure-js-commons';

// ── Seed URLs ──────────────────────────────────────────────────────────────
const SEED_PAGE_URL = '/GRC_PICASso/<ScreenName>?<Params>';

test.describe('<Area> - Feature Description (WF ref) @regression', () => {
  test.setTimeout(180_000);

  test('SCENARIO-ID — human-readable description',
    async ({ page, <pageFixture> }) => {
      await allure.suite('<Area> / Feature');
      await allure.severity('critical');   // critical | major | minor | trivial
      await allure.tag('regression');       // regression | smoke | edge
      await allure.description('SCENARIO-ID: what is tested');

      await test.step('Navigate to target page', async () => {
        await page.goto(SEED_PAGE_URL);
        await <pageFixture>.waitForOSLoad();
      });

      await test.step('Verify expected state', async () => {
        // Use web-first assertions
        await expect(page.getByRole('heading', { name: 'Title' })).toBeVisible();
      });
    });
});
```

**Fixture mapping for destructured test arguments:**
| Area | Fixture Name | POM Class |
|------|-------------|-----------|
| auth | `loginPage` | `LoginPage` |
| landing | `landingPage` | `LandingPage` |
| products | `newProductPage` | `NewProductPage` |
| releases | `releaseDetailPage` | `ReleaseDetailPage` |
| doc | `docDetailsPage` | `DocDetailsPage` |
| doc (controls) | `controlDetailPage` | `ControlDetailPage` |
### Serial-Suite Decision (Required Before Writing Any `describe` Block)

Before choosing `test.describe()` vs `test.describe.serial()`, answer this question:

> **Does any test in this block read a `let` variable at describe scope that was WRITTEN by a previous test?**

| Condition | Correct mode | Reason |
|-----------|-------------|--------|
| Every test has its own `beforeEach` or in-test `goto()` and no describe-scope `let` is passed between tests | `test.describe()` | Tests are fully independent |
| A describe-scope `let url = ''` is set in test 1 and read by tests 2+ (no independent fallback) | `test.describe.serial()` | Genuine sequential dependency |
| `beforeAll` creates shared browser state (product, release, etc.) consumed by all tests | `test.describe.serial()` | Shared setup requires ordered execution |
| Describe-scope `let` is **reset inside every test that uses it** | `test.describe()` | No real cross-test state |

**Why it matters:** `test.describe.serial()` silently skips ALL remaining tests (shown as `-`) when any earlier test fails. Misuse inflates skip counts and hides real failures.

**How to add tests to an existing serial suite:**
If the suite has shared state (e.g., `let releaseDetailUrl = ''`), the new test MUST:
1. Read that shared variable (not call `goto()` independently), OR
2. Navigate to it but also set it as a fallback: `if (!releaseDetailUrl) { releaseDetailUrl = await findUrl(...); }`

**Audit command — verify no unnecessary serial suites in the spec file:**
```bash
grep -n "describe.serial" tests/<area>/<spec>.spec.ts
# For each hit, check whether tests 2+ read describe-scope let vars set by test 1
grep -n "^  let " tests/<area>/<spec>.spec.ts
```
If a `describe.serial` block has NO describe-scope `let` that is set in one test and read in another → convert to `test.describe()`.
### Step 3: Validate Locators in Browser (Playwright CLI / Codegen)

**This step uses the interactive Playwright CLI browser — not a test run.** Open the target environment, walk the full user journey manually, and verify every locator against the live DOM before running the test suite.

```bash
# Open interactive browser session (logs in with configured test user)
npm run inspect        # general pages
npm run inspect:doc    # DOC detail pages
npm run codegen        # record interactions → auto-generate locator suggestions
```

While in the browser session:
- Navigate to each page used by the test
- Inspect ARIA roles, accessible names, and element structure for every locator in the spec
- Confirm whether dropdowns are native `<select>` or OSUI custom widgets
- Confirm whether duplicate ARIA roles require `.first()`, `exact: true`, or container scoping
- Walk the full scenario flow step-by-step and observe DOM changes after each action
- Update spec locators and POM methods based on what you find

**After** browser validation, run headed to watch the full test execute:
```bash
npx playwright test tests/<area>/<spec>.spec.ts --project=<project> --headed --reporter=list --workers=1
```

Never finalize locators by guesswork — always inspect live before treating the spec as done.

### Step 4: Fix Locators Based on Live DOM

After headed runs, analyze error-context.md and screenshots in `test-results/`. Common patterns:

#### OutSystems Partial Refresh — Content Loads Asynchronously
OutSystems renders containers first, then fills content via AJAX. Never use immediate `textContent()` for data that loads after navigation — use web-first assertions that auto-retry:

```typescript
// WRONG — data not loaded yet
const text = await container.textContent() ?? '';
expect(/expected/.test(text)).toBe(true);

// CORRECT — auto-retries until content appears
await expect(container).toContainText(/expected/, { timeout: 15_000 });
```

#### Multiple Matching Elements — Ambiguous Locators
OutSystems pages often have duplicate ARIA roles (e.g., pipeline tabs + content tabs). Use `.first()` or exact matching:

```typescript
// Ambiguous — matches pipeline "Risk Summary Review" AND content "Risk Summary"
page.getByRole('tab', { name: 'Risk Summary' })

// Precise — exact match avoids pipeline stage collision
page.getByRole('tab', { name: 'Risk Summary', exact: true })

// When same exact name exists in two tablists, scope or use .first()
page.locator('[role="tablist"]').first().getByRole('tab', { name: 'Name' })
```

#### Buttons Conditionally Disabled by Business Rules
Some buttons are disabled until prerequisites are met (e.g., mandatory roles assigned). Handle both states:

```typescript
const btn = page.getByRole('button', { name: /Action Button/i });
await expect(btn).toBeVisible({ timeout: 30_000 });
const isDisabled = await btn.isDisabled().catch(() => false);
if (isDisabled) {
  // Verify prerequisite indicator is shown (expected gating)
  await expect(prerequisiteIndicator).toBeVisible();
} else {
  await expect(btn).toBeEnabled();
}
```

#### OutSystems Select Widgets Are Not Native `<select>`
OSUI dropdowns don't work with Playwright's `selectOption()`. Use click → type → pick:

```typescript
// WRONG — OutSystems custom dropdown, not native select
await page.selectOption('#dropdown', 'value');

// CORRECT — interact with OSUI dropdown widget
await dropdown.click();
await dropdown.pressSequentially('Option text', { delay: 50 });
await page.getByRole('option', { name: 'Option text' }).click();
```

#### Label/Text Spelling Variations
OutSystems labels may vary (singular vs plural, abbreviated). Use flexible regex:
```typescript
page.getByRole('tab', { name: /Monitor Actions? Closure/i })
page.getByText(/Roles?\s*&?\s*Responsibilit/i)
```

### Step 5: Terminal Run (Headless)
```bash
npx playwright test tests/<area>/<spec>.spec.ts --project=<project> --reporter=list --workers=1
npx tsc --noEmit  # verify no TS errors in the project
```
All tests must pass. If a test fails due to a product defect (not a locator/script issue), use `test.fail()` — never weaken assertions.

### Step 5b: Write Execution Notes to Tracker

After each test run, update the tracker `execution_notes` field with a concise, human-readable summary.

**CRITICAL — Clear notes on every run:**
Always overwrite (not append) execution notes. If a previously failing test now passes, the old failure reason must be removed. If the old note is left in place, stale failure reasons accumulate and show false failures in the tracker UI.

```bash
# Clear notes before writing new ones (pass empty string to reset)
npx tsx scripts/tracker.ts notes <SCENARIO-ID> ""

# Then write the new note
npx tsx scripts/tracker.ts notes <SCENARIO-ID> "Passed: tab switch verified, all headers present."
```

**Execution Notes format rules:**

| Outcome | Format |
|---------|--------|
| Pass | `Passed: <one-line description of what was verified>.` |
| Timeout | `Failed: Timeout — element not loaded within limit (possible performance issue or missing locator).` |
| Assertion mismatch | `Failed: <expected> not found in <actual context>. Example: expected "name" column header, received ["activity", "description", ...].` |
| Defect (test.fail) | `Defect: <SCENARIO-ID> — <short description>. Known bug: <reason>. Marked test.fail().` |
| On-hold / skipped | `Skipped: <reason why not applicable, e.g. role/privilege not assigned to test user>.` |

**Do NOT paste raw Playwright stack traces or call logs into execution notes.** Translate the error into a plain-English sentence:

```
// WRONG — raw trace dump
Failed: TimeoutError: locator.selectOption: Timeout 15000ms exceeded. Call log:
  - waiting for getByRole('combobox', { name: 'Month' }).last()
  - locator resolved to <select tabindex="-1" ...>
  - attempting select option action
  - 30 × waiting for element to be visible and enabled — did not find some options
  at src/pages/new-product.page.ts:1055

// CORRECT — concise human note
Failed: Timeout — month dropdown option not selectable within 15 s (flatpickr month select, possible timing issue).
```

```
// WRONG — raw assertion dump
Failed: expect(received).toContain(expected) Expected: "name"
Received array: ["activity", "description", "status", "product", ...]
at src/pages/landing.page.ts:689

// CORRECT
Failed: "name" column header not found in My Tasks tab. Actual headers: activity, description, status, product, release, vesta id…
```

### Step 6: Update Tracker DB

> **CRITICAL:** `automation_state` and `execution_status` are **two independent fields** — both must always be updated together. Setting only `auto-state automated` leaves `execution_status` as `not-executed`, which misrepresents the actual test result in reports.

```bash
# Always set BOTH fields for every scenario — never just one
npx tsx scripts/tracker.ts auto-state <SCENARIO-ID> automated
npx tsx scripts/tracker.ts exec-status <SCENARIO-ID> passed

# For product defects (test marked test.fail())
npx tsx scripts/tracker.ts auto-state <SCENARIO-ID> automated
npx tsx scripts/tracker.ts exec-status <SCENARIO-ID> failed-defect

# For scenarios that cannot be automated (out of scope)
npx tsx scripts/tracker.ts auto-state <SCENARIO-ID> on-hold
# exec-status stays not-executed — correct for on-hold
```

### Step 7: Commit & Push
```bash
git add tests/<area>/<spec>.spec.ts playwright.config.ts
git add src/locators/<locator-file>.ts src/pages/<page-file>.ts  # if modified
git add -f config/scenarios.db
git commit -m "feat(<area>): add <scope> test specs (N tests)

New spec files: ...
Tracker: N scenarios → automated/passed"
git push origin feature/<area>-<scope>-scenarios
```

### Step 8: Add Playwright Config Projects (if needed)
For spec files that need isolated execution or dependency chains, add a project to `playwright.config.ts`:
```typescript
{
  name: '<area>-<spec-name>',
  testMatch: /<spec-name>\.spec\.ts/,
  dependencies: ['setup'],
},
```
Also add to `chromium` project's `testIgnore` array to avoid double-running.

Not all spec files need dedicated projects — only those with specific dependency chains or that should run in isolation from the main `chromium` project.

## Area-Specific Reference

### DOC Workflow

DOC pages have a **pipeline flow** (tablist of stages) and **content tabs** (tablist of detail panels). The pipeline tablist renders first.

**Seed DOC URLs:**
| DOC | URL | Stage |
|-----|-----|-------|
| DOC 800 | `/GRC_PICASso_DOC/DOCDetail?DOCId=800&ProductId=1162` | Controls Scoping |
| DOC 538 | `/GRC_PICASso_DOC/DOCDetail?DOCId=538&ProductId=944` | Actions Closure |
| DOC 273 | `/GRC_PICASso_DOC/DOCDetail?DOCId=273&ProductId=898` | Completed/Certified |

**Pipeline stage date verification** — dates load async inside tab children:
```typescript
const pipelineContainer = page.locator('[role="tablist"]').first();
await expect(pipelineContainer).toContainText(/\d{1,2} \w{3} \d{4}/, { timeout: 15_000 });
```

**Key POM methods:**
```typescript
docDetailsPage.waitForOSLoad()
docDetailsPage.clickDigitalOfferDetailsTab()
docDetailsPage.clickITSChecklistTab()
docDetailsPage.riskSummary.clickRiskSummaryTab()
docDetailsPage.riskSummary.expectRiskSummarySectionsVisible()
docDetailsPage.certification.clickCertificationDecisionTab()
docDetailsPage.certification.expectDocApprovalsSectionVisible()
docDetailsPage.certification.expectMonitorActionClosureStageVisible()
```

### Products Workflow

```typescript
newProductPage.waitForOSLoad()
newProductPage.goto()
// Use landingPage to navigate to product list first
```

### Releases Workflow

```typescript
releaseDetailPage.waitForOSLoad()
// Navigate via URL: /GRC_PICASso/ReleaseDetail?ReleaseId=XXX
```

## Common Pitfalls

1. **Never use `waitForTimeout()` or `networkidle`** — OutSystems uses partial refresh; use `waitForOSLoad()` or web-first assertions
2. **Async content loading** — always use `toContainText()` / `toHaveText()` / `toBeVisible()` with timeout, never snapshot `textContent()` for dynamically loaded data
3. **Duplicate ARIA roles** — scope locators to the correct container or use `.first()` / `exact: true`
4. **OSUI dropdowns are not native selects** — use click + `pressSequentially` + option click
5. **Buttons gated by business rules** — check disabled state before testing interactions
6. **Import from fixtures, not @playwright/test** — always `import { test, expect } from '../../src/fixtures'`
7. **Allure metadata is mandatory** — every test needs `suite`, `severity`, `tag`, `description`
8. **Scenario IDs must match tracker** — use the exact `AREA-ACTION-###` or `WF##-####` format from the tracker DB
9. **Both tracker fields must be updated together** — after every passing run, set both `auto-state automated` AND `exec-status passed` for each scenario. The Playwright reporters (list, HTML, Allure, JSON) write to files only — they never update `scenarios.db`. Forgetting `exec-status` leaves the scenario as `automated / not-executed`, which is a false state.
10. **Never use `test.describe.serial()` for independent tests** — if every test in the block does its own `goto()` (or `beforeEach` navigates) and there is NO describe-scope `let` variable that is written in test N and read in test N+1, the suite must use `test.describe()`. Using serial on independent tests silently skips all remaining tests on the first failure, masking real regressions. See the Serial-Suite Decision section above.
11. **Never call `test.skip()` inside `test.step()`** — calling `test.skip()` inside a step callback skips the ENTIRE test immediately, not just the step. When a condition is checked inside a step, capture the result as an outer `let` variable, `return` early from the step if the condition is not met (so the step passes), then call `test.skip()` at test-body level AFTER the step:
    ```typescript
    // WRONG — test.skip() inside a step callback
    await test.step('Check button visibility', async () => {
      const isVisible = await btn.isVisible().catch(() => false);
      if (!isVisible) {
        test.skip(true, 'Button not found.');
        return; // this return exits the step callback, but skip already propagated
      }
    });
    
    // CORRECT — capture flag, return early from step, skip at test level
    let btnVisible = false;
    await test.step('Check button visibility', async () => {
      btnVisible = await btn.isVisible().catch(() => false);
      if (!btnVisible) return; // step passes cleanly
    });
    test.skip(!btnVisible, 'Button not found — skipping test.');
    ```
    Exception: `test.skip()` called BETWEEN steps at the test-body level (not inside a step callback) is correct and should not be changed.
