---
name: create-release-note-detailed
description: Use when creating comprehensive PICASso-format release notes in both HTML and PPTX formats. Combines Jira data with AI-generated narrative. Runs two CLI commands: release-notes-detailed (HTML) then pptx-release-notes (PowerPoint).
---

# Create Full Release Notes (HTML + PPTX)

Generate comprehensive release notes combining Jira data and Claude AI narrative, output as both HTML and PowerPoint.

## Gather inputs

Ask the user for:

- **Version string** (e.g., `2.4.1`) — required
- **Project key** (e.g., `PROJ`) — optional
- **Spec file** (e.g., `spec.txt`) — optional AI guidance file in `input/release_notes_detailed/`
- **Publish to Confluence?** — adds `--publish` to Phase 1

## Phase 1 — Generate HTML

```bash
cd packages/docs-generator

# Basic:
python main.py release-notes-detailed --version "2.4.1"

# With project + spec + publish:
python main.py release-notes-detailed --version "2.4.1" --project PROJ --spec "spec.txt" --publish
```

Output: `../../output/release_notes_detailed/release_notes_detailed_2.4.1.html`

## Phase 2 — Generate PPTX

Use the JSON spec template (auto-generated alongside Phase 1 output):

```bash
python main.py pptx-release-notes --spec "output/release_notes_detailed/template/pptx_spec_template.json"
```

Output: `../../output/release_notes_detailed/<name>.pptx`

## Report

Present both output paths:

- HTML: `output/release_notes_detailed/release_notes_detailed_2.4.1.html`
- PPTX: `output/release_notes_detailed/<name>.pptx`
- If published: Confluence page URL

## Notes

- Phase 1 uses Claude AI to write narrative sections from Jira data
- Phase 2 uses `python-pptx` to build slides from JSON spec — no AI call needed
- Edit `pptx_spec_template.json` to customize content before running Phase 2
- Both phases are independent — can re-run either separately
