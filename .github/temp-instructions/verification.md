# Verification & Wait Strategy

## What TO Verify

| User Action | Verification | Example |
|---|---|---|
| Submit a form | Success message appears | `await element.waitFor(); await expect(element).toBeVisible()` |
| Delete an item | Item disappears from list | `await expect(row).not.toBeVisible()` |
| Navigate to page | Key heading/content visible | `await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()` |
| Select a dropdown | Dependent section updates | `await expect(orgLevel2Select).toBeEnabled()` |
| Open a dialog | Dialog heading visible | `await expect(page.getByRole('dialog')).toBeVisible()` |
| Close a dialog | Dialog gone | `await expect(page.getByRole('dialog')).not.toBeVisible()` |
| Fill and save a form | Saved values persist | `await expect(nameInput).toHaveValue('Expected Name')` |
| Toggle a checkbox | State reflected | `await expect(checkbox).toBeChecked()` |
| Save product | Edit Product button appears | `await expect(editProductButton).toBeVisible({ timeout: 60_000 })` |

## What NOT to Verify

| Anti-Pattern | Why It Fails | Do Instead |
|---|---|---|
| `toHaveURL(/.*ProductDetail\?ProductId=(?!0)\d+/)` | Tests routing internals, not UX | Verify key element visible on target page |
| `toHaveURL('https://staging.example.com/orders')` | Env-specific, breaks across environments | Loose check: `toHaveURL(/\/orders/)` |
| `toHaveAttribute('data-status', 'confirmed')` | Internal attribute user never sees | Verify visible status text |
| `toHaveCSS('background-color', 'rgb(0,123,255)')` | Theme-dependent | Verify visible state change |
| `page.waitForResponse('**/api/orders')` | Couples UI test to API contract | Verify the UI result |
| `expect(rowCount).toBe(42)` | Data changes between environments | `expect(firstRow).toBeVisible()` |

## URL Verification Rules

```typescript
// OK — loose section check
await expect(page).toHaveURL(/.*GRC_PICASso/);
await expect(page).not.toHaveURL(/\/login/);

// BAD — complex regex validating query params, IDs, tokens
await expect(page).toHaveURL(/.*ProductDetail\?ProductId=(?!0)\d+/);
```

**Rules:**
1. One primary assertion per action outcome
2. Prefer `toBeVisible()` over `toBeAttached()`
3. Default assertion timeout (10s) is sufficient — only increase for known slow loads
4. Never use `waitForTimeout()` before assertions — assertions auto-retry

---

## Readiness Signals

Identify a UI readiness signal and `waitFor()` on that signal before acting. Wait patterns and helpers are in `context/testing-patterns.md` (Wait Strategies section).

| Signal | When to Use |
|---|---|
| Page heading appears | After navigation |
| OutSystems loading overlay disappears | After screen navigation / data fetch |
| Content placeholder resolves | Sections loading async data |
| Table/list populates | Pages that load data asynchronously |
| Element becomes enabled | Forms that disable inputs until data loads |
| Edit Product button appears | After saving a product (not URL change) |
| ~~`networkidle`~~ | **BANNED** — OutSystems WebSocket keeps it alive forever |
