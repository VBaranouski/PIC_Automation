# Repository Copilot Instructions

PICASso is a monorepo with two AI-assisted tracks:

- `projects/docs-generator` renders documentation artifacts.
- `projects/pw-autotest` contains Playwright + TypeScript automation tests for the PICASso OutSystems application.

When the user asks for QA automation work, follow this pipeline:

1. Identify the source: Jira issue, Confluence page, or free-text user story.
2. Normalize that input into a shared requirements bundle.
3. Generate automation-ready test cases from the normalized bundle.
4. Walk the scenarios in the browser with Playwright MCP before finalizing locators.
5. Generate or update Playwright TypeScript code in `projects/pw-autotest`.
6. Save review artifacts as JSON and HTML in the appropriate `output/` folders.

Default source-neutral workflow:

- Intake artifacts go to `output/requirements/`.
- Automation-ready test cases go to `output/test_cases/`.
- Script generation metadata and browser validation notes go to `output/automation_scripts/`.
- Executable test code goes to `projects/pw-autotest/src/` and `projects/pw-autotest/tests/`.

Use JSON as the canonical source of truth. Generate HTML from JSON so reviewers can inspect the same data without changing it.

Always read and follow these instruction files before generating automation assets:

- `.github/instructions/requirements-schema.instructions.md`
- `.github/instructions/naming.instructions.md`
- `.github/instructions/artifacts.instructions.md`
- `.github/instructions/pw-autotest.instructions.md`
- `.github/instructions/browser-mcp.instructions.md`
- One source-specific file: Jira, Confluence, or free-text
- One task-specific file: test cases, automation scripts, or validation

Do not treat Jira, Confluence, and free-text as separate downstream workflows. They only differ at intake time. After normalization, use one shared pipeline.
