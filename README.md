# PICASso Automation

Playwright + TypeScript E2E test automation suite for the **PICASso** OutSystems application.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install --with-deps

# 3. Create your environment file
cp .env.example .env
# Edit .env with your target environment settings

# 4. Add user credentials
# Create config/users/qa.users.ts (see config/users/user.types.ts for the shape)

# 5. Run tests
npm test                        # all projects
npm run test:chromium           # chromium only
npm run test:smoke              # smoke suite
```

## Project Structure

```text
├── src/
│   ├── fixtures/               # Playwright test fixtures (extended test object)
│   ├── helpers/                # Utility helpers (wait, data, doc, API)
│   ├── locators/               # Locator factory functions per feature area
│   ├── pages/                  # Page Object Models (extend BasePage)
│   ├── reporters/              # Custom Playwright reporters
│   └── types/                  # TypeScript type definitions
├── tests/
│   ├── auth/                   # Authentication tests
│   ├── doc/                    # DOC lifecycle, details, history, actions, risk, certification
│   ├── landing/                # Landing page and My DOCs tab
│   ├── products/               # Product CRUD, details, history, releases
│   └── releases/               # Release management
├── config/
│   ├── environments/           # Environment configs (qa, dev, ppr)
│   └── users/                  # User credential files (gitignored)
├── specs/                      # Human-readable test specifications (Markdown)
├── docs/ai/                    # Automation testing plans, coverage matrices, app maps
├── .github/
│   ├── instructions/           # Copilot coding instructions
│   ├── prompts/                # Copilot prompt templates
│   └── workflows/              # CI — Playwright on GitHub Actions
├── playwright.config.ts        # Playwright configuration (15+ projects)
├── tsconfig.json               # TypeScript config with path aliases
└── package.json
```

## Available Scripts

| Command | Description |
| ------- | ----------- |
| `npm test` | Run all Playwright tests |
| `npm run test:chromium` | Run chromium project only |
| `npm run test:smoke` | Run smoke-tagged tests |
| `npm run test:headed` | Run tests in headed mode |
| `npm run test:debug` | Run tests with Playwright Inspector |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run report:html` | Open HTML report |
| `npm run report:allure` | Generate and open Allure report |
| `npm run typecheck` | TypeScript type checking |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier formatting |
| `npm run tracker:ui` | Start the tracker web UI at `http://localhost:3005` |
| `npm run tracker:ui:stop` | Stop a running tracker UI process |
| `npm run tracker -- sync` | Reconcile tracker `spec_file` mappings against current specs |
| `npm run tracker -- sync --import-missing` | Reconcile mappings and create missing tracker rows from spec metadata |
| `npm run tracker:export` | Export tracker data to `config/scenarios-export.json` |

## Tracker UI Capabilities

The tracker UI includes a `Scenarios` sidebar entry with a tabbed XLSX modal for workflow-scoped scenario management.

- `Export` tab: exports scenarios for the selected workflow as an `.xlsx` file.
- `Import` tab: imports scenarios for the selected workflow from an existing file in `docs/ai/test-cases/input/` or from a newly uploaded `.xlsx` file.
- Workflow selectors use canonical numbering in the UI, for example `WF 1. Authentication`, `WF 2. Landing Page & Home Navigation`.
- Export/import is scoped by `workflow`, not just `feature_area`, which prevents cross-workflow leakage for shared areas like `other`.

The tracker UI backend exposes these endpoints:

- `GET /api/import-files`
- `POST /api/xlsx-export`
- `POST /api/xlsx-import`
- `POST /api/xlsx-upload`

## Tracker Workflow

The tracker is the current operational source for scenario execution status and spec-file linking.

```bash
# start / stop the tracker UI
npm run tracker:ui
npm run tracker:ui:stop

# refresh tracker mappings after spec changes or file splits
npm run tracker -- sync

# import new scenario IDs that already exist in allure.description(...) but are missing in the DB
npm run tracker -- sync --import-missing

# export scenarios for a specific workflow
npx tsx scripts/export-scenarios.ts --workflow "Authentication"

# import scenarios for a specific workflow from an xlsx file
npx tsx scripts/import-scenarios.ts --workflow "Authentication" --area auth --file docs/ai/test-cases/input/authentication-scenarios-for-import.xlsx --write

# export the normalized tracker dataset
npm run tracker:export
```

Use `sync --import-missing` after splitting specs or introducing new canonical scenario IDs in tests so the UI can display and run them immediately.

Use the workflow-scoped XLSX commands when multiple workflows share the same `feature_area`; this is the safe default for `Smoke / Seed`, `Maintenance Mode`, and similar cases.

## Test Projects (Playwright Config)

The Playwright config defines **15+ projects** with dependency chains for the DOC lifecycle:

```text
setup → doc-product-setup → doc-initiation → doc-state-setup → doc-detail-*
```

Standalone projects: `chromium`, `smoke`, `doc-detail-actions`, `doc-lifecycle`, etc.

## Environment Configuration

| Environment | Config File |
| ----------- | ----------- |
| QA | `config/environments/qa.ts` |
| Dev | `config/environments/dev.ts` |
| PPR | `config/environments/ppr.ts` |

Set `TEST_ENV=qa` (or `dev`/`ppr`) in `.env` or as an environment variable.

## Documentation

- [Automation Testing Plan](docs/ai/automation-testing-plan.html) — interactive test plan with coverage status
- [Coverage Matrix](docs/ai/current-automation-coverage-matrix.md) — current automation coverage
- [Application Map](docs/ai/application-map.html) — PICASso application structure
- [Pipeline](docs/ai/pipeline.md) — automation pipeline description
- [Tracker Migration Completion](docs/ai/tracker-migration-completion.md) — compact completion note for plan-to-tracker migration
- [Stable Tracker DB Rollback Plan](docs/ai/backups/tracker-db-rollback-plan-stable-2026-04-16.md) — restore point and rollback steps before scenario porting updates

## CI/CD

GitHub Actions workflow (`.github/workflows/playwright.yml`) runs on:

- Push/PR to `main` or `develop` branches
- Manual dispatch with environment, role, and test filter selection
