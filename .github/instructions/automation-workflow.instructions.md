```instructions
# Global Automation Workflow — End-to-End Test Creation Process

This is the **canonical, mandatory workflow** for creating, validating, and tracking every automation test
in this repository. Follow it in full for every scenario. Steps may be parallelised across agents where noted.

---

## The 7-Step Workflow

```
PLAN → STEPS → CODE → MCP VALIDATE → TERMINAL RUN → UPDATE PLAN → PROPOSE NEXT
```

---

### STEP 1 — Identify the Scenario from the Automation Test Plan

**Source:** `docs/ai/automation-testing-plan.md` (and `.html`)

1. Open the plan and find the **next `[ ]` (not-yet-automated) scenario** at the highest priority level (`P1` before `P2` before `P3`).
2. Read the full workflow section it belongs to (WF number, spec file, page object references).
3. Check `docs/ai/current-automation-coverage-matrix.md` to confirm no equivalent test already exists.
4. Record:
   - `TC ID` (e.g., `ATC-11.14.1`)
   - `Workflow` (e.g., WF 11.14 DOC Certification)
   - `Priority` (P1/P2/P3)
   - `Target spec file` (e.g., `tests/doc/doc-detail-certification.spec.ts`)
   - `Target page object` (e.g., `src/pages/doc-details.page.ts`)

> **Multi-agent parallelism:** When taking on a batch of scenarios from the same workflow section,
> spawn one agent per scenario or per spec file. Agents share read access to the plan but write to
> separate spec files. Merge updates to `automation-testing-plan.md` after all agents complete.

---

### STEP 2 — Write Test Steps and Expected Results; Update the Plan

Before writing any code:

1. Expand the scenario into **numbered test steps** and **expected results** for each step.
2. Identify: preconditions (roles, data state, URL), actions, and assertions.
3. Use role codes from `picasso-roles-and-access.md` for any access-dependent step.
4. Write the steps into the **spec section** of `docs/ai/automation-testing-plan.md` directly under the TC ID.
5. Change the plan marker from `[ ]` to `[~]` (in-progress) while the scenario is being automated.

**Step template:**

```markdown
#### `ATC-XX.YY.ZZ` — <Title>

**Preconditions:** <role, URL, data state>

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to … | Page loads, heading "…" visible |
| 2 | Click … | … opens / … changes to … |
| 3 | Assert … | … is visible / enabled / contains "…" |
```

---

### STEP 3 — Create the Playwright TypeScript Test Code

Follow the **four-layer rule** (`testing-patterns.instructions.md`):

```
src/locators/   → new locator factory entries (extend existing file)
src/pages/      → new/updated page object methods
tests/          → new test(s) using fixtures + Allure metadata
```

Rules:
- Match the style of the nearest existing spec in the same feature folder.
- Add `test.setTimeout()` appropriate for the scenario (see `outsystems-picasso.instructions.md`).
- Add all Allure metadata: `suite`, `severity`, `tag`, `description`.
- Use `test.step()` for each meaningful action group.
- **Do NOT run the test yet** — locators are drafts until MCP validates them in Step 4.
- Mark the TC ID in a comment above each `test()` block: `// ATC-XX.YY.ZZ`

**Draft locators** — use the best semantic guess; they will be verified in Step 4:
```typescript
// DRAFT — verify in MCP Step 4
readonly certDecisionTab = this.page.getByRole('tab', { name: 'Certification Decision' });
```

---

### STEP 4 — Execute in Browser via Playwright MCP (Chrome)

**This is mandatory for every new test before terminal execution.**

For each test scenario:

1. Open the target page in Playwright MCP Chrome browser.
2. Take a **DOM snapshot** (`browser_snapshot`) of the relevant section.
3. Verify **every draft locator** from Step 3 against the actual DOM:
   - Confirm exact text, role, and uniqueness.
   - If the locator resolves to multiple elements, add scope (`.first()`, parent container).
   - If the element is an OSUI custom widget, switch to the correct interaction pattern (see `outsystems-picasso.instructions.md`).
4. Perform the **full user journey** in MCP:
   - Navigate to the page, click through the UI, observe actual behaviour.
   - Note any unexpected states, missing elements, or app errors.
5. Update all draft locators in `src/locators/` with the verified values.
6. Update page object methods if the actual interaction pattern differs from the draft.

> **Re-run MCP at any time** if a subsequent terminal run reveals an unexpected failure —
> go back to the DOM and re-verify before changing code.

**MCP findings to record:**
- Which locators were confirmed, corrected, or required a fallback
- Any product behaviour that differs from the spec (potential defects)
- Data state required for the test to run (URL, DOC status, user role)

---

### STEP 5 — Execute via `npx playwright test`; Fix All Issues

```bash
# Targeted run — always prefer this over full suite
npx playwright test tests/<feature>/<spec>.spec.ts --project=pw-autotest

# With trace for debugging
npx playwright test tests/<feature>/<spec>.spec.ts --project=pw-autotest --trace=on

# Specific test by title
npx playwright test tests/<feature>/<spec>.spec.ts --project=pw-autotest --grep "ATC-XX.YY.ZZ"
```

**Fix loop:**

| Failure type | Action |
|-------------|--------|
| Locator not found / strict mode violation | Re-run MCP snapshot → fix locator → rerun |
| Element not visible / timeout | Check loading pattern → add/fix readiness signal → rerun |
| Wrong assertion value | Re-check expected vs actual in MCP → update assertion or classify defect |
| Product behaviour contradicts spec | **Do NOT weaken assertion** — mark as `likely defect`, use `test.fail()` |
| Data state missing | Update `.doc-state.json` or find eligible data in QA → document in plan |
| TypeScript compile error | Run `npx tsc --noEmit` → fix type errors → rerun |

**Pass criteria:**
- `npx playwright test` exits with code `0` for the target spec
- All assertions reflect genuine product behaviour (no weakened assertions)
- `npx tsc --noEmit` produces no errors

---

### STEP 6 — Update Execution Status in the Automation Test Plans

After a stable run (all tests green, defects recorded):

1. **`docs/ai/automation-testing-plan.md`**:
   - Change `[ ]` → `[x]` for passing tests
   - Change `[ ]` → `[~]` for skipped/defect tests (add reason inline)
   - Update the **runtime status table** in the WF 11.0 section (for DOC) or equivalent
   - Add new TC IDs and script labels to the appropriate scenario block
   - Add automated scenario bullet with label `🟢 passed`, `🔴 failed: defect`, or `⚪ blocked`

2. **`docs/ai/current-automation-coverage-matrix.md`**:
   - Add new row(s) to the Feature-to-test matrix
   - Add new row(s) to the Test-to-implementation matrix if a new spec was created
   - Update the Page object / Locator factory matrices if new files were created

3. **`docs/ai/automation-testing-plan.html`**:
   - Re-generate from the updated `.md` file (or update the HTML directly to keep it in sync)

4. Confirm barrel exports in `src/pages/index.ts` are up to date.

---

### STEP 7 — Propose Plan for the Next Automation Scope

After updating the plan, output a structured **Next Scope Proposal**:

```markdown
## Next Automation Scope — Proposal

### Newly Completed This Session
| TC ID | Title | Status |
|-------|-------|--------|

### Recommended Next Scenarios (Priority Order)
| # | TC ID | WF | Title | Priority | Effort | Rationale |
|---|-------|----|----|---------|--------|-----------|
| 1 | ATC-… | WF … | … | P1 | 0.5d | Next in sequence, data available |
| 2 | … | … | … | P2 | 1d | … |

### Blockers to Resolve Before Next Session
| Blocker | Owned By | Resolution Path |
|---------|----------|----------------|

### Parallel Agent Plan (if batch ≥ 3 scenarios)
- Agent A: <spec file> — <TC IDs>
- Agent B: <spec file> — <TC IDs>
- Agent C: <spec file> — <TC IDs>
```

---

## Multi-Agent Parallelism Rules

When the batch includes **3 or more independent scenarios**:

| Rule | Detail |
|------|--------|
| **One agent per spec file** | Agents never write to the same spec file simultaneously |
| **Shared reads** | All agents read `automation-testing-plan.md`, `picasso-roles-and-access.md`, and instruction files |
| **No shared write on plan** | Each agent records its own TC results; a coordinator agent merges at the end |
| **Independent MCP sessions** | Each agent runs its own MCP browser session for its assigned scenarios |
| **Sequential terminal runs** | `npx playwright test` runs are sequential per agent; do not run two suites in parallel on the same machine |
| **Merge order** | Locators first → page objects → tests → plan updates → coverage matrix |

---

## Quick Reference — Key Files

| Purpose | File |
|---------|------|
| Automation test plan (source of truth) | `docs/ai/automation-testing-plan.md` |
| Coverage matrix | `docs/ai/current-automation-coverage-matrix.md` |
| OutSystems patterns | `.github/instructions/outsystems-picasso.instructions.md` |
| TypeScript conventions | `.github/instructions/typescript.instructions.md` |
| Testing patterns & assertions | `.github/instructions/testing-patterns.instructions.md` |
| Quality checklist | `.github/instructions/quality-checklist.instructions.md` |
| Roles & privileges | `.github/instructions/picasso-roles-and-access.md` |
| Framework rules | `.github/instructions/pw-autotest.instructions.md` |
| Naming conventions | `.github/instructions/naming.instructions.md` |

---

## Non-Negotiable Rules (Apply at Every Step)

- ❌ Never use `waitForTimeout()` or `networkidle`
- ❌ Never use `selectOption()` on OSUI/vscomp custom dropdowns
- ❌ Never weaken an assertion to match broken product behaviour — use `test.fail()` and record the defect
- ❌ Never hardcode row counts, IDs, or environment-specific URLs
- ❌ Never skip MCP validation for a new or significantly changed test
- ✅ Always use `pressSequentially({ delay: 150 })` for search/autocomplete fields
- ✅ Always scope grid locators to the active `tabpanel`
- ✅ Always add Allure metadata in every test
- ✅ Always update the plan after a terminal run
- ✅ Always run `npx tsc --noEmit` before declaring a test "done"
```
