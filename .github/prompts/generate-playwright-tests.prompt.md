# Generate Playwright Tests

Use this prompt when normalized requirements and automation-ready test cases already exist and you need runnable TypeScript code in `projects/pw-autotest`.

## Read first

- `.github/instructions/pw-autotest.instructions.md`
- `.github/instructions/browser-mcp.instructions.md`
- `.github/instructions/automation-scripts.instructions.md`
- `.github/instructions/validation.instructions.md`

## Inputs

- requirements JSON from `output/requirements/`
- test cases JSON from `output/test_cases/`

## Output

Generate or update:

- locator factories in `projects/pw-autotest/src/locators/`
- page objects in `projects/pw-autotest/src/pages/`
- tests in `projects/pw-autotest/tests/`
- page exports if needed
- automation manifest JSON + HTML in `output/automation_scripts/`

## Rules

- Validate locators in the live browser first when possible.
- Follow nearby code style in the target feature area.
- Use Allure metadata and `test.step()`.
- Keep tests runnable manually from the terminal.
