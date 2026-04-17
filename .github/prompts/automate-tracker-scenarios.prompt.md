# Automate Tracker Scenarios — Canonical Per-Batch Prompt

Use this prompt every time you need to automate a new batch of pending test scenarios from the tracker.
Replace `{{SUBSECTIONS}}` with the subsection names (e.g. "11.1 Product Setup for DOC, 11.2 DOC Initiation").

---

## Task

Automate all **pending** (`automation_state = 'pending'`) scenarios for the following subsections:

> **{{SUBSECTIONS}}**

Workflow: **{{WORKFLOW}}** (e.g. "Digital Offer Certification (DOC)")

---

## Mandatory Process — Follow Every Step in Order

### 1 · QUERY — Get the pending scenarios from the tracker

```bash
node -e "
const db = require('better-sqlite3')('config/scenarios.db');
const rows = db.prepare(\"SELECT id, title, priority, description FROM scenarios WHERE workflow = '{{WORKFLOW}}' AND subsection IN ({{SUBSECTION_LIST}}) AND automation_state = 'pending' ORDER BY subsection, priority, id\").all();
rows.forEach(r => console.log(r.priority, r.id, '|', r.title));
db.close();
"
```

### 2 · REVIEW — Understand what already exists

- Read the nearest existing spec file(s) for the same feature area (`tests/doc/`, `tests/products/`, etc.)
- Read the relevant locator file (`src/locators/*.locators.ts`)
- Read the relevant page object (`src/pages/*.page.ts`)
- Read `src/fixtures/base.fixture.ts` to understand available fixtures
- Identify which scenarios are already covered and skip them

### 3 · FILL TEST STEPS — Write steps + expected results for each scenario

For every pending scenario, expand into:

```
**Preconditions:** <role, URL, initial data state>

| Step | Action | Expected Result |
|------|--------|----------------|
| 1    | ...    | ...            |
```

Use role codes from `.github/instructions/picasso-roles-and-access.md`.
Prioritize scenarios: P1 → P2 → P3.

### 4 · CODE — Write the Playwright TypeScript test

**Four-layer rule (mandatory):**
```
src/locators/   → element selectors ONLY, zero logic
src/pages/      → actions and assertions, NO inline locators
tests/          → describe blocks + test cases + Allure metadata
```

**Code rules:**
- Tests import from `../../src/fixtures` (not directly from `@playwright/test`)
- All locators go in the existing `src/locators/*.locators.ts` file (extend, don't create new unless new area)
- All POM methods go in the existing `src/pages/*.page.ts`
- Never put `page.locator()` calls inside test files
- Never call `expect()` directly in test files — always via POM assertion methods
- Use `test.step()` for each meaningful action group
- Include all Allure metadata: `suite`, `severity`, `tag`, `description`
- Mark TC ID in comment above each `test()` block: `// DOC-SETUP-002`
- Add `test.setTimeout(360_000)` when the test involves OutSystems API calls
- Group related scenarios in one `test.describe()` block per subsection
- Prefer independent tests; only use `describe.serial` when a test captures state needed by the next test

**OutSystems-specific rules:**
- NEVER use `waitForTimeout()` or `networkidle`
- User lookup fields: `pressSequentially('text', { delay: 150 })` (NOT `fill()`)
- Native `<select>`: `selectOption({ label: '...' })` 
- OSUI custom dropdowns: click → `pressSequentially()` → click option
- Readiness signal after navigation: wait for key heading/element to be visible

**Scenario skipping rules:**
- Scenarios requiring BackOffice setup (auto-created DOC triggers, date-based triggers) → mark as `on-hold` with note
- Scenarios requiring a second user account with specific privilege → add `test.skip()` with clear reason
- Scenarios requiring a specific product state that can't be set up in test → implement as setup fixture or skip

### 5 · CLI VALIDATE — Verify locators in headed browser

```bash
# Open Playwright CLI inspector on the relevant page
npx playwright open --project=pw-autotest "https://qa.picasso.app/GRC_PICASso/..."

# Or run codegen for the flow
npx playwright codegen --project=pw-autotest "https://qa.picasso.app/GRC_PICASso/..."
```

Walk the full user journey. For each locator in the new test:
1. Inspect the element in the browser
2. Verify the locator resolves to exactly 1 element
3. Fix locator if needed — update `src/locators/*.locators.ts`
4. Add POM methods for any interaction not yet covered

### 6 · RUN — Execute the spec and fix failures

```bash
npx playwright test tests/doc/<spec-file>.spec.ts --project=pw-autotest --reporter=list
```

Fix any failures:
- Locator not found → inspect DOM and update locator
- Timeout → add explicit wait or increase locator timeout
- Assertion failure = product defect → use `test.fail()` and add comment explaining expected vs actual
- NEVER weaken assertions to make a test pass

TypeScript check after code changes:
```bash
npx tsc --noEmit
```

### 7 · UPDATE TRACKER — Mark automated scenarios

```bash
node -e "
const db = require('better-sqlite3')('config/scenarios.db');
const ids = ['DOC-SETUP-002', 'DOC-SETUP-003']; // replace with actual IDs
ids.forEach(id => {
  db.prepare(\"UPDATE scenarios SET automation_state = 'automated', spec_file = '{{SPEC_FILE}}', updated_at = datetime('now') WHERE id = ?\").run(id);
});
console.log('Updated', ids.length, 'scenarios');
db.close();
"
```

### 8 · PROPOSE NEXT

After completing the batch, output a structured next-scope proposal:
- Next subsection(s) ready for automation
- Estimated scenario count and priorities
- Blockers or pre-requisites (role setup, data setup, etc.)

---

## Common Scenario Categories & How to Handle Them

| Category | Approach |
|----------|----------|
| UI element visible for role X | Use fixture user, navigate to page, assert element visible/hidden |
| Form validation | Fill form partially, attempt submit, assert error messages |
| Button enabled/disabled based on state | Navigate to correct DOC stage, assert button state |
| Toggle/filter behavior | Click toggle, assert table row count changes |
| Status transition | Perform action, wait for status badge to update |
| Auto-created DOC | Requires BackOffice trigger → mark `on-hold` |
| Privilege-specific (requires role B) | Use `test.skip()` with note on required account |
| Date-based trigger | Cannot automate reliably → mark `on-hold` |

---

## File Creation Checklist

Before writing the first line of test code, confirm:

- [ ] Existing locator file read and understood
- [ ] Existing POM read and understood  
- [ ] Nearest existing spec read and understood
- [ ] Test steps written for each P1 scenario
- [ ] No locator added without CLI validation
- [ ] All tests use `test` from `../../src/fixtures`
- [ ] All Allure metadata present
- [ ] TypeScript compiles without errors
- [ ] Tests pass (or `test.fail()` used for defects)
- [ ] Tracker updated for all automated scenarios
