```instructions
# PICASso / OutSystems-Specific Patterns

> Consolidated from `temp-instructions/outsystems-picasso.md` and `temp-instructions/outsystems-patterns.md`.
> These rules override general Playwright rules wherever they conflict.

---

## Native `<select>` vs OSUI Custom Dropdowns

PICASso uses **both** types. Always inspect the DOM snapshot before deciding how to interact.

### Native `<select>` — use `selectOption()`

Product form dropdowns and org-level cascading dropdowns are native `<select>` elements.

```typescript
// Product State / Definition / Type
await page.getByRole('combobox', { name: 'Product State*' }).selectOption({ label: 'Under development' });

// Org Level 1 / 2 / 3
await page.getByRole('combobox', { name: 'Org Level 1*' }).selectOption({ label: 'Energy Management' });

// Pagination per-page combobox
await page.getByRole('combobox').selectOption('20');
```

**How to identify:** `getByRole('combobox')` on a native `<select>` → `selectOption()` works. If `selectOption()` throws, it's a custom widget.

### OSUI Custom Dropdowns — NEVER `selectOption()`

Filter dropdowns (vscomp, osui-dropdown) are custom widgets that ignore `selectOption()`.

```typescript
// WRONG — does nothing on custom OSUI widgets
await combobox.selectOption({ label: 'Germany' });

// RIGHT — click to open, pressSequentially to search, click result
await page.locator('.osui-dropdown').filter({ hasText: 'Select Product' }).click();
await page.locator('.vscomp-search-input:focus').pressSequentially('Power Switch', { delay: 150 });
await page.getByRole('option', { name: /Power Switch/ }).first().click();
```

---

## User Lookup Widget (3-Step Pattern)

Product Team roles and DOC fields use an OutSystems user lookup widget. Two variants exist.

### Team Roles — edit-link required

```typescript
// 1. Click the edit link (pencil icon) next to the role label
const roleContainer = page.getByText('Product Owner', { exact: true }).locator('..');
const editLink = roleContainer.getByRole('link').first();
await editLink.waitFor({ state: 'visible', timeout: 240_000 }); // OutSystems search API is slow
await editLink.click();

// 2. Searchbox appears — type slowly to trigger search API
const searchBox = roleContainer.getByRole('searchbox', { name: 'Type 4 letters' });
await searchBox.waitFor({ state: 'visible', timeout: 30_000 });
await searchBox.pressSequentially('Ulad', { delay: 150 });

// 3. Click the matching result scoped to roleContainer
const result = roleContainer.getByText('Uladzislau Baranouski', { exact: true }).first();
await result.waitFor({ state: 'visible', timeout: 30_000 });
await result.click();
```

**Why `pressSequentially()`:** `fill()` sets the value synchronously — the OutSystems search API listens to keydown events only. `fill()` will silently succeed but no results appear.

**Why 240s timeout on editLink:** After OutSystems server-side rendering refreshes the form, the edit link can take up to 240 seconds to re-appear.

### DOC Section — searchbox directly visible

The DIGITAL OFFER DETAILS section exposes IT Owner and Project Manager searchboxes without an edit-link click:

```typescript
await page.getByRole('gridcell', { name: /IT Owner/ }).getByRole('searchbox')
  .pressSequentially('Ulad', { delay: 150 });
const result = page.getByText('Uladzislau Baranouski', { exact: true }).first();
await result.waitFor({ state: 'visible', timeout: 30_000 });
await result.click();
```

---

## Partial-Refresh Handling (Form Field Reset)

OutSystems partial refreshes (triggered by tab navigation) replace DOM elements, resetting filled values. On the New Product form:

- Navigating to the **Product Organization** or **Product Team** tab triggers a partial refresh
- This resets **Product State**, **Product Definition**, and **Product Type** dropdowns
- Re-apply these dropdowns after returning from tab operations, before calling Save

```typescript
// After fillProductOrganization() and fillProductTeam():
await newProductPage.selectProductDropdowns({
  state: 'Under development (not yet released)',
  definition: 'System',
  type: 'Embedded Device',
});
```

---

## DOM Stability Marker (AJAX Completion Detection)

When OutSystems AJAX replaces a DOM element, Playwright cannot detect it via network events (WebSocket is always open). Use a dataset marker to detect when the DOM has stabilised:

```typescript
async function waitForProductTypeRefresh(page: Page): Promise<void> {
  const input = page.getByRole('textbox', { name: 'Product Name*' });
  await input.waitFor({ state: 'visible', timeout: 30_000 });

  await page.waitForFunction(`
    (() => {
      const el = document.querySelector('input[placeholder="Product Name"]');
      if (!el) return false;
      if (!el.dataset.__pw_stable) { el.dataset.__pw_stable = '1'; return false; }
      return true;
    })()
  `, { timeout: 30_000, polling: 500 });

  await input.evaluate('(el) => delete el.dataset.__pw_stable');
}
```

---

## Cascading Dropdowns (Org Levels)

Org Level 1 → Org Level 2 → Org Level 3 are native cascading `<select>` elements:

- Org Level 2 starts `disabled` until Org Level 1 is selected
- Org Level 3 starts `disabled` until Org Level 2 is selected

```typescript
await expect(page.getByRole('combobox', { name: 'Org Level 2*' })).toBeEnabled({ timeout: 30_000 });
await page.getByRole('combobox', { name: 'Org Level 2*' }).selectOption({ label: 'Home & Distribution' });
await expect(page.getByRole('combobox', { name: /Org Level 3/ })).toBeEnabled({ timeout: 30_000 });
```

---

## CSS-Generated Asterisks on Required Labels

OutSystems adds `*` to required field labels via CSS (`.mandatory::after { content: "*" }`). This `*` is NOT in the DOM text content.

```typescript
// WRONG — CSS asterisk not in DOM
page.getByText('Product Owner*')

// RIGHT
page.getByText('Product Owner', { exact: true })
page.getByRole('textbox', { name: 'Product Name*' })  // accessible name includes * in some widgets
```

Always use `{ exact: true }` when label text might partially match other elements.

---

## Always Scope Grid Elements to Active Tab Panel

Multiple tabs = multiple hidden grids in the DOM simultaneously.

```typescript
// WRONG — unscoped, matches hidden grids from inactive tabs
this.grid = page.getByRole('grid');

// RIGHT — scoped to active tab content
this.grid = page.getByRole('tabpanel').getByRole('grid');
```

Always wait for grid column headers to appear after a tab switch:

```typescript
async clickTab(tabName: TabType): Promise<void> {
  await tab.click();
  await this.grid.getByRole('columnheader').first().waitFor({ timeout: 15_000 });
}
```

---

## OutSystems Loading Indicators

| Indicator | CSS Selector | Meaning |
|-----------|-------------|---------|
| Screen loading overlay | `.feedback-message-loading` | Screen Aggregate running |
| Content placeholder | `.content-placeholder.loading` | Section still loading |
| Skeleton / shimmer | `.osui-skeleton` | Placeholder for pending data |
| Disabled buttons | `button[disabled]` | Server action processing |
| Feedback message | `.feedback-message-success`, `.feedback-message-error` | Server action completed |

Standard wait sequence after navigation:

```typescript
await page.getByRole('link', { name: 'Products' }).click();
await waitForOSScreenLoad(page);
await page.getByRole('heading', { name: 'Product Catalog' }).waitFor();
```

---

## Product Detail Page States

| State | URL | Status shown | Form state |
|-------|-----|-------------|-----------|
| Create | `ProductDetail?ProductId=0` | Draft | Editable |
| View (after save) | `ProductDetail?ProductId={id}` | Active | Read-only |

After save, the readiness signal is the **Edit Product** button appearing, NOT a URL change:

```typescript
await expect(page.getByRole('button', { name: 'Edit Product' })).toBeVisible({ timeout: 60_000 });
```

---

## Test Timeouts

| Test type | `test.setTimeout` | Why |
|-----------|-------------------|-----|
| Standard OutSystems page | `90_000` | Default — sufficient for most operations |
| Product creation (no team) | `180_000` | Multiple tabs + AJAX refreshes |
| Product creation with team roles | `360_000` | 4 user lookup widgets × up to 240s each |
| Product creation with Digital Offer | `360_000` | Team roles + DOC search API calls |

---

## TypeScript Config Note

The `pw-autotest` project has **no `dom` lib** in `tsconfig.json`. Do not use `document`, `HTMLElement`, or `HTMLSelectElement` in page/test code. Use Playwright's `expect` assertions (`toBeEnabled`, `toBeVisible`) instead.

---

## Handle Strict Mode Violations

OutSystems often renders duplicate elements (hidden + visible). Use `.first()` or scoped locators.

## Never Hardcode Row Counts

Test data varies between environments:

```typescript
// WRONG
await expect(rows).toHaveCount(42);
// RIGHT
await expect(rows.nth(1)).toBeVisible();
```

## Use Column Headers from Real DOM

Always snapshot the page first, then use exact header text including casing. Never guess header names.
```
