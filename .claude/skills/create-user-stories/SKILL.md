---
name: create-user-stories
description: Use when creating User Stories from a Confluence specification page and Figma mockups. Generates a complete HTML backlog document covering all functional requirements.
---

# Create User Stories from Confluence + Figma

Generate JIRA-ready User Stories and Tasks from a functional specification (Confluence page) and optional Figma mockups using the SE-DevTools CLI and Claude AI.

## Identify inputs

Collect from the user before running:

| Input | Flag | Required? |
|-------|------|-----------|
| Confluence page URL | `--confluence-url` | **Yes** |
| Figma design URL (with node-id) | `--figma-url` | Optional |
| Example JIRA story IDs (format reference) | `--example-story` (repeatable) | Optional |
| Parent Epic/Feature key | `--epic` | Optional |
| JIRA project key | `--project` | Optional (default: PIC) |

If optional inputs aren't provided, ask before running — they significantly improve output quality.

## Report

After generating:

- Confirm the output file path
- State: N stories + M tasks generated
- List titles for quick review, flagging any `[In Question]` items
- Flag spec sections that were ambiguous or lacked sufficient detail for complete AC

## Future: Create in JIRA

When `--create-jira` support is added, this skill will POST directly to JIRA under the specified Epic. Until then, output is HTML-only for review and manual JIRA creation.
