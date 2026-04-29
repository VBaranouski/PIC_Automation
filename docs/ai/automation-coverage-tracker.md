# Automation Coverage Tracker

> **Purpose:** Durable operating plan and progress tracker for automating PIC_Automation coverage across 20+ workflows.
> **Created:** 2026-04-29
> **Last Updated:** 2026-04-29
> **Status:** In Progress

This file is the human-readable companion to the SQLite tracker. The authoritative scenario state remains in `config/scenarios.db`; this document explains the execution plan, blocker model, agent workflow, and next scopes so future prompts can be short.

Use this file when the user says:

- `continue the plan`
- `pick next scope`
- `update blockers`
- `sync tracker`
- `validate batch`
- `update plan`

## Latest Snapshot

Generated with `npm run tracker:report` on 2026-04-29.

| Metric | Count | Percent |
| --- | ---: | ---: |
| Total scenarios | 1837 | 100.0% |
| Pending automation | 951 | 51.8% |
| Automated | 682 | 37.1% |
| On hold | 198 | 10.8% |
| Updated | 6 | 0.3% |
| Passed | 392 | 21.3% |
| Not executed | 1301 | 70.8% |
| Skipped | 109 | 5.9% |
| Failed defect | 35 | 1.9% |

### Feature Area Snapshot

| Feature area | Scenarios |
| --- | ---: |
| releases | 732 |
| doc | 547 |
| products | 179 |
| integrations | 107 |
| landing | 107 |
| backoffice | 72 |
| other | 54 |
| reports | 28 |
| auth | 11 |

### Priority Snapshot

| Priority | Scenarios | Percent |
| --- | ---: | ---: |
| P1 | 289 | 15.7% |
| P2 | 1163 | 63.3% |
| P3 | 385 | 21.0% |

## Current Position

WF3 Product Management is the active coverage stream. Recent progress created deterministic WF3 pre-req data, activated Status Mapping coverage, added non-destructive Product/Release Inactivation coverage, and cleaned up Tracking Tools `006..010` by promoting current-QA passes and explicitly skipping current-QA mismatches.

Current WF3 Tracking Tools state:

| Scenario | Automation state | Execution status | Note |
| --- | --- | --- | --- |
| `TRACKING-TOOLS-006` | automated | skipped | Current QA no longer renders mapping warning after enabling Jira. |
| `TRACKING-TOOLS-007` | automated | passed | Jama toggle reveals Jama Project Id input. |
| `TRACKING-TOOLS-008` | automated | skipped | Current QA keeps Product requirements at Not Applicable after enabling Jama. |
| `TRACKING-TOOLS-009` | automated | passed | Jira radio is disabled when Jama is enabled. |
| `TRACKING-TOOLS-010` | automated | passed | Empty Jira fields block Save with validation. |

## Command Contract

When the user gives a short instruction, follow this contract automatically.

| User command | Agent action |
| --- | --- |
| `continue the plan` | Read this file, identify the first incomplete active phase, check tracker/test state, then continue implementation. |
| `pick next scope` | Spawn read-only scouts for candidate workflows, rank 3-5 scenario groups by readiness and risk, then propose or start the best batch. |
| `update blockers` | Scan failed/skipped/on-hold scenarios, classify blocker category, update blocker register and tracker notes, then propose unblock actions. |
| `sync tracker` | Query `config/scenarios.db`, update statuses/notes as needed, regenerate `config/scenarios-export.json`, and report mismatches. |
| `validate batch` | Check pre-req state, run focused Playwright, lint, and diagnostics, then update tracker/export for the result. |
| `update plan` | Revise this file with new phase order, blockers, decisions, or better implementation strategy. |

## Multi-Agent Operating Model

Use one main implementation agent per batch. The main agent owns edits, validation, tracker DB updates, export regeneration, and the final report.

Spawn read-only Explore agents when the scope spans multiple workflows or the next candidate is unclear. Keep their outputs concise and file/ID based.

| Scout | Purpose | Output expected |
| --- | --- | --- |
| Workflow Scout | Find unblocked scenario IDs, specs, existing tests, and coverage gaps. | Scenario IDs, files, likely next candidates. |
| Implementation Scope Scout | Map POM methods, fixtures, helpers, setup projects, and state dependencies. | Helper/POM map, pre-req chain, safe implementation notes. |
| Blocker Triage Scout | Classify skipped/on-hold/destructive/external/RBAC risks. | Blocker category, tier, mitigation, owner/action. |
| Tracker/Docs Scout | Compare tests, specs, DB, and export for stale state. | Sync gaps, docs gaps, tracker update plan. |

Write rules:

- Only one agent updates `config/scenarios.db` and `config/scenarios-export.json` in a batch.
- Only one agent edits shared helpers, Playwright config, or common page objects in a batch.
- Parallel agents should be read-only unless the user explicitly assigns separate write scopes.
- Do not spawn agents merely to speed up trivial local searches.

## Workflow Roadmap

| Phase | Status | Scope | Example prefixes | Strategy |
| --- | --- | --- | --- | --- |
| Foundation and tracker hygiene | In progress | Auth setup, tracker DB/export, naming, project dependencies, fixtures | `AUTH-*` | Keep tracker and setup stable before broad coverage. |
| Landing and navigation | Planned | My Products, My Releases, My Tasks, My DOCs, Reports tab, filters | `LANDING-*`, `LANDING-PRODS-*`, `LANDING-TASKS-*` | Prefer read-only sort/filter/navigation checks first. |
| Product Management / WF3 | In progress | Product creation/detail/releases/history/DPP/tracking/status mapping/inactivation | `PRODUCT-*`, `STATUS-MAP-*`, `TRACKING-TOOLS-*` | Use `wf3-pre-req` and disposable data. |
| Release Creation and Early Release / WF4 | Planned | Release creation, clone, header/sidebar, roles, stage-1 checks | `RELEASE-CREATE-*`, `RELEASE-CLONE-*`, `RELEASE-ROLES-*` | Start with cancel paths, validation, and read-only checks. |
| Release Manage / WF5 | Planned | Manage stage, questionnaire, requirements, status updates, review summary | `RELEASE-MANAGE-*`, `RELEASE-REVIEW-*`, `RELEASE-REQ-*` | Begin with read-only review/summary checks. |
| Release CSRR and Actions / WF6 | Planned | CSRR, Actions Management, FCSR, closure checks, report configurator | `RELEASE-CSRR-*`, `RELEASE-MANAGE-ACTION-*`, `ACTIONS-*` | Avoid irreversible submit/close paths until isolated. |
| DOC Lifecycle | Planned | DOC setup/initiation/details/roles/ITS/risk/certification/history/tasks | `DOC-SETUP-*`, `DOC-INIT-*`, `DOC-CERT-*` | Respect DOC setup chain and keep implementation isolated. |
| DPP and delegated requirements | Planned | DPP review, PCC/FCSR summaries, delegation, import/export | `DPP-*`, `PCC-*`, `FCSR-*`, `RELEASE-REQ-DELEGATED-*` | Split read-only evidence from import/export mutations. |
| Reports and dashboards | Planned | Tableau/report navigation, filters, report configurator | `REPORT-*`, `DOC-REPORTS-*` | Skip gracefully if iframe/external dashboard is unavailable. |
| BackOffice configuration | Planned | Requirements versioning, SAST, banners, notifications, training config | `BACKOFFICE-*`, `SAST-*`, `REQ-VER-*`, `BANNER-*` | Gate admin/RBAC and cleanup all config mutations. |
| Integrations and APIs | Planned | Extraction, ingestion, Intel DS, OAuth/PAT, Jira/Jama connection | `INT-*`, `EXTRACT-*`, `INGEST-*` | Separate pure contract checks from live external checks. |
| Cross-cutting maintenance | Planned | Email, tasks, maintenance mode, periodic review, audit/history | `EMAIL-*`, `MAINT-*` | Automate stable read-only checks first. |

## Next Scope Queue

Keep this section short and update it after each completed batch.

| Rank | Candidate | Why next | Risk |
| ---: | --- | --- | --- |
| 1 | WF3 Tracking Tools bookkeeping | Current slice just validated; tracker/docs/export should stay aligned. | Low |
| 2 | WF5 review summaries | Read-only candidates such as `RELEASE-REVIEW-PREVFCSR-*` and `RELEASE-REVIEW-SUMMARY-*`. | Low/Medium |
| 3 | WF6 CSRR and Actions visibility | Candidate IDs include `RELEASE-CSRR-001` and `RELEASE-MANAGE-ACTION-001/002/003`. | Medium |
| 4 | WF4 release early-stage checks | Release creation/clone/stage-sidebar checks after confirming disposable release setup. | Medium |
| 5 | DOC lifecycle scout | Large setup chain; do read-only inventory before implementation. | Medium/High |

## Blocker Categories

Use exactly one primary blocker category in tracker notes, then add detail.

| Category | Meaning | Typical mitigation |
| --- | --- | --- |
| `data-fixture` | Missing/stale `.wf3-product-state.json`, `.doc-state.json`, disposable product, release, or DOC. | Run setup project or create disposable fixture. |
| `destructive` | Inactivation, disabling tracking tools, irreversible submit/transition, delete, import overwrite. | Use disposable data, teardown, serial single-worker execution. |
| `external` | Jira, Jama, Tableau, OAuth, Intel DS, extraction/ingestion API unavailable. | Split UI validation from live connection; skip live checks with notes. |
| `privilege` | Required role/permission unavailable in default storage state. | Add multi-user fixture or keep on hold with privilege name. |
| `ui-missing` | Current QA behavior differs from spec/AC. | Explicit skip, tracker note, ask product/QA to reconfirm. |
| `environment` | QA feature flag/config/state not ready. | Document precondition and recheck after environment update. |
| `flaky-selector` | OutSystems refresh, stale hidden popovers, date picker binding, custom widgets. | Harden locators, scope visible DOM, add helper method. |

## Safety Rules

1. Use disposable products/releases/DOCs for destructive-adjacent flows whenever possible.
2. Never mutate shared pre-req state unless the test owns setup and teardown.
3. Prefer cancel-path validation before submit-path validation.
4. For current-QA/spec mismatches, keep tests explicit: `automated/skipped` with a clear reason and tracker `execution_notes`.
5. For external services, separate field/UI validation from live connection success.
6. Scope selectors to visible dialogs, popovers, and tab panels to avoid stale hidden DOM.
7. Avoid broad suite runs while developing; validate with focused grep/spec commands first.
8. Use direct SQLite updates when tracker CLI quirks block exact IDs or execution notes, then regenerate export.

## Definition Of Done For Each Batch

| Area | Required outcome |
| --- | --- |
| Code | Tests use existing fixtures/POM/helpers; no unrelated refactors. |
| Data | Pre-req setup or disposable data is documented and repeatable. |
| Tests | Focused Playwright run passes or intentionally skips with clear reasons. |
| Lint/diagnostics | Focused ESLint and `get_errors` are run for changed TypeScript files. |
| Docs | Relevant `specs/*.md` sections note automation status, preconditions, and blockers. |
| Tracker | `automation_state`, `execution_status`, `spec_file`, and `execution_notes` are updated in `config/scenarios.db`. |
| Export | `npm run tracker:export` or `npx tsx scripts/tracker.ts export` regenerates `config/scenarios-export.json`. |
| Handoff | This file is updated with progress, blockers, and next scope. |

## Standard Commands

```bash
# Tracker snapshot
npm run tracker:report

# List by area or workflow
npm run tracker:list -- --area products
npm run tracker:list -- --workflow "Actions Management"

# Sync check and export
npm run tracker:sync -- --dry-run
npm run tracker:export

# WF3 setup
npx playwright test --project=wf3-pre-req --reporter=list --workers=1

# Focused validation
npx playwright test <spec-file> --project=chromium --grep "SCENARIO-ID|OTHER-ID" --reporter=list --workers=1

# Focused lint
npx eslint --config config/.eslintrc.cjs <changed-test-or-src-file>
```

Tracker CLI caveats:

- `scripts/tracker.ts` uppercases IDs before DB lookup. For lowercase suffix IDs such as `-b` or `-c`, use direct SQLite updates.
- There is no `notes` subcommand. Update `scenario_details.execution_notes` directly through SQL when needed.
- Regenerate `config/scenarios-export.json` after every DB update.

## Pre-Req State Map

| State | Created by | Consumed by | Notes |
| --- | --- | --- | --- |
| `.auth/user.json` | `tests/auth/auth.setup.ts` | Most projects | Base login state. |
| `.wf3-product-state.json` | `tests/products/product-management.pre-req.setup.ts` | WF3 product/status/tracking/DPP tests | Run `--project=wf3-pre-req` before isolated WF3 runs. |
| `.doc-state.json` | `tests/doc/doc-state.setup.ts` | DOC detail/lifecycle specs | Depends on DOC setup and initiation chain. |

## Reusable Agent Prompts

Use these as starting prompts when spawning read-only scouts.

### Workflow Scout

```text
Read-only exploration. In PIC_Automation, identify unblocked scenarios for <workflow>, current test/spec files, tracker state, and likely blockers. Do not modify files. Return exact scenario IDs, files, commands, and recommended next batch.
```

### Implementation Scope Scout

```text
Read-only exploration. For <scenario IDs or test file>, map Playwright project dependencies, pre-req state files, fixtures, helper functions, POM methods, and teardown patterns. Do not modify files. Return exact files and signatures where useful.
```

### Blocker Triage Scout

```text
Read-only exploration. Triage skipped/on-hold/failed scenarios in <workflow>. Classify each blocker as data-fixture, destructive, external, privilege, ui-missing, environment, or flaky-selector. Do not modify files. Return scenario IDs, tier, mitigation, and owner/action.
```

### Tracker/Docs Scout

```text
Read-only exploration. Compare tests, specs, config/scenarios.db, and config/scenarios-export.json for <workflow>. Do not modify files. Return stale statuses, missing docs, missing tracker rows, and exact update commands.
```

## Update Log

| Date | Update |
| --- | --- |
| 2026-04-29 | Created master automation coverage tracker from session plan and current tracker report. |
