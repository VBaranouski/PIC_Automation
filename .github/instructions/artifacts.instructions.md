# Artifact Rules

The automation pipeline produces reviewable artifacts and executable code.

## Canonical rule

- JSON is canonical.
- HTML is a rendered review view of the same JSON.
- Never edit HTML first and then try to sync JSON manually.

## Artifact folders

- `output/requirements/` stores normalized requirements bundles.
- `output/test_cases/` stores automation-ready test cases.
- `output/automation_scripts/` stores script generation metadata, browser findings, discrepancies, and generated file manifests.

## Required JSON contents by stage

### Requirements JSON
Must contain the normalized cross-source schema defined in `.github/instructions/requirements-schema.instructions.md`.

### Test cases JSON
Must contain an array of automation-ready test cases plus enough metadata to trace every case back to acceptance criteria and source input.

### Automation manifest JSON
Must contain:

- `source_ref`
- `generated_on`
- `input_artifacts`
- `generated_files`
- `updated_files`
- `browser_validated_locators`
- `assumptions`
- `discrepancies`
- `execution_notes`

## Required HTML outputs

Generate an HTML companion for each JSON artifact:

- Requirements HTML: readable story/spec summary, acceptance criteria, assumptions, linked references.
- Test cases HTML: tabular review page with IDs, priorities, tags, steps, assertions, and automation notes.
- Automation summary HTML: generated files, verified locators, discrepancies from real browser behavior, and manual run commands.

## HTML rules

- Keep HTML self-contained and easy to open locally.
- Render only data already present in JSON plus derived counts and headings.
- Do not hide missing information. Show unresolved fields explicitly.

## Traceability

Every test case and every generated script must remain traceable back to:

- source input
- acceptance criteria or explicit story statement
- generated POM/test files
- browser verification notes
