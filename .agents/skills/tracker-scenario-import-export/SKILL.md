---
name: tracker-scenario-import-export
description: Import test scenarios from an xlsx file into the PICASso tracker DB, or export scenarios from the DB to xlsx, by feature area. Use this skill whenever the user asks to import, export, sync, or update test scenarios, test cases, or tracker data — from any of the feature areas (auth, landing, products, releases, doc, reports, backoffice, integrations, other). Also triggers for phrases like "import test cases", "export scenarios", "update DB from Excel", "sync tracker", "upload scenarios", "download scenarios to Excel", or when a user attaches or mentions an xlsx file alongside tracker/scenario context.
---

# Tracker Scenario Import / Export

Two-script workflow for keeping the tracker SQLite DB (`config/scenarios.db`) in sync with xlsx files.

- **Export** — dump scenarios for a feature area to an xlsx for editing/review
- **Import** — read an edited xlsx back into the DB with a safe dry-run → write flow

Both scripts live at:
- `scripts/export-scenarios.ts`
- `scripts/import-scenarios.ts`

---

## Feature Areas

Valid values for `--area`:

| Value | Description |
|---|---|
| `auth` | Login, SSO, forgot-password |
| `landing` | Landing page, tabs, filters |
| `products` | Product creation, details, history |
| `releases` | Release management, details, cloning |
| `doc` | Digital Offer Certification lifecycle |
| `reports` | Reports & dashboards |
| `backoffice` | Back-office admin |
| `integrations` | External integrations |
| `other` | Cross-cutting / uncategorised |

---

## Export Workflow

Use when the user wants to export scenarios from the DB to xlsx — for editing, review, or sharing.

### Step 1 — Identify the area

Ask or infer from context which feature area to export. If the user says "export auth" or "export scenarios for authentication", use `--area auth`.

### Step 2 — Run export

```bash
npx tsx scripts/export-scenarios.ts --area <area>
```

Optional flag:
```bash
npx tsx scripts/export-scenarios.ts --area <area> --out /custom/path/output.xlsx
```

Default output: `docs/ai/test-cases/output/<area>-scenarios-export.xlsx`

### Step 3 — Report

Tell the user:
- Path to the exported file
- Row count
- Any summary stats (automation states, priorities)

---

## Import Workflow

Use when the user wants to import an xlsx into the DB. **Always dry-run first** — never skip this step, even if the user says "just write it". The dry-run is fast and shows exactly what will change.

### Step 1 — Identify the area and file

The user will either:
- Attach an xlsx file → save it to `docs/ai/test-cases/input/<area>-scenarios-for-import.xlsx`
- Reference an existing file already in `docs/ai/test-cases/input/`

Infer `--area` from the file name or user context (e.g., `auth-scenarios-for-import.xlsx` → `--area auth`).

### Step 2 — Inspect the file (optional but useful)

If anything is unclear about the file structure, quickly check sheet names and row count before running:

```bash
npx tsx -e "
import * as XLSX from 'xlsx';
const wb = XLSX.readFile('docs/ai/test-cases/input/<area>-scenarios-for-import.xlsx');
console.log('Sheets:', wb.SheetNames);
const ws = wb.Sheets[wb.SheetNames[0]];
const aoa = XLSX.utils.sheet_to_json(ws, { header: 1 }) as unknown[][];
console.log('Rows:', aoa.length - 1);
"
```

### Step 3 — Dry-run

```bash
npx tsx scripts/import-scenarios.ts --area <area>
```

With a custom file path:
```bash
npx tsx scripts/import-scenarios.ts --area <area> --file docs/ai/test-cases/input/my-file.xlsx
```

Read the output carefully:
- `[DRY-RUN] CONTENT UPDATE` — title/steps/expected results changed → will set `automation_state = 'updated'` + `execution_status = 'not-executed'`
- `[DRY-RUN] METADATA UPDATE` — priority/workflow/spec file changed → automation state preserved
- `[DRY-RUN] INSERT` — new scenario → will be inserted as `pending` / `not-executed`
- `[DRY-RUN] FLAG ON-HOLD` — scenario exists in DB but missing from xlsx → will be flagged `on-hold`

If validation errors appear, report them to the user and do not proceed with `--write`.

### Step 4 — Confirm with user

Show the dry-run summary counts (content updated, metadata updated, inserted, flagged on-hold, unchanged, skipped). Ask the user to confirm before writing — especially if there are unexpected `FLAG ON-HOLD` entries.

Use `--no-remove` if the xlsx is a partial update and the user does **not** want missing scenarios flagged `on-hold`:

```bash
npx tsx scripts/import-scenarios.ts --area <area> --no-remove
```

### Step 5 — Write

```bash
npx tsx scripts/import-scenarios.ts --area <area> --write
```

Verify the summary matches what was shown in the dry-run. Report the result to the user.

---

## State Change Rules (how the import updates the DB)

| Change type | `automation_state` result | `execution_status` result |
|---|---|---|
| Title / steps / expected results changed | `updated` | `not-executed` |
| Priority / workflow / spec file / groups changed | preserved | preserved |
| New row (ID not in DB) | `pending` | `not-executed` |
| Row in DB but absent from xlsx | `on-hold` (unless `--no-remove`) | preserved |
| No change | unchanged | unchanged |

The `automation_state` column in the xlsx is **not used** to set the DB state on import — the DB state is computed from the diff. This prevents accidental overwrites.

---

## File Layout

```
docs/ai/test-cases/
  input/      ← place xlsx files here for import
    <area>-scenarios-for-import.xlsx
  output/     ← export writes here
    <area>-scenarios-export.xlsx
```

Sheet name convention (auto-detected by import script):
- `Auth Scenarios`, `Landing Scenarios`, `Doc Scenarios`, etc.
- Falls back to first non-Summary sheet if exact name not found.

Column order (must match between export and import):

| # | Column |
|---|---|
| 0 | ID |
| 1 | Priority |
| 2 | Automation State |
| 3 | Execution Status |
| 4 | Feature Area |
| 5 | Workflow |
| 6 | Subsection |
| 7 | Groups / Tags |
| 8 | Title |
| 9 | Description |
| 10 | Test Steps |
| 11 | Expected Results |
| 12 | Execution Notes |
| 13 | Spec File |
| 14 | Merged Into |
| 15 | Created At (read-only) |
| 16 | Updated At (read-only) |

---

## Common Scenarios

**"Export auth scenarios for review"**
```bash
npx tsx scripts/export-scenarios.ts --area auth
```

**"Import the updated auth xlsx"**
```bash
# dry-run
npx tsx scripts/import-scenarios.ts --area auth
# write after confirming
npx tsx scripts/import-scenarios.ts --area auth --write
```

**"Import without flagging missing rows as on-hold"**
```bash
npx tsx scripts/import-scenarios.ts --area doc --no-remove --write
```

**"Export to a custom location"**
```bash
npx tsx scripts/export-scenarios.ts --area releases --out ~/Desktop/releases-review.xlsx
```

---

## Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| `Sheet "X Scenarios" not found` | Sheet name differs from convention | Import uses first non-Summary sheet; rename the sheet or pass `--file` |
| `Invalid feature_area: ""` | Empty Feature Area column in xlsx | Fill in the Feature Area column for all rows |
| `Invalid priority: ""` | Empty Priority column | Priority must be P1, P2, P3, or Edge |
| Unexpected `FLAG ON-HOLD` on partial import | xlsx only covers a subset of the area | Use `--no-remove` flag |
| Changes not showing after write | Stale tracker UI server | Restart `npm run tracker:ui` |
