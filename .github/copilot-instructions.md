# Copilot Instructions

Use this file as the entry router for GitHub Copilot work in this repository.

## Primary workflow

For QA automation tasks, use the split instruction set in `.github/instructions/` and the task prompts in `.github/prompts/`.

Default end-to-end flow:

1. Normalize Jira, Confluence, or free-text input into `output/requirements/`.
2. Generate automation-ready test cases into `output/test_cases/`.
3. Validate the UI flow in-browser with Playwright MCP.
4. Generate or update Playwright TypeScript code in `projects/pw-autotest/`.
5. Re-run the changed scenario in-browser with Playwright MCP and fix locators, controls, and page-object flows until the UI path is stable.
6. Run the targeted Playwright command from `projects/pw-autotest`.
7. If the remaining failure is caused by expected-vs-actual product behavior instead of automation/runtime issues, classify it as a likely defect and call it out explicitly for manual review.
8. Update the DOC/release application test plans and coverage artifacts after each meaningful automation change.
9. Save automation metadata into `output/automation_scripts/`.

## Read before generating automation assets

- `.claude/rules/automation-testing/reference/golden-rules.md`
- `.claude/rules/automation-testing/reference/locators.md`
- `.claude/rules/automation-testing/reference/assertions.md`
- `.claude/rules/automation-testing/reference/flaky-tests.md`
- `.claude/rules/automation-testing/reference/fixtures.md`
- `.claude/rules/automation-testing/reference/outsystems-picasso.md`
- `.claude/rules/automation-testing/reference/common-pitfalls.md`
- `.github/instructions/repo.instructions.md`
- `.github/instructions/requirements-schema.instructions.md`
- `.github/instructions/naming.instructions.md`
- `.github/instructions/artifacts.instructions.md`
- `.github/instructions/pw-autotest.instructions.md`
- `.github/instructions/browser-mcp.instructions.md`
- the relevant source intake instruction file
- the relevant task instruction file

## Prompt entry points

- `.github/prompts/run-automation-pipeline.prompt.md`
- `.github/prompts/normalize-requirements.prompt.md`
- `.github/prompts/generate-automation-test-cases.prompt.md`
- `.github/prompts/generate-playwright-tests.prompt.md`
- `.github/prompts/validate-browser-locators.prompt.md`
- `.github/prompts/render-review-artifacts.prompt.md`
- `.github/prompts/validate-output-artifacts.prompt.md`

## Core rules

- Prefer semantic locators and verify them in-browser when MCP is available.
- Never use `waitForTimeout()` or `networkidle` for the OutSystems app.
- Use web-first assertions (`expect(locator)`) instead of snapshot reads where practical.
- For new or changed test scripts, validate the full UI path in Playwright MCP before treating the code as done.
- After MCP validation, run the smallest relevant `npx playwright test ...` command and fix remaining locator/runtime issues there.
- Do not "fix" expectation-vs-actual product mismatches by weakening assertions; classify those as likely defects and surface them to the user.
- Keep Markdown and HTML application plans in sync with the latest validated automation coverage and blockers.
- Keep tests isolated; avoid test-order dependencies and module-level state handoffs unless the work is explicitly implemented as a setup project.
- Do not reach into private page-object internals from tests; expose page methods or public accessors instead.
- For `projects/pw-autotest`, prefer setup projects, fixtures, and persisted state files over serial test suites.
- Keep JSON canonical and HTML review-only.
- Keep tests runnable manually from `projects/pw-autotest`.
- Match the existing style of nearby tests, fixtures, locators, and page objects.
