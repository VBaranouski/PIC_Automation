# PICASso Exploration Plan — Knowledge-Base Edition

> **Purpose:** Populate `docs/ai/knowledge-base/knowledge/*.md` and `feature-registry/*.md` with **current** UI facts for **in-progress features** so the agent can author accurate automation without loading the whole corpus.
> **Output:** Updates to existing Tier-2 knowledge + registry files (not a new standalone map).
> **Created:** 2026-04-22
> **Status:** 🟡 PLAN READY — awaiting browser walkthrough

---

## Scope

### In-scope (the "unknown" surface)
Confluence page-tree rooted at **[Functional Requirements (400856947)](https://confluence.se.com/spaces/PIC/pages/400856947/Functional+Requirements)** — 312 pages, metadata in [corpus/confluence-index.md](knowledge-base/corpus/confluence-index.md). Focus on sub-trees:

| Bucket | Confluence Root | Features of interest (depth 3) |
|---|---|---|
| 02. In development | 485741603 | `440200506` Data Privacy Reports in Tableau · `587596145` Delegated Requirements Traceability · `483816813` Privacy by design (changes) · `610919092` Product & Process Requirements Versioning · `688765053` Software Composition Details Scan & Component Management |
| 01. Ready for development | 485741653 | (descendants to be enumerated on walk) |
| 03. Ready | 450768918 | (stable — re-verify only what changed since last sprint) |
| Functional Spec & UG Updates | 680696523 | Treat as delta log; cross-reference against [change-impact.md](knowledge-base/change-impact.md) |

### Out-of-scope
- BackOffice, PIM, STAC, Digital Cert Portal, external Tableau → only visual regression; skip deep UI walk.
- Everything already marked `[x]` in `docs/ai/exploration-plan.md` (the legacy A–O map) unless the Confluence diff flags it as changed.
- User-Guide sections already present in [corpus/user-guide-index.md](knowledge-base/corpus/user-guide-index.md) — read on demand, do not re-transcribe.

---

## Environment

| Parameter | Value |
|---|---|
| Base URL | `https://qa.leap.schneider-electric.com` |
| Login URL | `/GRC_Th/Login` |
| Landing URL | `/GRC_PICASso/` |
| Default user | `PICEMDEPQL` / `outsystems` (PQL superuser — covers all roles for read-only walk) |
| Browser | Chromium headed via Playwright |
| Tooling | `npm run inspect` · `npm run codegen` · Playwright MCP (if available) |
| Safety | Read-only paths only; do not submit destructive forms on QA shared data |

Credentials live in [config/users/](config/users/); the default user is already the `process_quality_leader` role.

---

## Walkthrough Protocol

Per feature, the agent performs exactly these steps and nothing more:

1. **Resolve feature → Confluence page(s).** Use `confluence_get_page(id=…)` against the ids listed in Scope.
2. **Identify role requirements.** Read the `Access Privileges` sub-tree (root 731922839) for the feature.
3. **Navigate.** Open the QA URL; locate the feature via the role-appropriate workflow (landing → product → release / DOC).
4. **Capture** (one file per feature, appended to the matching `knowledge/<topic>.md`):
   - URL path pattern (with sample params)
   - Visible UI elements: grid columns, buttons, filters, form fields, validation messages
   - Workflow transitions (button → next screen/state)
   - Role-based visibility (what's shown/hidden vs other roles — logged in field notes)
   - Edge cases / error states encountered
   - DOM selector hints (prefer semantic; fall back to `[data-*]` or text)
5. **Cross-check** against the legacy [exploration-plan.md](exploration-plan.md) for deltas — log each delta into [knowledge-base/change-impact.md](knowledge-base/change-impact.md).
6. **Classify**: did the walk reveal a feature missing from `feature-registry/<area>.md`? If yes, add a row with a new `feature-id`.
7. **Never** submit a form that creates/mutates data unless (a) a disposable test product exists and (b) the fixture cleanup is wired.

---

## Per-Feature Checklist Template

Copy this into `knowledge/<topic>.md` and fill during the walk.

```markdown
### <feature-id> — <title>

- Confluence: [<page-id>](https://confluence.se.com/pages/viewpage.action?pageId=<page-id>)
- UG anchor: <anchor from corpus/user-guide-index.md>
- Entry path: <URL pattern>
- Roles required: <role codes>
- UI Elements:
  - [ ] Header
  - [ ] Filters: <names>
  - [ ] Grid columns: <names>
  - [ ] Actions / buttons: <names>
  - [ ] Forms & validations: <fields>
- Workflow:
  1. …
  2. …
- Edge cases:
  - …
- Deltas vs legacy exploration-plan.md:
  - …
```

---

## Target Coverage (this sprint)

| Feature ID (proposed) | Registry file | Knowledge file | Confluence | Priority |
|---|---|---|---|---|
| `releases.requirements.versioning` | feature-registry/releases.md | knowledge/process-requirements.md | 610919092 | P1 |
| `releases.requirements.traceability.delegated` | feature-registry/releases.md | knowledge/process-requirements.md | 587596145 | P1 |
| `releases.sca.component-management` | feature-registry/releases.md | knowledge/product-requirements.md (new section) | 688765053 | P1 |
| `releases.data-protection.privacy-by-design` | feature-registry/releases.md | knowledge/data-protection.md (new file) | 483816813 | P2 |
| `reports.tableau.data-privacy` | feature-registry/reports.md | knowledge/reports-dashboards.md (new file) | 440200506 | P2 |

Each row will graduate to a table entry in its `feature-registry/<area>.md` with `last-verified` set to the walk date.

---

## Classification Policy (applied during walk)

- **Match ≥ 1 existing feature-id in `feature-registry/<area>.md`** → IMPROVEMENT. Log delta in `change-impact.md`, update registry `last-verified`.
- **No match anywhere (registry + confluence-index + scenario-index)** → NEW. Mint feature-id `<area>.<slug>`, add registry row in the same commit.
- Always verify with `npm run tracker:list -- --feature-area=<area> --grep=<keyword>` before declaring NEW.

---

## Gate for Execution

The walk runs only after:

1. ✅ User-guides indexed → [corpus/user-guide-index.md](knowledge-base/corpus/user-guide-index.md) (4 files, 210 headings).
2. ✅ Confluence sub-tree indexed → [corpus/confluence-index.md](knowledge-base/corpus/confluence-index.md) (312 pages).
3. ⏳ Jira user stories for the in-progress features fetched (next step, per user request).
4. ⏳ Tracker coverage snapshot for the 5 target feature-ids — `npm run tracker:list --feature-area=releases --grep="<keyword>"` per row.
5. ⏳ Headed QA login validated with `PICEMDEPQL`.

---

## Artefact layout after the walk

```
docs/ai/knowledge-base/
├── feature-registry/releases.md        ← 5 new rows appended
├── feature-registry/reports.md         ← 1 new row appended
├── knowledge/
│   ├── process-requirements.md         ← versioning + delegated traceability sections
│   ├── product-requirements.md         ← SCA component management section
│   ├── data-protection.md              ← NEW (privacy-by-design section)
│   └── reports-dashboards.md           ← NEW (Tableau Data Privacy section)
└── change-impact.md                    ← one row per delta discovered
```
