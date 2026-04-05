# Checklist, File Naming & Common Mistakes

## Allure Metadata (Required)

```typescript
await allure.suite('Feature Area');
await allure.severity('critical' | 'normal' | 'minor');
await allure.tag('smoke' | 'regression');
await allure.description('What this test verifies');
```

## File Naming

| Type | Path | Convention |
|------|------|-----------|
| Test file | `tests/{feature}/{name}.spec.ts` | kebab-case |
| Page Object | `src/pages/{name}.page.ts` | kebab-case |
| Locators | `src/locators/{name}.locators.ts` | kebab-case |
| Barrel export | `src/pages/index.ts` | Always update |

## Test Timeouts

| Test type | `test.setTimeout` | Why |
|-----------|-------------------|-----|
| Standard navigation / form | `90_000` | Sufficient for most OutSystems pages |
| Product creation (no team) | `180_000` | Multiple tabs + AJAX refreshes |
| Product creation with team roles | `360_000` | 4 user lookups × up to 240s each |
| Product creation with Digital Offer | `360_000` | Team roles + DOC search API calls |

---

## Quick Checklist

**Architecture (four-layer rule):**
- [ ] Locators in `src/locators/*.locators.ts` as factory functions
- [ ] Page objects use `private readonly l` — no raw `page.locator()` inside POM
- [ ] Components created for UI patterns used in 2+ pages
- [ ] No `expect()` directly in test files — all via POM assertion methods
- [ ] POMs injected via fixtures — not instantiated in tests
- [ ] Class member order: private fields → constructor → actions → assertions → helpers

**TypeScript:**
- [ ] Imports use path aliases (`@pages/`, `@fixtures/`, `@locators/`, `@helpers/`)
- [ ] No `any` type
- [ ] All public POM methods have explicit return types

**Test quality:**
- [ ] Explored all target pages/tabs via MCP snapshots
- [ ] Used exact locator text from DOM (not guessed)
- [ ] Scoped grid elements to `tabpanel`
- [ ] No `networkidle`, no `waitForTimeout()`, no `selectOption()` on OSUI widgets
- [ ] No hardcoded row counts or dropdown values
- [ ] Correct `test.setTimeout()` for test type (see table above)
- [ ] All Allure metadata present
- [ ] TypeScript compiles clean (`npx tsc --noEmit`)
- [ ] Updated barrel exports
- [ ] Assertions are web-first (no `await value; expect(value)` pattern)
- [ ] No `expect().toBeVisible({ timeout: 60_000 })` — use `waitFor()` then `expect()`
- [ ] Uses `waitForOSScreenLoad()` after navigation / data-triggering actions
- [ ] `{ exact: true }` on any text locator that could partially match other elements
- [ ] `pressSequentially({ delay: 150 })` for any search/autocomplete input
