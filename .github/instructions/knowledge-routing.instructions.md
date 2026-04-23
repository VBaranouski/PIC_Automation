---
applyTo: '**'
---

# Knowledge Routing — Token-Efficient Context Rules

> Purpose: keep per-task context under ~10K tokens instead of fetching 1000+ pages every time.
> Authority: supersedes any instruction that says "read the whole User Guide" or "search all of Confluence".

## Tier Map

| Tier | Files | Load policy |
|---|---|---|
| 1 | `docs/ai/knowledge-base/feature-areas.md`, `docs/ai/knowledge-base/change-impact.md` | Always in context |
| 2 | `docs/ai/knowledge-base/feature-registry/<area>.md`, `docs/ai/knowledge-base/knowledge/<topic>.md` | Load 1–2 per task |
| 3 | `docs/ai/knowledge-base/corpus/*-index.md`, `config/scenarios.db` | Grep only — never read whole file |
| 4 | Atlassian MCP, tracker CLI, `grep_search` | Surgical runtime fetches |

## Mandatory Pre-Task Routine

1. **Identify the area.** Keyword-match the task against `feature-areas.md` (already loaded).
2. **Read the matching `feature-registry/<area>.md`.** Look for an existing `feature-id`.
3. **Classify:**
   - **Match ≥ 1 feature-id → IMPROVEMENT.** Reuse the scenario-id prefix; query the tracker for existing coverage (`npm run tracker:list -- --feature-area=<area> --grep=<keyword>`) and the test dir (`grep_search` in `tests/<area>/`). Update existing scenarios/tests; do NOT create duplicates.
   - **No match anywhere (registry + corpus indexes) → NEW.** Mint a feature-id (`<area>.<slug>`); add a row to `feature-registry/<area>.md` in the same PR; seed scenario-ids with the new prefix.
4. **Read the distilled knowledge file** (`knowledge/<topic>.md`) pointed to by the `feature-areas.md` row.
5. **Check `change-impact.md`** for recent (≤2 sprint) changes affecting this area.

## Forbidden Actions

- Reading `docs/ai/test-cases/input/user-guide.md` in bulk. Use `corpus/user-guide-index.md` to find the anchor + line range, then `read_file(startLine, endLine)`.
- Broad Confluence search. Use `corpus/confluence-index.md` to find the page-id, then `confluence_get_page(id=X)` via Atlassian MCP.
- Dumping the tracker DB into context. Use `npm run tracker:list` with filters.
- Creating a new test file without first checking the matching `tests/<area>/` for existing coverage.
- **Accessing Jira or Confluence via a web browser or any tool that follows HTTP redirects to an SSO/OAuth login page.** The Schneider Electric Atlassian instance requires SSO which blocks browser-based access. Always use the REST API directly with credentials from `.env`.

## On Task Completion

1. If the feature was **IMPROVEMENT**: update the `Last Verified` date on the matching registry row and set the `change-impact.md` row to `done`.
2. If the feature was **NEW**: confirm the new registry row is in place; ensure scenario-ids use the new prefix; add it to `change-impact.md` with type `NEW`.
3. If a knowledge file was visibly outdated: add a follow-up row to `change-impact.md` with status `pending` rather than silently editing the knowledge file mid-task.

## Escalation Order (when the Tier-1/Tier-2 files are insufficient)

1. `npm run tracker:list -- --feature-area=<area> --grep=<term>`
2. `grep_search` across `docs/ai/knowledge-base/corpus/` (metadata hits only)
3. Confluence REST API — `curl -s -H "Authorization: Bearer <CONFLUENCE_TOKEN>" "https://confluence.se.com/rest/api/content/<page-id>?expand=body.storage"` (credentials from `.env`)
4. Jira REST API — `curl -s -u "<JIRA_USER>:<JIRA_TOKEN>" "https://jira.se.com/rest/api/2/issue/<PIC-NNNN>"` (credentials from `.env`)
5. Surgical `read_file(startLine, endLine)` into `user-guide.md` using the index

> **Atlassian API rule:** Always call Confluence and Jira via REST API (steps 3–4 above). Never use a web browser, `fetch_webpage`, or any tool that follows SSO redirects — the Schneider Electric instance blocks non-API access. Read credentials from `.env` before making any API call.
