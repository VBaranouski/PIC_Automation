# Generate Automation Test Cases

Use this prompt after a normalized requirements bundle already exists.

## Read first

- `.github/instructions/repo.instructions.md`
- `.github/instructions/test-cases.instructions.md`
- `.github/instructions/artifacts.instructions.md`
- `.github/instructions/naming.instructions.md`
- `.github/instructions/validation.instructions.md`

## Input

- normalized requirements JSON from `output/requirements/`

## Output

Generate:

- `output/test_cases/test_cases_auto_<source_ref>_<date>.json`
- `output/test_cases/test_cases_auto_<source_ref>_<date>.html`

## Rules

- Every test case must map back to one or more acceptance criteria.
- Steps must be written in automation-friendly action format.
- Assertions must use Playwright web-first assertion names.
- Include automation notes whenever OutSystems behavior affects implementation.
