---
name: create-release-notes-short
description: Use when creating Yammer-format release notes from a JIRA version. Fetches fixed issues from Jira, generates a clean HTML summary, and optionally publishes to Confluence for Yammer distribution.
---

# Create Release Notes for Yammer

Generate release notes from a Jira version and optionally publish to Confluence.

## Gather inputs

Ask the user for:
- **Version string** (e.g., `2.4.1`) — required
- **Project key** (e.g., `PROJ`) — optional, uses config default if omitted
- **Publish to Confluence?** — adds `--publish` flag

## Run CLI

```bash
cd packages/docs-generator

# Generate only:
python main.py release-notes-short --version "2.4.1"

# With project key:
python main.py release-notes-short --version "2.4.1" --project PROJ

# Generate + publish:
python main.py release-notes-short --version "2.4.1" --project PROJ --publish
```

Output: `../../output/release_notes_short/release_notes_short_2.4.1.html`

## Report

- Confirm the output HTML file path
- If `--publish` was used: confirm the Confluence page URL
- Summarize: number of issues included, categories covered

## Notes

- Pulls fixed issues from the Jira version using `JiraClient`
- Issues grouped by type (Bug, Story, Task)
- `--publish` creates or updates a Confluence page — safe to re-run
- Output filename pattern controlled by `config.yaml` under `output.release_notes_short_filename_pattern`
