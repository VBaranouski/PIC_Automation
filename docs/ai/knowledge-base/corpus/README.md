# Corpus Indexes

> Tier 3 · metadata only. These files are **generated** and **not loaded into context** in bulk.
> Agents grep them to find a specific id/title/anchor, then fetch content via Atlassian MCP or line-range reads.

| File | Source | Generator | Notes |
|---|---|---|---|
| `confluence-index.md` | Confluence REST (PICASso space) | `scripts/index-confluence.ts` | page-id, title, version, updated, owning-area |
| `user-guide-index.md` | `docs/ai/test-cases/input/user-guide.md` | `scripts/index-user-guide.ts` | section anchors with line ranges |
| `scenario-index.md` | `config/scenarios.db` | `scripts/index-scenarios.ts` | per-area prefix counts — not full scenarios |

Regenerate via `npm run index:all`.
