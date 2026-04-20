# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

E2E test suite for **PICASso** — an OutSystems GRC application. Uses Playwright + TypeScript with Page Object Models, a SQLite-backed test scenario tracker, and Allure reporting.

## Instruction Files

- Use [.github/instructions/system-design-automation.instructions.md](.github/instructions/system-design-automation.instructions.md) as the design-system reference when creating or updating tracker UI, internal dashboards, generated HTML summaries, or requested documentation pages.

## Git Workflow

- Before creating a new branch from `main`, pull the latest changes from `main` first.
- After finishing the work on that branch, create a pull request.

---

## Commands

```bash
# Run all tests
npm test

# Run by browser project
npm run test:chromium
npm run test:smoke          # @smoke-tagged tests only

# Run with grep (ad-hoc)
npx playwright test --grep "SCENARIO-ID"

# Run a single named project
npx playwright test --project=doc-detail-offer

# Debug / inspect
npm run test:headed
npm run test:debug
npm run test:ui             # Playwright UI mode

# Type check / lint
npm run typecheck
npm run lint
npm run lint:fix

# Reports
npm run report:html         # Open playwright-report/
npm run report:allure       # Generate + open Allure report

# Cleanup artifacts
npm run clean

# Tracker CLI
npm run tracker:ui                          # Web UI at http://localhost:3005
npm run tracker:list -- --auto-state=pending
npm run tracker:list -- --feature-area=doc
npm run tracker:sync                        # Sync DB with spec files
npm run tracker:export
npx tsx scripts/export-scenarios.ts --workflow "Authentication"
npx tsx scripts/import-scenarios.ts --workflow "Authentication" --area auth --file docs/ai/test-cases/input/authentication-scenarios-for-import.xlsx --write
npm run tracker -- auto-state SCENARIO-ID automated
npm run tracker -- hold SCENARIO-ID
npm run tracker -- group SCENARIO-ID add smoke critical

# Code generation
npm run codegen
npm run codegen:doc
```

---

## Architecture

### Test Projects & Dependency Chain

The `playwright.config.ts` defines **named projects** for the DOC workflow chain — tests that must run in sequence because each step creates state consumed by the next:

```text
setup (auth/*.setup.ts)
  └→ doc-product-setup   (new-product-creation-digital-offer.spec.ts)
       └→ doc-initiation   (initiate-doc.spec.ts)
            └→ doc-state-setup   (doc-state.setup.ts → writes .doc-state.json)
                 ├→ doc-product-setup-extended   (product-setup-doc.spec.ts)
                 ├→ doc-initiation-extended      (doc-initiation-extended.spec.ts)
                 ├→ doc-my-docs-tab              (my-docs-tab.spec.ts)
                 ├→ doc-detail-header            (doc-detail.spec.ts)
                 ├→ doc-detail-offer             (doc-detail-offer.spec.ts)
                 ├→ doc-detail-roles             (doc-detail-roles.spec.ts)
                 ├→ doc-history                  (doc-history.spec.ts)
                 ├→ doc-release-linkage          (doc-release-linkage.spec.ts)
                 └→ doc-detail-its               (doc-detail-its.spec.ts)
                      └→ doc-control-detail       (control-detail.spec.ts)

# Standalone (no doc-state-setup dependency):
doc-detail-actions, doc-detail-risk-summary, doc-detail-certification, doc-lifecycle
```

The `chromium` and `smoke` projects run everything **except** the DOC lifecycle chain (those are covered by the named projects above).

**DOC state file**: `doc-state.setup.ts` writes `.doc-state.json` (project root) containing `{ docDetailsUrl }`. Read it in specs with `readDocState()` from `src/helpers/doc.helper.ts`.

### Page Object Model

All pages extend `BasePage` (`src/pages/base.page.ts`). `BasePage` requires an abstract `readonly url: string` property and provides `goto()`, `waitForOSLoad()`, and `expectUrl()`.

**OutSystems-specific waits** — always use these instead of arbitrary timeouts:

```typescript
import { waitForOSScreenLoad, navigateAndWait, waitForTableData, waitForPageReady } from '@helpers/wait.helper';

// After any action that triggers a screen reload
await waitForOSScreenLoad(page);

// Combined: click link → wait for OS overlay → wait for heading
await navigateAndWait(page, 'Link Name', 'Page Heading');

// After navigating to a table/list view
await waitForTableData(page);

// Wait for heading to confirm page is ready
await waitForPageReady(page, 'Heading Text');
```

### Path Aliases (tsconfig.json)

```text
@pages/*    → src/pages/*
@locators/* → src/locators/*
@fixtures/* → src/fixtures/*
@helpers/*  → src/helpers/*
@tracker/*  → src/tracker/*
@types/*    → src/types/*
```

### Fixtures (`src/fixtures/base.fixture.ts`)

Import from `../../src/fixtures` (not `@playwright/test`) to get custom fixtures:

```typescript
import { test, expect } from '../../src/fixtures';
// Available: userCredentials, getUserByRole, loginPage, landingPage,
//            newProductPage, docDetailsPage, controlDetailPage, releaseDetailPage
```

---

## Test Writing Pattern

Every test must include Allure metadata:

```typescript
import { test, expect } from '../../src/fixtures';
import * as allure from 'allure-js-commons';

test.describe('Feature @smoke', () => {
  test('AREA-ACTION-001 — human-readable description', async ({ docDetailsPage }) => {
    await allure.suite('Feature Area');
    await allure.severity('critical');   // critical | major | minor | trivial
    await allure.tag('smoke');
    await allure.description('AREA-ACTION-001: what is tested');

    await test.step('Step description', async () => { /* ... */ });
  });
});
```

Scenario IDs follow `AREA-ACTION-###` format and must match tracker IDs.

---

## Tracker Model

The SQLite tracker (`config/scenarios.db`) tracks two independent dimensions:

| Field | Values |
| --- | --- |
| `automation_state` | `pending` \| `automated` \| `on-hold` |
| `execution_status` | `passed` \| `not-executed` \| `skipped` \| `failed-defect` |
| `priority` | `P1` \| `P2` \| `P3` \| `Edge` |
| `feature_area` | `auth` \| `landing` \| `products` \| `releases` \| `doc` \| `reports` \| `backoffice` \| `integrations` \| `other` |

`on-hold` scenarios are auto-skipped during test runs.

### Tracker UI XLSX Workflow

The tracker UI now includes a `Scenarios` sidebar link that opens a modal with `Export` and `Import` tabs.

- Export is workflow-scoped and generates `.xlsx` files via `scripts/export-scenarios.ts`.
- Import is workflow-scoped and can use either an uploaded file or an existing file from `docs/ai/test-cases/input/`.
- UI workflow dropdowns show canonical numbering like `WF 1. Authentication`.
- When scripting exports/imports, prefer `--workflow` over area-only filtering because multiple workflows can share one `feature_area`.
- The tracker UI validates workflow names against the DB before running import/export scripts.

Relevant tracker UI endpoints:

- `GET /api/import-files`
- `POST /api/xlsx-export`
- `POST /api/xlsx-import`
- `POST /api/xlsx-upload`

---

## Environment

Copy `.env.example` → `.env`. Key variables:

```bash
TEST_ENV=qa          # qa | dev | ppr
BASE_URL=            # optional override
```

User credentials are gitignored at `config/users/<env>.users.ts`. Access via the `userCredentials` fixture or `getUserByRole('reviewer')`.
