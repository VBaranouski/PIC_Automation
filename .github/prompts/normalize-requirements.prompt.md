# Normalize Requirements

Use this prompt when the user provides a Jira issue key, a Confluence page, or free-text requirements and you need one canonical requirements bundle.

## Read first

- `.github/instructions/repo.instructions.md`
- `.github/instructions/requirements-schema.instructions.md`
- `.github/instructions/naming.instructions.md`
- the relevant source instruction file
- `.github/instructions/validation.instructions.md`

## Task

Normalize the input into the shared requirements JSON schema and write:

- `output/requirements/requirements_<source_ref>_<date>.json`
- `output/requirements/requirements_<source_ref>_<date>.html`

## Rules

- Preserve missing or unclear information in `ambiguities`.
- Use plain text for body content.
- Split acceptance criteria into `AC1`, `AC2`, and so on.
- Keep source-specific details only in metadata. The body of the bundle must be source-neutral.
