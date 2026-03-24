---
name: create-release-note-detailed
description: Use when creating comprehensive PICASso-format release notes in both HTML and PPTX formats. Combines Jira data with AI-generated narrative. Runs two CLI commands: release-notes-detailed (HTML) then pptx-release-notes (PowerPoint).
---

# Create Full Release Notes — Technical Writer Agent

You are a **senior Technical Writer for Schneider Electric**.
MCP fetches JIRA data. Python renders the HTML shell. You write the narrative body.

---

## Step 1 — Collect inputs

| Input | Flag | Required? |
| ------- | ------ | ----------- |
| Version name | `--version` | **Yes** |
| JIRA project key | `--project` | Optional (default: PIC) |
| Spec file | `--spec` | Optional (in `input/release_notes_detailed/`) |
| Publish to Confluence | `--publish` | Optional flag |

---

## Step 2 — Fetch release data via Atlas agent (Haiku)

### 2a — Spawn Atlas to fetch Jira version and issues

Use this prompt template:

```text
RELEASE_DATA_FETCH_MODE

version: <version name>
project_key: <project key, default PIC>

1. Call jira_get_project_versions(project_key="<project_key>") and find the entry matching the version name. Extract: id, name, releaseDate, released.
2. Call jira_search(jql="project = <project_key> AND fixVersion = '<version>' ORDER BY issuetype ASC, key ASC", fields=["key","summary","status","priority","issuetype","assignee"], max_results=200).
   If total > 200, paginate with start_at until all issues are fetched.
3. Group issues by fields.issuetype.name.

Return ONLY this JSON object:
{
  "version_name": "<name>",
  "project_key": "<key>",
  "release_date": "<releaseDate or empty string>",
  "released": <true|false>,
  "total_issues": <number>,
  "issues_by_type": {
    "Story": [{"key": "PIC-1", "summary": "...", "status": "Done", "priority": "High", "assignee": "Name"}],
    "Bug": [],
    "Task": []
  }
}
```

### 2b — Read spec file and HTML template (you do this)

- If `--spec` was provided, use the Read tool to load it → `spec_content`.
- Read `projects/docs-generator/src/templates/release_notes_detailed.html.j2` → `template_content`.

### 2c — Write release data JSON

Merge the Atlas result with `spec_content` and `template_content`. Write to `output/release_notes_detailed/release_data_<version>_<date>.json`:

```json
{
  "version_name": "2.4.1",
  "project_key": "PIC",
  "release_date": "2026-03-20",
  "released": true,
  "total_issues": 48,
  "issues_by_type": {
    "Story": [{"key": "PIC-1", "summary": "...", "status": "Done", "priority": "High", "assignee": "Name"}],
    "Bug": [],
    "Task": []
  },
  "spec_content": "optional spec file content or empty string",
  "template_content": "Jinja2 template file content"
}
```

---

## Step 3 — Generate HTML body (YOU do this)

Read the release data JSON. Using `issues_by_type`, `spec_content`, and `template_content` as inputs, write a complete HTML body for the release notes document.

**WRITING RULES:**

- Follow the structure defined in `template_content` exactly. It describes the required sections.
- Use `spec_content` (if present) for feature descriptions and context. Do not contradict the spec.
- Write in professional technical prose — clear, concise, suitable for Schneider Electric stakeholders.
- For each issue type (e.g., Story, Bug, Task): write a narrative paragraph summarising what was delivered, then list the items.
- Format issue lists as `<ul>` / `<li>` HTML. Each item: `<strong>KEY</strong> — summary`.
- Include a high-level "Release Summary" section at the top with 3-5 sentences describing the release scope and key highlights.
- Include a "Known Limitations" or "Notes" section if relevant issues (e.g., Won't Fix) are present.
- Output **only the body content** — no `<html>`, `<head>`, or `<body>` tags. The shell template wraps this.

Write the generated HTML body to `output/release_notes_detailed/html_body_<version>_<date>.html`.

---

## Step 4 — Render full HTML

```bash
cd projects/docs-generator
python3 main.py release-notes-detailed \
  --release-data output/release_notes_detailed/release_data_<version>_<date>.json \
  --html-body output/release_notes_detailed/html_body_<version>_<date>.html \
  [--publish]
```

---

## Step 5 — Generate PPTX (optional)

Use the JSON spec template alongside the HTML output:

```bash
python3 main.py pptx-release-notes \
  --spec "output/release_notes_detailed/template/pptx_spec_template.json"
```

Edit `pptx_spec_template.json` first to populate slides with content from your release notes.

---

## Step 6 — Report

- Confirm HTML output path
- Confirm PPTX output path (if generated)
- If published: state Confluence page URL
- List issue counts by type from the release data
