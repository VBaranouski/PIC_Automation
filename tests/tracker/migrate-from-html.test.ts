import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { spawnSync } from 'child_process';

const ROOT = path.resolve(__dirname, '..', '..');
const FIXTURE = path.resolve(ROOT, 'tests', 'fixtures', 'automation-testing-plan.fixture.html');
const SCRATCH_DB = path.resolve(ROOT, 'tmp', 'migrate-test.db');

test.describe('migrate-from-html', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(() => {
    fs.mkdirSync(path.dirname(SCRATCH_DB), { recursive: true });
    if (fs.existsSync(SCRATCH_DB)) fs.unlinkSync(SCRATCH_DB);
  });

  test('dry-run exits 0 and writes nothing', () => {
    const res = spawnSync('npx', ['tsx', 'scripts/migrate-from-html.ts', '--html', FIXTURE, '--db', SCRATCH_DB, '--dry-run'], {
      cwd: ROOT,
      encoding: 'utf-8',
    });
    expect(res.status).toBe(0);
    expect(fs.existsSync(SCRATCH_DB)).toBe(false);
  });

  test('live run inserts all fixture scenarios', () => {
    const res = spawnSync('npx', ['tsx', 'scripts/migrate-from-html.ts', '--html', FIXTURE, '--db', SCRATCH_DB], {
      cwd: ROOT,
      encoding: 'utf-8',
    });
    expect(res.status).toBe(0);
    expect(fs.existsSync(SCRATCH_DB)).toBe(true);

    const Database = require('better-sqlite3');
    const db = new Database(SCRATCH_DB);
    const count = (db.prepare('SELECT COUNT(*) as c FROM scenarios').get() as { c: number }).c;
    expect(count).toBe(4);
    const loggedIn = db.prepare('SELECT * FROM scenarios WHERE id = ?').get('WF01-0001') as any;
    expect(loggedIn.title).toBe('Verify login page loads');
    expect(loggedIn.execution_status).toBe('passed');
    expect(loggedIn.automation_state).toBe('automated');

    // WF01-0003 → AUTH-LOGIN-999 (has execution_notes)
    const detail = db.prepare('SELECT * FROM scenario_details WHERE scenario_id = ?').get('WF01-0003') as any;
    expect(detail.execution_notes).toBe('Known flaky on QA');
    db.close();
  });

  test('refuses to run twice without --force', () => {
    const args = ['tsx', 'scripts/migrate-from-html.ts', '--html', FIXTURE, '--db', SCRATCH_DB];
    const first = spawnSync('npx', args, { cwd: ROOT, encoding: 'utf-8' });
    expect(first.status).toBe(0);
    const second = spawnSync('npx', args, { cwd: ROOT, encoding: 'utf-8' });
    expect(second.status).not.toBe(0);
    expect(second.stderr + second.stdout).toMatch(/already at schema v2|existing data|--force/i);
  });
});
