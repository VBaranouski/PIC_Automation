# Browser MCP Instructions

Use this file whenever automation test cases must be validated against the real application.

## Core rule

Never finalize locators by guesswork when browser MCP is available.

## Workflow

1. Open the target environment.
2. Log in using the configured test user or the credentials/fixture strategy already used by the repo.
3. Navigate to the target page.
4. Inspect the DOM or accessibility tree before selecting locators.
5. Execute each major scenario step in the browser.
6. After each important transition, inspect the updated page state.
7. Record validated locators and discrepancies in the automation manifest.

## What to verify in-browser

- accessible names and roles of interactive elements
- whether a dropdown is native or custom OutSystems widget
- whether a field requires `pressSequentially()` instead of `fill()`
- whether duplicate hidden elements require scoping or `.first()`
- readiness signals after save, navigation, modal open/close, and tab changes

## OutSystems-specific browser rules

- never use `networkidle`
- prefer visible readiness signals
- do not trust CSS-generated asterisks in text locators without checking the DOM
- scope repeated grids to the active tabpanel
- expect partial refreshes to replace DOM nodes after some actions

## If blocked

If browser access, data, or credentials prevent full validation:

- still generate draft code only if the user wants a draft
- mark every unverified locator in the automation manifest
- clearly separate validated locators from inferred locators
