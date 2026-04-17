# Refactoring Plan: Playwright Tests & Tracker

> Last updated: 2026-04-17
> Status tracking: ✅ Done | 🔄 In Progress | ⬜ Pending

---

## Phase 1a — Auth Storage State ⬜ PENDING

Eliminate per-test UI login (5–10 s per test) by saving browser cookies once in a setup project and reusing them across all specs.

### Tasks
- [ ] Create `tests/auth/auth.setup.ts` — saves `storageState` to `.auth/user.json`
- [ ] Add `AUTH_FILE` constant to `playwright.config.ts`
- [ ] Add `storageState: AUTH_FILE` to all 22 named projects in `playwright.config.ts`
- [ ] Add `.auth/` to `.gitignore`
- [ ] Add `dependencies: ['setup']` to 4 standalone DOC projects that previously had none:
  - `doc-detail-actions`, `doc-detail-risk-summary`, `doc-detail-certification`, `doc-lifecycle`
- [ ] Validate: auth state file created (~30 KB), test navigates without redirect to `/Login`

---

## Phase 1b — Remove Login Blocks from Spec Files ⬜ PENDING

Remove redundant `beforeEach` login blocks from all 49 spec files. Two patterns:

**Pattern A** (28 files) — entire `beforeEach` removed (tests navigate to URL in body):

- All `tests/doc/*.spec.ts` (except `new-product-creation-digital-offer`)
- `tests/products/product-details-actions.spec.ts`, `product-type-warning.spec.ts`
- `tests/releases/clone-release.spec.ts`, `create-new-release.spec.ts`, `release-detail-header.spec.ts`
- `tests/landing/my-docs-tab.spec.ts`

**Pattern B** (21 files) — login lines replaced with `landingPage.goto()`:
- All `tests/landing/*.spec.ts` (except `my-docs-tab`)
- `tests/products/my-products-tab.spec.ts`, `risk-profile.spec.ts`, `status-mapping.spec.ts`, `tracking-tools.spec.ts`, `product-inactivation.spec.ts`
- `tests/doc/new-product-creation-digital-offer.spec.ts`
- All `tests/releases/*.spec.ts` with landing navigation

### Tasks
- [ ] Pattern A: Remove entire `beforeEach` block from 28 files
- [ ] Pattern B: Strip login lines, keep `landingPage.goto()` in 21 files
- [ ] Fix `tests/products/new-product-creation.spec.ts` — replace hardcoded URL with `newProductPage.goto()`
- [ ] Remove leftover `userCredentials` from `beforeEach` params (16 files)
- [ ] Keep `userCredentials` in `landing-my-tasks.spec.ts` (legitimate test-body use at line 355)
- [ ] Remove `test.describe.configure({ mode: 'serial' })` from `doc-detail-actions.spec.ts` (read-only)
- [ ] Remove `test.describe.configure({ mode: 'serial' })` from `doc-history.spec.ts` (read-only)
- [ ] Set explicit `workers: 4` (with `WORKERS` env override) in `playwright.config.ts`

---

## Phase 2 — Split `DocDetailsPage` ⬜ PENDING

`src/pages/doc-details.page.ts` is ~1,737 lines. Split into tab-specific component classes.

### Target structure
```
src/pages/doc-details/
  index.ts                    # Re-exports DocDetailsPage (main entry)
  doc-details.page.ts         # Header, status badge, top-level nav only (~200 lines)
  tabs/
    offer.tab.ts              # Offer tab methods
    roles.tab.ts              # Roles tab methods
    its.tab.ts                # ITS tab methods
    risk-summary.tab.ts       # Risk Summary tab methods
    certification.tab.ts      # Certification tab methods
    actions.tab.ts            # Actions tab methods
    history.tab.ts            # History tab methods
  helpers/
    click-tab-with-retry.ts   # `clickTabWithRetry(page, tabName)` helper
    expect-column-headers.ts  # `expectColumnHeaders(page, headers[])` helper
```

### Tasks
- [ ] Extract `clickTabWithRetry` and `expectColumnHeaders` into helpers
- [ ] Create tab component classes (one per tab)
- [ ] Update `DocDetailsPage` to compose tab classes
- [ ] Update all spec imports (no breaking changes — re-export from index)
- [ ] Typecheck passes after split

---

## Phase 3 — Split `src/tracker/operations.ts` ⬜ PENDING

`operations.ts` is ~1,085 lines. Split into focused modules.

### Target structure
```
src/tracker/
  crud.ts           # listScenarios, getScenario, upsertScenario, deleteScenario
  sync.ts           # syncWithSpecFiles, markStaleAsHold
  spec-parser.ts    # parseSpecFile, extractScenarioIds, getSpecRunTargets
  stats.ts          # getStats, getFeatureAreaStats, getAutomationSummary
  import-export.ts  # importFromJson, exportToJson, exportToCsv
  operations.ts     # Thin re-export shim (backwards compat)
```

### Tasks
- [ ] Extract CRUD functions into `crud.ts`
- [ ] Extract sync logic into `sync.ts`
- [ ] Extract spec-parsing helpers into `spec-parser.ts`
- [ ] Extract stats functions into `stats.ts`
- [ ] Extract import/export into `import-export.ts`
- [ ] Update `operations.ts` to re-export everything (no breaking changes for CLI/UI)
- [ ] Fix `upsertScenario()` to also update `scenario_details` rows (currently inserts only)
- [ ] Typecheck passes after split

---

## Phase 4 — Remove Hardcoded QA URLs ⬜ PENDING

Some spec files have hardcoded `https://qa.leap.schneider-electric.com/...` URLs. Replace with env-driven construction.

### Tasks
- [ ] Audit all spec files for hardcoded base URLs (`grep -r "qa.leap" tests/`)
- [ ] Add `buildUrl(path: string)` helper to `src/helpers/url.helper.ts` using `process.env.BASE_URL`
- [ ] Replace hardcoded URLs with `buildUrl(...)` calls
- [ ] Simplify `testIgnore` lists in `playwright.config.ts` — extract to a shared constant array

---

## Phase 5 — Tracker DB Improvements ⬜ PENDING

### Tasks
- [ ] Extract DB migrations to `src/tracker/migrations.ts` — replace inline `CREATE TABLE` strings with versioned migration objects
- [ ] Add migration rollback stubs
- [ ] Fix `upsertScenario()` to update `scenario_details` rows when steps/expected_results change (currently only inserts new records)
- [ ] Add DB index on `scenarios(feature_area)` and `scenarios(automation_state)` for faster filtered queries

---

## Phase 6 — Infrastructure & UX Polish ⬜ PENDING

### Tasks
- [ ] Fix `BasePage.goto()` — add retry with exponential backoff for OutSystems cold-start timeouts
- [ ] Build Tailwind CSS locally for tracker UI (remove CDN dependency in `index.html`)
- [ ] Add `npm run tracker:build-css` script
- [ ] Add `--dry-run` flag to `tracker:sync` command
- [ ] Tracker UI: persist filter state in `localStorage` so it survives page refresh

---

## Known Issues / Regression

### Tracker UI — Steps Not Displaying ⬜ UNRESOLVED

**Reported**: Steps and expected results no longer show in scenario dropdown cards after Phase 1b changes.

**Investigation status**:
- DB intact: `scenario_details` has 381 rows, 365 with non-empty steps, 0 orphans ✓
- API intact: `GET /api/scenarios/DOC-ACTIONS-001` returns `steps: [...]` ✓
- HTML rendering code (`renderScenarioItem`) is correct ✓
- `tracker:sync` before/after — steps count unchanged ✓

**Next steps to investigate**:
1. Check browser console for JS errors when UI is open
2. Verify the issue occurs for scenarios that have steps in DB (e.g. `DOC-ACTIONS-001`, `DOC-HISTORY-001`) — not just scenarios with no `scenario_details` rows
3. Try hard-refresh / restart tracker server to clear in-memory cache

---

## Progress Summary

| Phase | Description | Status |
|-------|-------------|--------|
| 1a | Auth storage state | ✅ Done |
| 1b | Remove login blocks | ✅ Done |
| 2 | Split DocDetailsPage | ⬜ Pending |
| 3 | Split operations.ts | ⬜ Pending |
| 4 | Remove hardcoded URLs | ⬜ Pending |
| 5 | Tracker DB improvements | ⬜ Pending |
| 6 | Infrastructure & UX polish | ⬜ Pending |
