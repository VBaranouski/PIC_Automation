/**
 * Reverse migration: undo the WF ID rename by applying the reverse mapping.
 */
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.resolve(__dirname, '..', 'config', 'scenarios.db');
const MAPPING = path.resolve(__dirname, '..', 'tmp', 'id-rename-mapping-reverse.json');

const renames: Array<{ oldId: string; newId: string }> = JSON.parse(
  fs.readFileSync(MAPPING, 'utf-8')
);

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = OFF');

const update = db.prepare("UPDATE scenarios SET id = ?, updated_at = datetime('now') WHERE id = ?");
const updateGroups = db.prepare('UPDATE scenario_groups SET scenario_id = ? WHERE scenario_id = ?');
const updateDetails = db.prepare('UPDATE scenario_details SET scenario_id = ? WHERE scenario_id = ?');

const transaction = db.transaction(() => {
  const tmpPrefix = '__REVERT_TMP__';

  for (let i = 0; i < renames.length; i++) {
    const tmp = `${tmpPrefix}${i}`;
    const old = renames[i].oldId;
    update.run(tmp, old);
    updateGroups.run(tmp, old);
    updateDetails.run(tmp, old);
  }

  for (let i = 0; i < renames.length; i++) {
    const tmp = `${tmpPrefix}${i}`;
    const newId = renames[i].newId;
    update.run(newId, tmp);
    updateGroups.run(newId, tmp);
    updateDetails.run(newId, tmp);
  }

  return renames.length;
});

const count = transaction();
console.log(`Reverted ${count} scenarios.`);

const remaining = (db.prepare("SELECT COUNT(*) as cnt FROM scenarios WHERE id GLOB 'WF[0-9][0-9]-*'").get() as any).cnt;
console.log(`WF##-#### IDs restored: ${remaining}`);

db.pragma('foreign_keys = ON');
const fkCheck = db.pragma('foreign_key_check') as any[];
if (fkCheck.length > 0) {
  console.error(`Foreign key violations: ${fkCheck.length}`);
} else {
  console.log('Foreign key integrity OK.');
}

db.close();
