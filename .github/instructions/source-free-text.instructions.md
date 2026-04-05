# Free-Text Story Intake Instructions

Use this file when the user provides requirements directly in chat, markdown, or an attached note instead of Jira or Confluence.

## Goal

Transform unstructured or semi-structured story text into the shared requirements schema.

## Intake rules

- Treat the user message or attached text as the primary source.
- Create a stable slugged `source_ref` from the title or the first clear requirement statement.
- Preserve the user wording where possible.
- Save the normalized result to `output/requirements/requirements_<source_ref>_<date>.json` and generate the HTML companion.

## What to extract

- feature summary and business goal
- actors or roles
- preconditions and required test data
- explicit rules, validations, and permissions
- acceptance criteria as discrete `AC1`, `AC2`, and so on
- unresolved questions or missing details under `ambiguities`

## Clarification behavior

- If the story is too vague to produce reliable automation test cases, list the gaps in `ambiguities`.
- Only ask the user follow-up questions when the missing information blocks meaningful automation design.
- If the user asked to proceed anyway, continue with clearly labeled `assumptions`.

## Do not

- Do not invent backend behavior, error text, or permissions.
- Do not silently convert assumptions into facts.
- Do not jump straight to Playwright code from raw free-text.
