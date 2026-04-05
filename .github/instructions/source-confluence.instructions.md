# Confluence Intake Instructions

Use this file when the user provides a Confluence page URL or page ID.

## Goal

Fetch Confluence page content and normalize it into the shared requirements schema.

## Retrieval rules

- Use Confluence MCP tools available in the current Copilot environment.
- Retrieve page title, body content, and relevant metadata.
- Prefer markdown or readable plain text for downstream processing.
- Save the normalized result to `output/requirements/requirements_<source_ref>_<date>.json` and generate the HTML companion.

## What to extract

- `source_ref` as `CONF-<page_id>` when page ID is available
- `source_title` from the page title
- structured description from the page body
- acceptance criteria from headings, bullet lists, tables, or highlighted requirement sections
- business rules, workflow notes, validations, roles, and dependencies
- linked Jira issues, Figma URLs, and attachment references when present

## Rich content handling

- Flatten tables into readable text if no structured parser is available.
- Preserve section headings that imply test scope, such as Preconditions, Business Rules, Error Handling, Permissions, or Acceptance Criteria.
- If the page mixes requirement text with meeting notes or outdated content, record the uncertainty under `ambiguities`.

## Figma links

If a Figma URL is found and Figma tools are configured in the environment:

- retrieve design context before generating test cases
- add the link to `figma_links`
- summarize only the testing-relevant parts into the normalized bundle

## Do not

- Do not treat the page body as a final test-case document.
- Do not skip normalization because the page already looks structured.
- Do not assume every bullet is an acceptance criterion; preserve uncertainty in `ambiguities`.
