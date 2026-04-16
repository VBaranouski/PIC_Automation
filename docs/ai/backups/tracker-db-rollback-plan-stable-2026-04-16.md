# Stable Tracker DB Rollback Plan

Status: Stable version

Version label: tracker-db-stable-2026-04-16

Created on: 2026-04-16

Purpose: Restore the tracker database to the last known-good state before the next scenario porting and bulk update pass.

## Stable Sources

- Active source DB: [config/scenarios.db](../../../config/scenarios.db)
- DB path definition: [src/tracker/db.ts](../../../src/tracker/db.ts)
- Stable SQLite snapshot: [tracker-db-stable-2026-04-16.sqlite](tracker-db-stable-2026-04-16.sqlite)
- Stable JSON export: [tracker-scenarios-stable-2026-04-16.json](tracker-scenarios-stable-2026-04-16.json)
- Previous JSON backup: [tracker-scenarios-backup-2026-04-15.json](tracker-scenarios-backup-2026-04-15.json)

## Rollback Rules

- Use the SQLite snapshot for a full rollback.
- Treat the JSON export as an audit/reference snapshot, not the primary restore mechanism.
- Stop the tracker UI before overwriting the live DB.
- Remove WAL sidecar files after restore so SQLite reopens cleanly from the stable snapshot.

## Full Rollback Procedure

1. Stop the tracker UI.

```bash
npm run tracker:ui:stop
```

2. Create an emergency snapshot of the current live DB before restoring the stable version.

```bash
cp config/scenarios.db docs/ai/backups/tracker-db-pre-rollback-$(date +%F-%H%M%S).sqlite
```

3. Restore the stable snapshot over the live DB.

```bash
cp docs/ai/backups/tracker-db-stable-2026-04-16.sqlite config/scenarios.db
rm -f config/scenarios.db-wal config/scenarios.db-shm
```

4. Restart the tracker UI.

```bash
npm run tracker:ui
```

5. Verify the restored dataset in the tracker UI or with a CLI export.

```bash
npm run tracker -- report
npm run tracker -- export -o docs/ai/backups/tracker-scenarios-post-rollback-check.json
```

## JSON Recovery Notes

The JSON file is preserved so scenario content can be inspected or compared outside SQLite. The existing tracker import command skips already-existing IDs, so it is not a full replacement strategy for rollback. If a full rollback is required, restore the SQLite snapshot first.

## Scope Covered By This Stable Version

- Tracker DB state before the next mass porting of test scenarios
- Existing scenario metadata, workflow assignments, groups, and scenario details
- Latest stable export count captured on 2026-04-16: 1313 scenarios