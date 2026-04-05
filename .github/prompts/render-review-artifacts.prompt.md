# Render Review Artifacts

Use this prompt when JSON artifacts already exist and you need the HTML review pages.

## Read first

- `.github/instructions/artifacts.instructions.md`
- `.github/instructions/naming.instructions.md`
- `.github/instructions/validation.instructions.md`

## Task

Render HTML companions for one of these stages:

- normalized requirements
- automation test cases
- automation manifest

## Rules

- Do not introduce new information beyond what exists in JSON.
- Make missing fields visible instead of hiding them.
- Include counts, headings, and traceability links where possible.
