---
name: create-user-stories
description: Use when creating User Stories from a Confluence specification page and Figma mockups. Generates a complete HTML backlog document covering all functional requirements.
---

# Create User Stories from Confluence + Figma

Generate JIRA-ready User Stories from a functional specification (Confluence page) and optional Figma design mockups using the SE-DevTools CLI and Claude AI.

## Identify inputs

Collect from the user before running:

| Input | Flag | Required? |
|-------|------|-----------|
| Confluence page URL | `--confluence-url` | **Yes** |
| Figma design URL (with node-id) | `--figma-url` | Optional |
| Example JIRA story IDs (format reference) | `--example-story` (repeatable) | Optional |
| Parent Epic/Feature key | `--epic` | Optional |
| JIRA project key | `--project` | Optional (default: PIC) |

If any optional input wasn't provided, ask before running — they significantly improve output quality.

## Run the CLI

```bash
cd packages/docs-generator

# Minimal
python main.py user-stories \
  --confluence-url "https://confluence.se.com/spaces/PIC/pages/123456/Page+Title"

# Full (recommended)
python main.py user-stories \
  --confluence-url "https://confluence.se.com/spaces/PIC/pages/123456/Page+Title" \
  --figma-url "https://www.figma.com/design/ABC123/Release?node-id=1234-5678" \
  --example-story PIC-8803 \
  --example-story PIC-8804 \
  --epic PIC-8802 \
  --project PIC
```

Output: `../../output/user_stories/user_stories_{title}_{date}.html`

## Manual creation (no Confluence/JIRA access)

If Confluence or JIRA is unreachable, ask the user to paste:
- The functional specification text
- Any example user story text for format reference
- Figma screenshot or annotated mockup description

Then generate stories inline following the same schema:

```
Title: [Short imperative action]
As a [specific user role],
I want [clear capability],
so that [concrete business benefit].

Acceptance Criteria:
1. [Verifiable condition]
2. [Verifiable condition]
...

Source: [Which section of the spec this covers]
```

**Critical rules for manual generation:**
- Extract requirements **only** from the provided spec — no assumptions, no invented requirements
- Each AC must be verifiable — avoid vague language like "works correctly" or "is easy to use"
- Every story must cite which part of the spec it covers (traceability)
- Roles must be specific (e.g. "Delegating Manager", "System Administrator") — not just "user"

## Report

After running:
- Confirm the output file path
- State: N user stories generated
- List story titles for quick review
- Flag any spec sections that were ambiguous or had insufficient detail

## Future: Create in JIRA

When `--create-jira` support is added, this skill will POST the generated stories directly to JIRA under the specified Epic. Until then, stories are HTML-only for review and manual JIRA creation.
