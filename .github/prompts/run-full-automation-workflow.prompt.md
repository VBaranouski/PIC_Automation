# Run Full Automation Workflow

Use this prompt to execute the complete end-to-end automation workflow for one or more test scenarios.
Follow all 7 steps without skipping. This prompt is the **entry point** for every new test creation session.

---

## Before Starting — Read These Files

1. `.github/instructions/automation-workflow.instructions.md` ← **THE MASTER WORKFLOW — read first**
2. `.github/instructions/pw-autotest.instructions.md`
3. `.github/instructions/outsystems-picasso.instructions.md`
4. `.github/instructions/testing-patterns.instructions.md`
5. `.github/instructions/quality-checklist.instructions.md`
6. `.github/instructions/picasso-roles-and-access.md`
7. `.github/instructions/naming.instructions.md`
8. `docs/ai/automation-testing-plan.md` ← source of scenarios
9. `docs/ai/current-automation-coverage-matrix.md` ← confirm no duplicate

---

## Inputs

Provide one of:

- **TC IDs** to automate (e.g., `ATC-11.14.1, ATC-11.14.2, ATC-11.14.3`)
- **Workflow section** (e.g., "WF 11.14 DOC Certification")
- **"next batch"** — pick the next N highest-priority `[ ]` scenarios from the plan

Optional overrides:
- `spec_file:` override target spec file
- `priority_filter:` limit to `P1` only
- `agent_count:` number of parallel agents to spawn (default: 1 per spec file)

---

## Execution Checklist

Work through each step and check it off:

- [ ] **Step 1** — Scenario identified from `automation-testing-plan.md`; TC ID, WF, spec file, POM recorded
- [ ] **Step 2** — Test steps + expected results written; plan marker changed to `[~]`
- [ ] **Step 3** — TypeScript code drafted (locators, page object methods, test file with Allure metadata)
- [ ] **Step 4** — Headed Playwright CLI browser or codegen session opened; all locators verified against live DOM; interaction patterns confirmed; page object methods updated
- [ ] **Step 5** — `npx playwright test <spec> --project=pw-autotest` passes; `npx tsc --noEmit` clean; defects recorded with `test.fail()`
- [ ] **Step 6** — `automation-testing-plan.md`, `current-automation-coverage-matrix.md`, and `.html` version updated with new TC status
- [ ] **Step 7** — Next scope proposal output (table of recommended next scenarios + parallel agent plan if batch ≥ 3)

---

## Parallel Agent Plan Template

When automating 3+ scenarios in one session:

```
Agent A → tests/<feature>/<spec-a>.spec.ts
  Scenarios: ATC-XX.Y.1, ATC-XX.Y.2
  Steps: 1 → 2 → 3 → 4 (CLI) → 5 (terminal) → report results

Agent B → tests/<feature>/<spec-b>.spec.ts
  Scenarios: ATC-XX.Y.3, ATC-XX.Y.4
  Steps: 1 → 2 → 3 → 4 (CLI) → 5 (terminal) → report results

Coordinator → merge TC status into automation-testing-plan.md → Step 6 → Step 7
```

Agents share: plan reads, instruction files, `.doc-state.json`
Agents do NOT share: write access to the same spec file or page object simultaneously

---

## Final Report Format

At the end of the session, output:

```markdown
## Session Report — <date>

### Completed TCs
| TC ID | Title | Spec | Status |
|-------|-------|------|--------|
| ATC-… | … | tests/… | 🟢 passed |

### Defects Recorded
| TC ID | Description | Test marker |
|-------|-------------|-------------|
| ATC-… | Save does not persist | test.fail() |

### Files Created / Modified
- `tests/…` — created
- `src/locators/…` — extended
- `src/pages/…` — extended
- `docs/ai/automation-testing-plan.md` — updated

### Next Scope (Top 5)
| # | TC ID | WF | Priority | Effort |
|---|-------|----|----|--------|
| 1 | … | … | P1 | 0.5d |
```

---

## Re-validate Rule

At **any point** during Steps 4–5, if a locator does not behave as expected in the terminal run,
**immediately re-open the headed Playwright CLI browser** and re-snapshot the relevant page section before
changing any code. Never change a locator based on a guess — always confirm in the live DOM first.
