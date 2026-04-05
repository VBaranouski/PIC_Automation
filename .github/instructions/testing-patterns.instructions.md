```instructions
# Testing Patterns, Assertions & Wait Strategies

> Consolidated from `temp-instructions/testing-patterns.md`, `temp-instructions/assertions.md`,
> `temp-instructions/verification.md`, `temp-instructions/locators.md`, and `temp-instructions/fixtures.md`.

---

## Architecture — Four-Layer Rule

```
src/locators/     → element selectors ONLY, zero logic
src/pages/        → actions and assertions, NO inline locators
src/components/   → reusable UI components (dropdowns, modals, tables)
src/fixtures/     → page object initialization and shared auth state
tests/            → describe blocks and test cases ONLY
```

**Never mix responsibilities across layers.**
- A test file must never contain a locator.
- A page object file must never contain a raw `page.locator()` call.
- No `expect()` directly in test files — all via POM assertion methods.
- POMs injected via fixtures — not instantiated in tests.

---

## Locator Priority

Use the first option that works:

| Priority | Locator | Use for |
|----------|---------|---------|
| 1 | `getByRole('button', { name: 'Submit' })` | Buttons, links, headings, form elements |
| 2 | `getByLabel('Email address')` | Form fields with associated labels |
| 3 | `getByText('Welcome back')` | Non-interactive text content |
| 4 | `getByPlaceholder('Search...')` | Inputs with placeholder text |
| 5 | `getByAltText('Company logo')` | Images with alt text |
| 6 | `getByTitle('Close dialog')` | Elements with title attribute |
| 7 | `getByTestId('checkout-summary')` | When no semantic option exists |
| 8 | `page.locator('.osui-widget')` | OutSystems-specific widgets ONLY, last resort |

**NEVER use**: XPath, `:nth-child()`, index-based CSS selectors outside of `.first()`.

### Locator Factory Pattern

All locators live in `src/locators/`. One file per page or feature area. Locators are **factory functions**:

```typescript
// src/locators/auth.locators.ts
import { Page } from '@playwright/test';

export const authLocators = (page: Page) => ({
  emailInput:    page.getByLabel('Email'),
  passwordInput: page.getByLabel('Password'),
  submitButton:  page.getByRole('button', { name: 'Sign In' }),
  errorAlert:    page.getByRole('alert'),
});

export type AuthLocators = ReturnType<typeof authLocators>;
```

Page objects store the locator bag as `private readonly l`:

```typescript
export class LoginPage extends BasePage {
  private readonly l;
  constructor(page: Page) {
    super(page);
    this.l = authLocators(page);
  }
}
```

---

## Web-First Assertions (Always Use These)

Auto-retry until timeout. Safe for dynamic content.

```typescript
// Visibility
await expect(locator).toBeVisible();
await expect(locator).not.toBeVisible();

// Text
await expect(locator).toHaveText('exact text');
await expect(locator).toContainText('partial');

// Value (inputs)
await expect(locator).toHaveValue('entered text');

// Attributes & State
await expect(locator).toHaveAttribute('href', '/dashboard');
await expect(locator).toBeEnabled();
await expect(locator).toBeDisabled();
await expect(locator).toBeChecked();

// Count
await expect(locator).toHaveCount(5);

// Page
await expect(page).toHaveURL('/dashboard');
await expect(page).toHaveTitle(/Dashboard/);
```

### Anti-Patterns (Never Do This)

```typescript
// BAD — no auto-retry, snapshot in time
const text = await locator.textContent();
expect(text).toBe('Hello');

// BAD — evaluating in page context
const isVisible = await locator.isVisible();
expect(isVisible).toBe(true);
```

---

## Readiness Signals — What To Wait For

| Signal | When to Use |
|--------|-------------|
| Page heading appears | After navigation |
| OutSystems loading overlay disappears | After screen navigation / data fetch |
| Table column headers visible | Pages that load data asynchronously |
| Element becomes enabled | Forms that disable inputs until data loads |
| Edit Product button appears | After saving a product (not URL change) |
| `networkidle` | **BANNED** — OutSystems WebSocket keeps it alive forever |
| `waitForTimeout()` | **BANNED** — use explicit element assertions instead |

---

## What TO Verify

| User Action | Verification | Example |
|-------------|-------------|---------|
| Submit a form | Success message appears | `await expect(banner).toBeVisible()` |
| Delete an item | Item disappears from list | `await expect(row).not.toBeVisible()` |
| Navigate to page | Key heading/content visible | `await expect(heading).toBeVisible()` |
| Select a dropdown | Dependent section updates | `await expect(orgLevel2Select).toBeEnabled()` |
| Open a dialog | Dialog heading visible | `await expect(page.getByRole('dialog')).toBeVisible()` |
| Save product | Edit Product button appears | `await expect(editButton).toBeVisible({ timeout: 60_000 })` |

## What NOT to Verify

| Anti-Pattern | Why It Fails | Do Instead |
|--------------|-------------|-----------|
| `toHaveURL(/.*ProductId=(?!0)\d+/)` | Tests routing internals | Verify key element visible on target page |
| `toHaveAttribute('data-status', 'confirmed')` | Internal attribute user never sees | Verify visible status text |
| `expect(rowCount).toBe(42)` | Data changes between environments | `expect(firstRow).toBeVisible()` |

---

## Fixtures Pattern

Use fixtures for setup/teardown — they are composable, type-safe, and lazy:

```typescript
// src/fixtures/index.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/login.page';
import { LandingPage } from '@pages/landing.page';

type Fixtures = {
  loginPage: LoginPage;
  landingPage: LandingPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  landingPage: async ({ page }, use) => {
    await use(new LandingPage(page));
  },
});

export { expect } from '@playwright/test';
```

Use persisted storage state for authentication:

```typescript
// auth/auth.setup.ts
import { test as setup } from '@playwright/test';
setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  // … fill credentials …
  await page.context().storageState({ path: '.auth/user.json' });
});
```

---

## Allure Metadata (Required in Every Test)

```typescript
import * as allure from 'allure-js-commons';

test('test name', async ({ ... }) => {
  await allure.suite('Feature Area');
  await allure.severity('critical' | 'normal' | 'minor');
  await allure.tag('smoke' | 'regression');
  await allure.description('What this test verifies');
  // ...
});
```

---

## Filtering & Scoping

```typescript
// Filter by text
page.getByRole('listitem').filter({ hasText: 'Product A' })

// Filter by child locator
page.getByRole('listitem').filter({
  has: page.getByRole('button', { name: 'Buy' })
})

// Chain locators — scope to container
page.getByRole('navigation').getByRole('link', { name: 'Settings' })

// Nth match
page.getByRole('listitem').nth(0)
page.getByRole('listitem').first()
```
```
