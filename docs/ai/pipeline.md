# GitHub Copilot QA Pipeline

This repository now supports a split GitHub Copilot workflow for QA automation in addition to the older Claude-oriented assets.

## End-to-end flow

1. Intake one source:
   - Jira story
   - Confluence page
   - free-text user story
2. Normalize it into one canonical requirements bundle.
3. Generate automation-ready test cases.
4. Validate the target flow in the browser with Playwright MCP.
5. Generate or update Playwright TypeScript code in `projects/pw-autotest`.
6. Save JSON + HTML review artifacts for each stage.

## Where files go

### Intake artifacts

- `output/requirements/requirements_<source_ref>_<date>.json`
- `output/requirements/requirements_<source_ref>_<date>.html`

### Test case artifacts

- `output/test_cases/test_cases_auto_<source_ref>_<date>.json`
- `output/test_cases/test_cases_auto_<source_ref>_<date>.html`

### Script generation artifacts

- `output/automation_scripts/automation_manifest_<source_ref>_<date>.json`
- `output/automation_scripts/automation_summary_<source_ref>_<date>.html`

### Executable code

- `projects/pw-autotest/src/locators/`
- `projects/pw-autotest/src/pages/`
- `projects/pw-autotest/tests/`

## Instruction files

Shared instructions live in `.github/instructions/`.

Recommended reading order for end-to-end generation:

1. `repo.instructions.md`
2. `requirements-schema.instructions.md`
3. `naming.instructions.md`
4. `artifacts.instructions.md`
5. relevant source intake instruction
6. `test-cases.instructions.md`
7. `pw-autotest.instructions.md`
8. `browser-mcp.instructions.md`
9. `automation-scripts.instructions.md`
10. `validation.instructions.md`

## Prompt files

Use the split prompts in `.github/prompts/`:

- `run-automation-pipeline.prompt.md` for the full workflow
- `normalize-requirements.prompt.md` for intake only
- `generate-automation-test-cases.prompt.md` for case generation only
- `generate-playwright-tests.prompt.md` for code generation only
- `validate-browser-locators.prompt.md` for locator refinement only
- `render-review-artifacts.prompt.md` for HTML output only
- `validate-output-artifacts.prompt.md` for final consistency checks

## Manual execution

Generated tests are intended to be runnable from `projects/pw-autotest` with:

- `npm run typecheck`
- `npm test`
- `npm run test:smoke`

## Note on tool differences

Claude assets in `.claude/` assume subagents such as `atlas`. GitHub Copilot instructions in `.github/` replace that with a prompt-driven pipeline and direct MCP usage where the environment supports it.
