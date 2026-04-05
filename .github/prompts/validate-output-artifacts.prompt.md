# Validate Output Artifacts

Use this prompt after generating any JSON, HTML, or Playwright code.

## Read first

- `.github/instructions/validation.instructions.md`
- `.github/instructions/naming.instructions.md`
- `.github/instructions/artifacts.instructions.md`

## Task

Validate that:

- artifact names follow the conventions
- JSON and HTML stay in sync
- traceability is preserved
- Playwright outputs are consistent with `projects/pw-autotest`
- manual terminal run commands are available when code was generated

Report any gaps before marking the workflow complete.
