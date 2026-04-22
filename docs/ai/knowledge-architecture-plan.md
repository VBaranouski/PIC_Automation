# Knowledge Architecture Plan: Token-Efficient Documentation System

> **Created:** 2026-04-21  
> **Last Updated:** 2026-04-21 (NotebookLM MCP promoted from Tier 4 research-only to Tier 3 runtime tool)  
> **Status:** Planning  
> **Goal:** Replace "fetch everything every time" with a structured, token-efficient knowledge system that keeps the AI agent in context without loading 1000+ pages per conversation.

---

## Problem

Every new conversation requires re-loading the full documentation context to avoid:
- Adding duplicate test cases instead of updating existing ones
- Missing that old functionality breaks when a feature changes
- Not knowing which tests already cover a scenario

**Data sources:** Functional User Guide (300 pages DOCX), Confluence space (1000+ pages), JIRA user stories, Figma designs, meeting notes.

**Current cost:** 50–100K+ tokens per conversation just to establish context.

---

## ⚠️ Data-Sovereignty Gate (READ FIRST)

NotebookLM is a **Google cloud service**. Uploading PICASso documentation means Schneider Electric internal material (Confluence pages, Jira stories, User Guide) leaves the corporate boundary.

Because PICASso is itself a GRC / cybersecurity compliance tool, this decision must be cleared before Phase 4 proceeds:

- [ ] Confirm with SE Security & Data Protection Advisor whether PICASso docs may be uploaded to external AI tools
- [ ] Use a **dedicated Google account**, NOT a SESA corporate identity
- [ ] Prefer **NotebookLM Enterprise** (if SE has Workspace entitlement) — same MCP works, data stays in tenant
- [ ] Start with **non-sensitive** sources only (public Swagger, user-facing guide) — keep internal Confluence out until cleared

If the upload is not cleared, Tier 4 is skipped and the plan still works on Tiers 1–3 alone.

---

## Architecture: 4-Tier Knowledge Pyramid

```
Tier 1: Always-in-Context (~300 lines)         ← Loaded every conversation
         CLAUDE.md + feature-registry.md

Tier 2: On-Demand Knowledge Files (~15-20)     ← Agent reads 1-2 per task (~100 lines each)
         docs/ai/knowledge/<topic>.md

Tier 3: Live MCP Queries                       ← Agent queries at runtime, surgically
         • Atlassian MCP   → specific Confluence page by ID / Jira story
         • NotebookLM MCP  → Q&A against all uploaded sources (zero hallucination)

Tier 4: Human Research + Artifact Generation   ← Rarely used
         NotebookLM web UI for podcasts / mind maps / deep exploration
         Findings distilled into Tier 2
```

### Token Budget per Task

| Layer | Size | When Loaded | ~Tokens |
|---|---|---|---|
| CLAUDE.md (with routing section) | ~150 lines | Every conversation | ~1.5K |
| feature-registry.md | ~100 lines | Every conversation | ~1K |
| NotebookLM MCP (minimal profile, 5 tools) | tool descriptors | Every conversation when enabled | ~0.5K |
| knowledge/\<topic\>.md | ~100 lines each | 1–2 per task | ~1–2K |
| change-impact.md | ~50 lines | When modifying existing tests | ~0.5K |
| NotebookLM query response | ~200–500 tokens per question | Only when Tier 2 is insufficient | ~0.5–1K |
| **Total per typical task** | | | **~4–6K** |
| **Current approach (full fetch)** | 1000s of lines | Every conversation | **50–100K+** |

---

## Current State

Already in place:
- `docs/ai/picasso-overview.md` — 130-line condensed app overview ✅
- `docs/ai/exploration-plan.md` — detailed UI element findings from browser exploration ✅
- `docs/ai/test-cases/input/user-guide.md` — 4099-line converted User Guide (from pandoc) ✅
- `start-mcp-atlassian.sh` — MCP Atlassian server configured (Confluence + JIRA access via PAT) ✅
- `.github/instructions/*.instructions.md` — 10 instruction files for coding patterns ✅

Missing:
- No feature registry (agent has to search every time)
- No topic-specific knowledge files (agent loads entire docs or guesses)
- No change-impact tracker (agent doesn't know what changed between sprints)
- No sync pipeline (knowledge goes stale silently)
- No runtime Q&A fallback (agent can't ask NotebookLM directly)

---

## NotebookLM MCP Server Selection

Two community MCP servers were evaluated:

| Criterion | `jacob-bd/notebooklm-mcp-cli` | `PleasePrompto/notebooklm-mcp` ✅ |
|---|---|---|
| Stars | 3.8k | 2.1k |
| Stack | Python (`uv tool`) | TypeScript / npm |
| Auth | Raw cookie replay (`nlm login`) | Chrome browser automation (persistent) |
| Tool count | **35 always loaded** | **5 / 10 / 16** (configurable profiles) |
| Focus | Podcasts, quizzes, pipelines, research, batch | **Q&A only** (ask_question, list/select notebook) |
| Humanization (anti-detection) | Not documented | Built-in (typing delays, mouse movement) |
| Notebook selection | Manual ID | Tag-based library with auto-selection |
| License | Apache-2.0 | MIT |

**Selected: `PleasePrompto/notebooklm-mcp`** because:

1. **Token efficiency** — the whole purpose of this plan is reducing tokens. `minimal` profile = 5 tools (~0.5K tokens) vs 35 tools (~3–4K) always loaded.
2. **Focused on our use case** — Q&A with citations. We do not need podcasts, quizzes, pipelines, or batch cross-notebook research.
3. **Same toolchain** — TypeScript/npm matches `PIC_Automation`; no new runtime (no Python `uv`).
4. **Lower account-flag risk** — humanization features reduce chance Google detects automation.
5. **Tag-based library** — agent auto-selects the "PICASso" notebook without us hardcoding notebook IDs in `feature-registry.md`.

Both tools carry the same underlying risks: unofficial, may break on Google UI changes, may flag the Google account. Mitigation: use a dedicated, non-corporate Google account.

---

## Phase 1: Foundation — Feature Registry & Routing

### Step 1 — Create `docs/ai/feature-registry.md`

A compact lookup table mapping every PICASso feature area to all relevant project assets.

| Feature Area | Knowledge File | Specs | Tests | Page Objects | Confluence IDs | NotebookLM Tag |
|---|---|---|---|---|---|---|
| auth | knowledge/authentication.md | specs/auth/ | tests/auth/ | LoginPage.ts | PAGE_ID | picasso,auth |
| landing | knowledge/landing-page.md | specs/navigation/ | tests/landing/ | LandingPage.ts | PAGE_ID | picasso,landing |
| product-lifecycle | knowledge/product-lifecycle.md | — | tests/products/ | ProductPage.ts | PAGE_ID | picasso,product |
| release-workflow | knowledge/release-workflow.md | — | tests/releases/ | ReleasePage.ts | PAGE_ID | picasso,release |
| doc-workflow | knowledge/doc-workflow.md | — | tests/doc/ | DocPage.ts | PAGE_ID | picasso,doc |
| ... | ... | ... | ... | ... | ... | ... |

The agent checks this file first — it immediately knows what to read, where to find it, and which NotebookLM tag to query as fallback.

### Step 2 — Add "Knowledge Base" section to `CLAUDE.md`

Routing rules injected into every conversation:

```
Before working on any feature:
  1. Check feature-registry.md for the relevant row
  2. Read ONLY the listed knowledge/<topic>.md file (~100 lines)
  3. Check change-impact.md for recent changes affecting this area
  4. If knowledge file is insufficient for the task, escalate in this order:
       a. NotebookLM MCP — ask_question(tag=<registry tag>, question="...")
          Use for: cross-cutting "how does X interact with Y?" questions
       b. Atlassian MCP  — confluence_get_page(id=<from registry>)
          Use for: authoritative spec details on a specific known page
       c. Atlassian MCP  — jira_get_issue(key=<story>)
          Use for: real-time story/acceptance-criteria lookup
  5. NEVER fetch full Confluence spaces or run broad searches
  6. When modifying tests for an EXISTING feature → read knowledge file FIRST,
     then grep tests/ for existing coverage before creating anything new
```

### Step 3 — Create `docs/ai/change-impact.md`

A human-maintained living document. Updated after each sprint planning or release note review.

Structure per entry:
- Feature area affected
- What changed (with Confluence page / JIRA story reference)
- Which test scenarios need updating (by SCENARIO-ID)
- Which knowledge file needs refreshing
- Status: pending / done

---

## Phase 2: Knowledge Distillation — Topic Files

### Step 4 — Create `docs/ai/knowledge/` directory

~15–20 topic-specific markdown files. Each file follows a consistent structure:

```markdown
## Overview
## Key UI Elements
## Workflows / Business Rules
## Edge Cases & Validations
## Role-Based Access (who can do what)
## Related Features
## Confluence Pages (IDs for re-fetching)
## NotebookLM (tag to query for deeper questions)
```

**Priority topics** (ordered by existing test coverage):

| File | Covers |
|---|---|
| `authentication.md` | Login, SSO, Remember Me, Forgot Password, session handling |
| `landing-page.md` | My Tasks / Products / Releases / DOCs tabs, filters, grid columns, pagination |
| `product-lifecycle.md` | Product creation wizard, product detail, status mapping, change history |
| `release-workflow.md` | All 7 stages, transitions, role gates, conditions per stage |
| `doc-workflow.md` | 5-stage DOC certification, ITS controls, risk assessment |
| `roles-permissions.md` | Role matrix — what each role can/cannot do per workflow stage |
| `questionnaire.md` | Security questionnaire, auto-requirement generation logic |
| `process-requirements.md` | Requirements grid, bulk edit, file upload, Jira integration |
| `product-requirements.md` | Categories, sources, custom requirements, Jama integration |
| `csrr.md` | 10 CSRR sub-sections and their content requirements |
| `fcsr-decision.md` | Approval hierarchy, decision types, report configurator, escalation |
| `actions-management.md` | Cross-release action tracking, pre/post-condition actions |
| `roles-delegation.md` | Delegation flows, who can delegate to whom |
| `data-protection.md` | Privacy review sections, questions, evidence handling |
| `reports-dashboards.md` | Tableau link, org hierarchy filters, 4-level breakdown |

### Step 5 — Distill from User Guide

Source: `docs/ai/test-cases/input/user-guide.md` (4099 lines, already converted).

Process:
1. Split by H1/H2 chapter headings → map each chapter to a knowledge file
2. Enrich with concrete UI element details from `docs/ai/exploration-plan.md` (has actual selectors, grid columns, button labels from live browser exploration)
3. Compress: keep business rules, workflows, role gates — remove marketing/introductory prose
4. One-time effort, AI-assisted

### Step 6 — Distill from Confluence

Process:
1. Identify the top 20–30 most referenced Confluence pages (from `exploration-plan.md` references and `CLAUDE.md`)
2. Fetch each by page ID via MCP Atlassian (`confluence_get_page`)
3. Summarize into the relevant knowledge file
4. Record page ID + last-fetched date in `docs/ai/knowledge/.sync-state.json`

---

## Phase 3: Sync & Maintenance Pipeline

### Step 7 — Create `scripts/sync-knowledge.ts`

CLI script for keeping knowledge files fresh.

```
Usage: npx tsx scripts/sync-knowledge.ts --area release-workflow
       npx tsx scripts/sync-knowledge.ts --all
```

Behavior:
1. Reads `feature-registry.md` to find Confluence page IDs for the requested area
2. Fetches those pages via Confluence REST API (PAT from `.env`)
3. Compares page `version.number` against `.sync-state.json`
4. If changed: prints a diff summary to stdout for human review
5. Human manually updates the knowledge file and bumps `.sync-state.json`
6. Does NOT auto-update knowledge files — human stays in the loop

Add to `package.json`:
```json
"sync:knowledge": "tsx scripts/sync-knowledge.ts",
"sync:knowledge:all": "tsx scripts/sync-knowledge.ts --all"
```

### Step 8 — Create `scripts/distill-user-guide.ts`

CLI script for processing a new User Guide version.

```
Usage: npx tsx scripts/distill-user-guide.ts --input docs/ai/test-cases/input/user-guide.md
```

Behavior:
1. Reads the User Guide markdown
2. Splits by H1/H2 headings into topic chunks
3. Outputs to `docs/ai/knowledge/raw/` for human review before merging
4. Used when a new User Guide version is released (not automated merge)

---

## Phase 4: NotebookLM MCP Integration (Runtime Q&A Layer)

> **Gated on the Data-Sovereignty check at the top of this document.**

### Step 9a — Provision the PICASso NotebookLM notebook

1. Create a dedicated Google account for automation (do NOT use SESA corporate identity)
2. Create a notebook named **"PICASso — Automation KB"**
3. Upload cleared sources (incrementally, as each is approved):
   - User Guide (original DOCX)
   - Top 20 Confluence page exports (PDF/HTML)
   - Swagger API spec (`docs/api/swagger.json`)
   - Figma design exports (when available)
4. Share: **Anyone with link** (required by PleasePrompto server) → copy the share link

### Step 9b — Install and configure the MCP server

Install:
```bash
claude mcp add notebooklm npx notebooklm-mcp@latest
# or for VS Code / Copilot: add to .vscode/mcp.json
```

Configure minimal profile (5 tools only — token-efficient):
```bash
npx notebooklm-mcp config set profile minimal
```

Disable tools we don't need:
```bash
npx notebooklm-mcp config set disabled-tools "cleanup_data,re_auth,remove_notebook"
```

One-time auth through Claude/Copilot: _"Log me in to NotebookLM"_ → Chrome opens for Google login.

### Step 9c — Register the notebook in the agent's library

From the chat: _"Add [PICASso notebook share link] to library tagged 'picasso,automation'"_.

Now any agent task can auto-select this notebook when tags match.

### Step 9d — Agent Q&A workflow

```
Agent task needs info not in knowledge/<topic>.md
   ↓
ask_question(tag="picasso", question="How does the questionnaire auto-generate requirements?")
   ↓
NotebookLM → Gemini 2.5 synthesizes answer from uploaded sources (citations included)
   ↓
Agent uses the answer; optionally distills it back into knowledge/<topic>.md
```

Key property: NotebookLM **refuses to answer** if the information isn't in the uploaded docs — no hallucinated PICASso behaviors.

### Step 9e — When to STILL use Atlassian MCP instead of NotebookLM

| Scenario | Use |
|---|---|
| "What is the latest status of JIRA story PIC-1234?" | Atlassian MCP (real-time) |
| "What does Confluence page 576736204 say exactly?" | Atlassian MCP (authoritative raw) |
| "How does the release workflow interact with DOC?" | NotebookLM MCP (cross-source synthesis) |
| "What are all validation rules for the questionnaire?" | NotebookLM MCP (spans User Guide + Confluence) |
| "Get the acceptance criteria for a new feature in sprint" | Atlassian MCP (freshness > synthesis) |

Rule of thumb:
- **Atlassian MCP** = single source, real-time, authoritative
- **NotebookLM MCP** = multi-source synthesis, stale-but-grounded, zero hallucination

### Step 9f — Keeping the NotebookLM notebook fresh

NotebookLM sources are snapshots; they don't auto-sync with Confluence. When `scripts/sync-knowledge.ts` detects a Confluence version change:
1. Re-export the affected page
2. Update the source in NotebookLM (via web UI)
3. Bump `.sync-state.json`

This is intentionally manual — prevents unclassified internal content leaking into the notebook without review.

---

## Phase 5: Agent Instruction Update

### Step 10 — Create `.github/instructions/knowledge-routing.instructions.md`

Encodes the full decision tree as a Copilot instruction file (auto-loaded in VS Code):

```
New automation task arrives:
  1. Identify feature area(s) from the task description
  2. Read docs/ai/feature-registry.md → find knowledge file, specs dir, tests dir, NotebookLM tag
  3. Read the matching docs/ai/knowledge/<topic>.md (~100 lines)
  4. Read docs/ai/change-impact.md → check for recent changes to this area
  5. If information still missing, escalate:
       a. NotebookLM MCP    — ask_question(tag=<from registry>, question="...")
       b. Atlassian MCP     — confluence_get_page(id=<from registry>)
       c. Atlassian MCP     — jira_get_issue(key=<story>)
       → Never broad-search Confluence/Jira
  6. Before creating any test:
       → grep tests/<area>/ for existing coverage
       → Check feature-registry.md for existing SCENARIO-IDs
       → Update existing tests if the feature changed; create new only if truly new
  7. After completing automation work:
       → Note any discovered gaps in change-impact.md
       → If a NotebookLM answer revealed important context → distill into knowledge/<topic>.md
```

---

## Files to Create / Modify

### New files
| File | Description |
|---|---|
| `docs/ai/feature-registry.md` | Feature-to-assets lookup (now includes NotebookLM tag column) |
| `docs/ai/change-impact.md` | Living change tracker |
| `docs/ai/knowledge/authentication.md` | Auth knowledge file |
| `docs/ai/knowledge/landing-page.md` | Landing page knowledge file |
| `docs/ai/knowledge/product-lifecycle.md` | Product lifecycle knowledge file |
| `docs/ai/knowledge/release-workflow.md` | Release workflow knowledge file |
| `docs/ai/knowledge/doc-workflow.md` | DOC workflow knowledge file |
| `docs/ai/knowledge/roles-permissions.md` | Role matrix knowledge file |
| `docs/ai/knowledge/questionnaire.md` | Questionnaire knowledge file |
| `docs/ai/knowledge/process-requirements.md` | Process requirements knowledge file |
| `docs/ai/knowledge/product-requirements.md` | Product requirements knowledge file |
| `docs/ai/knowledge/csrr.md` | CSRR knowledge file |
| `docs/ai/knowledge/fcsr-decision.md` | FCSR decision knowledge file |
| `docs/ai/knowledge/actions-management.md` | Actions management knowledge file |
| `docs/ai/knowledge/roles-delegation.md` | Roles delegation knowledge file |
| `docs/ai/knowledge/data-protection.md` | Data protection knowledge file |
| `docs/ai/knowledge/reports-dashboards.md` | Reports & dashboards knowledge file |
| `docs/ai/knowledge/.sync-state.json` | Confluence sync timestamps |
| `scripts/sync-knowledge.ts` | Confluence sync CLI |
| `scripts/distill-user-guide.ts` | User Guide splitter CLI |
| `.github/instructions/knowledge-routing.instructions.md` | Agent routing instructions |

### Existing files to modify
| File | Change |
|---|---|
| `CLAUDE.md` | Add "Knowledge Base" section with routing rules (incl. NotebookLM MCP) |
| `package.json` | Add `sync:knowledge` and `sync:knowledge:all` scripts |
| `.vscode/mcp.json` (or equivalent) | Register `notebooklm-mcp` with `minimal` profile |

---

## Verification Checklist

- [ ] **Data-sovereignty:** PICASso docs upload approved by SE Security/DPA (or Enterprise NotebookLM used)
- [ ] **Token measurement:** task "add test for release creation" — measure tokens BEFORE vs AFTER. Target: <6K vs 50K+
- [ ] **Coverage check:** every directory in `tests/` has a matching row in `feature-registry.md`
- [ ] **Freshness test:** run `sync-knowledge.ts --area auth`, verify it detects version changes in Confluence
- [ ] **NotebookLM integration test:** agent answers "How does questionnaire generate requirements?" by calling `ask_question` (not by re-reading the full User Guide)
- [ ] **Profile verified:** `notebooklm-mcp config get` shows `profile=minimal`, only 5 tools exposed
- [ ] **Agent workflow test:** task "update login tests for new SSO flow" → agent reads registry → reads `knowledge/authentication.md` → does NOT fetch full Confluence space → uses NotebookLM only if knowledge file is insufficient → checks `tests/auth/` before creating new files
- [ ] **Deduplication test:** task "add scenario for release creation" → agent finds existing SCENARIO-IDs for release creation and updates instead of creating duplicates

---

## Key Decisions

| Decision | Rationale |
|---|---|
| Promote NotebookLM from Tier 4 (human-only) to Tier 3 (runtime) | Community MCP servers enable direct agent Q&A — removes manual copy-paste loop |
| Choose `PleasePrompto/notebooklm-mcp` over `jacob-bd/notebooklm-mcp-cli` | Configurable 5-tool minimal profile vs 35 always-on tools; TS/npm matches repo; humanization lowers detection risk; Q&A focus matches use case |
| Use `minimal` profile (5 tools) | Keeps runtime tool descriptors ~0.5K tokens instead of ~3–4K |
| Dedicated Google account for NotebookLM automation | Avoid account flag risk on corporate SSO; isolates data scope |
| Keep Atlassian MCP as the authoritative real-time source | NotebookLM = synthesis across snapshots; Atlassian = freshness & precise page/story lookups |
| Manual curation of knowledge files over automated RAG | Better quality, zero infra cost, Git-tracked, reviewable, works offline |
| Human-in-the-loop for knowledge + NotebookLM source updates | Prevents silent staleness AND unclassified content leaking into Google cloud |
| `feature-registry.md` always in context | Zero-cost routing — agent never has to search for "where is auth code?" |
| Data-sovereignty gate required before Phase 4 | PICASso is a cybersecurity/GRC product — its own docs must respect SE classification rules |
