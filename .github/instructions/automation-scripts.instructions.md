# Playwright Automation Script Instructions

Use this file when converting automation-ready test cases into runnable Playwright TypeScript code.

## Input order

Before generating code, read in this order:

1. normalized requirements JSON
2. automation test cases JSON
3. `projects/pw-autotest` architecture instructions
4. browser MCP instructions

## Output goal

Produce or update:

- locator factory files in `projects/pw-autotest/src/locators/`
- page object files in `projects/pw-autotest/src/pages/`
- tests in `projects/pw-autotest/tests/`
- page barrel exports in `projects/pw-autotest/src/pages/index.ts` when needed
- metadata manifest in `output/automation_scripts/automation_manifest_<source_ref>_<date>.json`
- HTML summary in `output/automation_scripts/automation_summary_<source_ref>_<date>.html`

## Generation rules

- Do not create Playwright code before checking the live UI with browser MCP unless the user explicitly asks for a draft.
- Prefer one page object per real page or major flow.
- Prefer one locator factory per page or feature area.
- Keep tests concise and behavior-focused.
- Use Allure metadata in every generated test.
- Use `test.step()` for meaningful steps, not every single click.

## Real-browser refinement

For each automatable scenario:

- walk the scenario in the browser
- capture stable semantic locators
- record any discrepancies between the spec and the actual UI
- update the generated code to match the validated UI

## Allowed fallback behavior

If a stable semantic locator is unavailable:

- use a scoped OutSystems-specific fallback locator
- explain why it was needed in the automation manifest
- prefer container scoping and exact text over brittle positional selectors

## Manifest requirements

The automation manifest must record:

- which files were created or updated
- which locators were verified in-browser
- which scenarios were fully automated
- which scenarios remain blocked and why
- what data or credentials are required for manual execution
