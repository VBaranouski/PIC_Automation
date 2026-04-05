```instructions
# Quality Checklist, Common Pitfalls & Flaky-Test Prevention

> Consolidated from `temp-instructions/checklist.md`, `temp-instructions/common-pitfalls.md`,
> and `temp-instructions/flaky-tests.md`.

---

## Quick Checklist Before Committing

### Architecture (four-layer rule)
- [ ] Locators in `src/locators/*.locators.ts` as factory functions
- [ ] Page objects use `private readonly l` — no raw `page.locator()` inside POM
- [ ] Components created for UI patterns used in 2+ pages
- [ ] No `expect()` directly in test files — all via POM assertion methods
- [ ] POMs injected via fixtures — not instantiated in tests
- [ ] Class member order: private fields → constructor → actions → assertions → helpers

### TypeScript
- [ ] Imports use path aliases (`@pages/`, `@fixtures/`, `@locators/`, `@helpers/`)
- [ ] No `any` type
- [ ] All public POM methods have explicit return types

### Test quality
- [ ] Explored all target pages/tabs via MCP snapshots
- [ ] Used exact locator text from DOM (not guessed)
- [ ] Scoped grid elements to `tabpanel`
- [ ] No `networkidle`, no `waitForTimeout()`, no `selectOption()` on OSUI widgets
- [ ] No hardcoded row counts or dropdown values
- [ ] Correct `test.setTimeout()` for test type (see table in `outsystems-picasso.instructions.md`)
- [ ] All Allure metadata present
- [ ] TypeScript compiles clean (`npx tsc --noEmit`)
- [ ] Updated barrel exports in `src/pages/index.ts`
- [ ] Assertions are web-first — no `await value; expect(value)` pattern
- [ ] Uses `waitForOSScreenLoad()` after navigation / data-triggering actions
- [ ] `{ exact: true }` on any text locator that could partially match other elements
- [ ] `pressSequentially({ delay: 150 })` for any search/autocomplete input

---

## File Naming

| Type | Path | Convention |
|------|------|-----------|
| Test file | `tests/{feature}/{name}.spec.ts` | kebab-case |
| Page Object | `src/pages/{name}.page.ts` | kebab-case |
| Locators | `src/locators/{name}.locators.ts` | kebab-case |
| Barrel export | `src/pages/index.ts` | Always update when adding a new page |

---

## Top 10 Common Pitfalls

### 1. `waitForTimeout` — Always Banned

```typescript
// BAD
await page.waitForTimeout(3000);

// GOOD
await expect(page.getByTestId('result')).toBeVisible();
```

### 2. Non-Web-First Assertions

```typescript
// BAD — checks once, no retry
const text = await page.textContent('.msg');
expect(text).toBe('Done');

// GOOD — retries until timeout
await expect(page.getByText('Done')).toBeVisible();
```

### 3. Missing `await`

```typescript
// BAD
page.goto('/dashboard');
expect(page.getByText('Welcome')).toBeVisible();

// GOOD
await page.goto('/dashboard');
await expect(page.getByText('Welcome')).toBeVisible();
```

### 4. Hardcoded URLs

```typescript
// BAD
await page.goto('http://staging.example.com/login');

// GOOD — uses baseURL from config
await page.goto('/login');
```

### 5. CSS Selectors Instead of Roles

```typescript
// BAD
await page.click('#submit-btn');

// GOOD
await page.getByRole('button', { name: 'Submit' }).click();
```

### 6. Shared State Between Tests

Each test must be fully independent. Use fixtures or setup projects for shared state.

### 7. `selectOption()` on OSUI Custom Widgets

`selectOption()` silently does nothing on vscomp/osui-dropdown widgets. Always check the DOM first — see `outsystems-picasso.instructions.md`.

### 8. Guessing Locator Text

Always take a DOM snapshot (MCP) before writing locators. Never assume label or button text.

### 9. Not Scoping Grid Locators

Multiple hidden grids live in the DOM when multiple tabs are rendered. Always scope to the active `tabpanel`.

### 10. Normalizing Assertions to Buggy Product Behavior

If the actual product result contradicts the expected result, **do not weaken the assertion**. Mark the test as a likely defect and create a tracking note.

---

## Flaky Test Diagnosis

```bash
# Burn-in: expose timing issues
npx playwright test tests/doc/doc-detail.spec.ts --repeat-each=10

# Isolation: expose state leaks
npx playwright test tests/doc/doc-detail.spec.ts --grep "test name" --workers=1

# Full trace: capture everything
npx playwright test tests/doc/doc-detail.spec.ts --trace=on --retries=0

# Parallel stress: expose race conditions
npx playwright test --fully-parallel --workers=4 --repeat-each=5
```

## Flaky Categories & Fixes

| Category | Symptom | Fix |
|----------|---------|-----|
| **Timing** | Fails intermittently | Replace waits with web-first assertions |
| **Isolation** | Fails in suite, passes alone | Remove shared state, use fixtures |
| **Environment** | Fails in CI only | Match viewport, fonts, timezone |
| **Infrastructure** | Random crashes | Reduce workers, increase memory |

```typescript
// Timing → wait for a specific response before asserting
const response = page.waitForResponse('**/api/data');
await page.getByRole('button', { name: 'Load' }).click();
await response;
await expect(page.getByTestId('results')).toBeVisible();

// Isolation → unique test data
const uniqueRef = `PIC-TEST-${Date.now()}`;

// Infrastructure → CI-safe config
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
});
```
```
