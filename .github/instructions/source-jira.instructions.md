# Jira Intake Instructions

Use this file when the user provides one or more Jira issue keys.

## Goal

Fetch Jira story data and normalize it into the shared requirements schema.

## Retrieval rules

- Use Jira MCP tools available in the current Copilot environment.
- Fetch only the fields needed for testing: summary, description, acceptance criteria, status, priority, assignee, attachments, and any linked design references found in text.
- Convert rich text content to plain text while preserving list structure.
- Save the normalized result to `output/requirements/requirements_<source_ref>_<date>.json` and generate the HTML companion.

## What to extract

- issue key as `source_ref`
- summary as `source_title`
- plain-text description
- discrete acceptance criteria items
- role/permission hints
- referenced entities, statuses, validation messages, and data prerequisites
- attachment references useful for testing

## Attachments

- If image attachments exist and the environment supports downloading them, list them under `attachments`.
- If attachments cannot be fetched, record the limitation in `ambiguities`.

## Figma links

If the issue text contains a Figma URL and Figma tools are configured in the environment:

- extract the file key and node id
- retrieve design context before generating test cases
- carry the design reference into the normalized bundle

## Do not

- Do not generate test cases directly from raw Jira JSON.
- Do not invent missing acceptance criteria.
- Do not skip normalization because the issue looks simple.
