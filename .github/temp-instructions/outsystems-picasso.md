# PICASso / OutSystems-Specific Patterns

Patterns derived from real PICASso test failures and successes. These override or clarify general Playwright rules wherever they conflict.

---

## Native `<select>` vs OSUI Custom Dropdowns

PICASso uses **both** types. Always inspect the DOM snapshot before deciding how to interact.

### Native `<select>` — use `selectOption()`

Product form dropdowns and org-level cascading dropdowns are native `<select>` elements. Playwright's `selectOption()` works correctly.

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

Product Team roles (Product Owner, Security Manager, SDPA, Process Quality Leader) and DOC fields (IT Owner, Project Manager) use an OutSystems user lookup widget. The two differ slightly.

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

// 3. Click the matching result scoped to roleContainer (avoid matching previously selected)
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

OutSystems partial refreshes (triggered by tab navigation) replace DOM elements, which resets any values the user had filled in. On the New Product form:

- Navigating to the **Product Organization** or **Product Team** tab triggers a partial refresh
- This resets **Product State**, **Product Definition**, and **Product Type** dropdowns back to their default empty values
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

When an OutSystems AJAX call replaces a DOM element, Playwright can't detect it via network events (WebSocket is always open). Use a dataset marker to detect when the DOM has stabilised:

```typescript
async function waitForProductTypeRefresh(page: Page): Promise<void> {
  const input = page.getByRole('textbox', { name: 'Product Name*' });
  await input.waitFor({ state: 'visible', timeout: 30_000 });

  // Mark the element; wait until the mark persists (= DOM wasn't replaced)
  await page.waitForFunction(`
    (() => {
      const el = document.querySelector('input[placeholder="Product Name"]');
      if (!el) return false;
      if (!el.dataset.__pw_stable) { el.dataset.__pw_stable = '1'; return false; }
      return true;
    })()
  `, { timeout: 30_000, polling: 500 });

  // Clean up marker
  await input.evaluate('(el) => delete el.dataset.__pw_stable');
}
```

---

## Cascading Dropdowns (Org Levels)

Org Level 1 → Org Level 2 → Org Level 3 are native cascading `<select>` elements:

- Org Level 2 starts `disabled` until Org Level 1 is selected
- Org Level 3 starts `disabled` until Org Level 2 is selected
- After parent selection OutSystems re-renders child with new options

```typescript
await expect(page.getByRole('combobox', { name: 'Org Level 2*' })).toBeEnabled({ timeout: 30_000 });
await page.getByRole('combobox', { name: 'Org Level 2*' }).selectOption({ label: 'Home & Distribution' });
await expect(page.getByRole('combobox', { name: /Org Level 3/ })).toBeEnabled({ timeout: 30_000 });
```

---

## CSS-Generated Asterisks on Required Labels

OutSystems adds `*` to required field labels via CSS (`.mandatory::after { content: "*" }`). This `*` is NOT in the DOM text content, so `getByText('Product Owner*')` will NEVER match.

```typescript
// WRONG — CSS asterisk not in DOM
page.getByText('Product Owner*')

// RIGHT
page.getByText('Product Owner', { exact: true })
page.getByRole('textbox', { name: 'Product Name*' })  // accessible name includes * in some widgets
```

Always use `{ exact: true }` when the label text might partially match other elements (e.g. "Digital Offer" matches "Digital Offer is a commercial offering solution...").

---

## Test Timeouts

| Test type | `test.setTimeout` | Why |
|-----------|-------------------|-----|
| Standard OutSystems page | `90_000` | Default — sufficient for most operations |
| Product creation with team roles | `360_000` | 4 user lookup widgets × up to 240s each for edit-link to appear |
| Product creation with Digital Offer | `360_000` | Same — DOC section adds search API calls |

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

## TypeScript Config Note

The `pw-autotest` project has **no `dom` lib** in `tsconfig.json`. Do not use `document`, `HTMLElement`, or `HTMLSelectElement` in page/test code — these types are not available. Use Playwright's `expect` assertions (`toBeEnabled`, `toBeVisible`) instead of `waitForFunction` with DOM APIs.
