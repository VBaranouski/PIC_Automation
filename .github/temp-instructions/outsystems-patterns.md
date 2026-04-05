# OutSystems Patterns — PICASso Playwright (Addenda)

General OutSystems patterns (native `<select>` vs OSUI dropdowns, user lookup widget, cascading dropdowns, CSS asterisks, `pressSequentially`, partial refresh, page states, networkidle ban) are in `context/outsystems-picasso.md` (loaded as prerequisite). This file covers only automation-framework-specific rules NOT in that reference.

---

## ALWAYS scope grid elements to active tabpanel

Multiple tabs = multiple hidden grids in the DOM simultaneously.

```typescript
// WRONG — unscoped, matches hidden grids from inactive tabs
this.grid = page.getByRole('grid');

// RIGHT — scoped to active tab content
this.grid = page.getByRole('tabpanel').getByRole('grid');
```

## ALWAYS wait for grid data after tab switch

```typescript
async clickTab(tabName: TabType): Promise<void> {
  await tab.click();
  // Wait for column headers to appear before interacting with rows
  await this.grid.getByRole('columnheader').first().waitFor({ timeout: 15_000 });
}
```

## Handle strict mode violations

OutSystems often renders duplicate elements (hidden + visible). Use `.first()` or more specific scoped locators.

## NEVER hardcode row counts

Test data varies between environments. Assert data exists, not exact counts:
```typescript
// WRONG
await expect(rows).toHaveCount(42);
// RIGHT
await expect(rows.nth(1)).toBeVisible();
```

## Use column headers from real DOM

Always snapshot the page first, then use exact header text including casing. Never guess.

---

## Loading Indicators

| Indicator | CSS Selector | Meaning |
|---|---|---|
| Screen loading overlay | `.feedback-message-loading` | Screen Aggregate running |
| Content placeholder | `.content-placeholder.loading` | Section still loading |
| Skeleton / shimmer | `.osui-skeleton` | Placeholder for pending data |
| Disabled buttons | `button[disabled]` | Server action processing |
| Feedback message | `.feedback-message-success`, `.feedback-message-error` | Server action completed |

**Standard wait sequence:**
```typescript
await page.getByRole('link', { name: 'Products' }).click();
await waitForOSScreenLoad(page);
await page.getByRole('heading', { name: 'Product Catalog' }).waitFor();
```

---

## Requesting Testability Improvements

| Problem | Request from dev team |
|---|---|
| Icon-only button with no text | Add `aria-label` via Extended Properties |
| Multiple identical links in a list | Add `data-testid` with dynamic value |
| Label not associated with input | Use OutSystems Label widget `InputWidget` parameter |
| No stable parent container | Wrap in named Block or Container with `data-testid` |
