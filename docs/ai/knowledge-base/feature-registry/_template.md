# Feature Registry — <AREA>

> Tier 2 · on-demand. Keep ≤ 80 rows per area. Each row must have a stable `feature-id` (`<area>.<slug>`).

| Feature ID | Description (1 line) | Status | Scenario-ID Prefix | UG Section | Confluence Page IDs | POM Method(s) | Last Verified |
|---|---|---|---|---|---|---|---|

## Conventions

- **feature-id** — lowercase, dot-separated, stable across renames. Never reuse.
- **Status** — `active` · `deprecated` · `planned`.
- **Scenario-ID Prefix** — matches `AREA-ACTION-###` patterns in the tracker, e.g. `AUTH-LOGIN-*`.
- **UG Section** — anchor from [corpus/user-guide-index.md](../corpus/user-guide-index.md).
- **Confluence Page IDs** — numeric ids only; fetch via `confluence_get_page(id=…)`.
- **Last Verified** — ISO date when this row was reconciled against live UI/spec.
