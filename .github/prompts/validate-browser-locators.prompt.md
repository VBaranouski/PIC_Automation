# Validate Browser Locators

Use this prompt when you already have draft scenarios or draft Playwright code and need to verify or refine locators with Playwright MCP.

## Read first

- `.github/instructions/browser-mcp.instructions.md`
- `.github/instructions/pw-autotest.instructions.md`
- `.github/instructions/validation.instructions.md`

## Task

Walk the relevant user flow in the browser and produce a concise validation result:

- confirmed semantic locators
- required OutSystems-specific fallbacks
- readiness signals after each major action
- discrepancies between the spec and the actual UI

Write these findings into the automation manifest JSON and HTML summary if script generation is part of the task.
