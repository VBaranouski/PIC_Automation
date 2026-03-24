---
name: create-release-notes-short
description: Use when creating Yammer-format release notes from a JIRA version. Fetches fixed issues from Jira, generates a clean HTML summary, and optionally publishes to Confluence for Yammer distribution.
---

# Create Release Notes for Yammer

Generate release notes from a Jira version and optionally publish to Confluence.
MCP fetches Jira data. Python renders HTML. No AI generation step.

## Step 1 — Gather inputs

Ask the user for:

- **Version name or ID** (e.g., `2.4.1` or `173186`) — required
- **Project key** (e.g., `PIC`) — optional, uses config default if omitted
- **Release date override** — optional (e.g., `28 March 2026`)
- **Style** — optional (`default` or `hacker`)
- **Publish to Confluence?** — optional flag

---

## Step 2 — Fetch issues via Atlas agent (Haiku)

Spawn the `atlas` subagent with this prompt template:

```text
RELEASE_DATA_FETCH_MODE

version: <version name or ID>
project_key: <project key, default PIC>
release_date_override: <user-provided date or omit>

1. Call jira_get_project_versions(project_key="<project_key>") and find the entry matching the version name or ID. Extract: id, name, releaseDate, released, description.
2. Call jira_search(jql="project = <project_key> AND fixVersion = '<version>' ORDER BY issuetype ASC, key ASC", fields=["key","summary","status","priority","issuetype","assignee"], max_results=200).
   If total > 200, paginate with start_at until all issues are fetched.
3. Group issues by fields.issuetype.name. Each entry: {key, summary, status, priority, issue_type, assignee}.

Return ONLY this JSON object:
{
  "version_name": "<name>",
  "version_description": "<description or empty string>",
  "release_date": "<release_date_override if provided, else releaseDate from Jira, formatted as 'DD Month YYYY'>",
  "released": <true|false>,
  "project_key": "<key>",
  "total_issues": <number>,
  "generated_date": "<today YYYY-MM-DD>",
  "issues_by_type": {
    "Story": [{"key": "PIC-1", "summary": "...", "status": "Done", "priority": "High", "issue_type": "Story", "assignee": "Name"}],
    "Bug": []
  }
}
```

Write the returned JSON as-is to `output/release_notes_short/release_data_short_<version>_<date>.json`.

---

## Step 3 — Render HTML

```bash
cd projects/docs-generator
python3 main.py release-notes-short \
  --release-data output/release_notes_short/release_data_short_<version>_<date>.json \
  [--style hacker] \
  [--publish]
```

Output: `output/release_notes_short/release_notes_short_<version>.html`

---

## Step 4 — Report

- Confirm the output HTML file path
- If `--publish` was used: confirm the Confluence page URL
- Summarize: number of issues included, categories covered
