#!/usr/bin/env npx tsx
/**
 * Knowledge Sync Helper
 *
 * Compares current Confluence page versions against
 * docs/ai/knowledge-base/.sync-state.json and prints a diff.
 * Does NOT auto-update knowledge files — human stays in the loop.
 *
 * Usage:
 *   npx tsx scripts/sync-knowledge.ts --area releases
 *   npx tsx scripts/sync-knowledge.ts --page-ids 576736204,705565013
 */

import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '..');
const SYNC_STATE = path.join(ROOT, 'docs', 'ai', 'knowledge-base', '.sync-state.json');
const REGISTRY_DIR = path.join(ROOT, 'docs', 'ai', 'knowledge-base', 'feature-registry');

interface Args {
  area: string | null;
  pageIds: string[];
}

function parseArgs(argv: string[]): Args {
  const args: Args = { area: null, pageIds: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--area') args.area = argv[++i];
    else if (a === '--page-ids') args.pageIds = (argv[++i] ?? '').split(',').filter(Boolean);
  }
  return args;
}

function collectPageIdsFromRegistry(area: string): string[] {
  const file = path.join(REGISTRY_DIR, `${area}.md`);
  if (!fs.existsSync(file)) {
    console.error(`No registry file for area "${area}" at ${file}`);
    process.exit(2);
  }
  const text = fs.readFileSync(file, 'utf8');
  const ids = new Set<string>();
  // Confluence page-id column is the 6th column; extract any standalone numeric tokens.
  for (const line of text.split('\n')) {
    if (!line.startsWith('|')) continue;
    const cells = line.split('|').map((c) => c.trim());
    // column index after leading '|' split: 0 empty, 1 Feature ID, ..., 6 Confluence Page IDs
    const cell = cells[6] ?? '';
    for (const m of cell.matchAll(/\b\d{6,}\b/g)) ids.add(m[0]);
  }
  return [...ids];
}

async function fetchPageVersion(id: string): Promise<number | null> {
  const base = process.env.CONFLUENCE_BASE_URL ?? process.env.CONFLUENCE_URL ?? '';
  const token =
    process.env.CONFLUENCE_PERSONAL_TOKEN ?? process.env.CONFLUENCE_API_TOKEN ?? '';
  if (!base || !token) {
    console.error('Missing CONFLUENCE_BASE_URL / CONFLUENCE_PERSONAL_TOKEN.');
    process.exit(2);
  }
  const res = await fetch(`${base}/rest/api/content/${id}?expand=version`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
  if (!res.ok) {
    console.error(`GET ${id} → ${res.status}`);
    return null;
  }
  const body = (await res.json()) as any;
  return Number(body?.version?.number ?? 0);
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const state = fs.existsSync(SYNC_STATE)
    ? JSON.parse(fs.readFileSync(SYNC_STATE, 'utf8'))
    : { confluence: {} };
  state.confluence ??= {};

  const ids =
    args.pageIds.length > 0
      ? args.pageIds
      : args.area
        ? collectPageIdsFromRegistry(args.area)
        : [];

  if (ids.length === 0) {
    console.error(
      'No page ids to check. Specify --area <area> (registry must list ids) or --page-ids <csv>.',
    );
    process.exit(2);
  }

  let changed = 0;
  for (const id of ids) {
    const current = await fetchPageVersion(id);
    if (current === null) continue;
    const known = Number(state.confluence?.[id]?.version ?? 0);
    const marker = current !== known ? 'CHANGED' : 'ok';
    if (current !== known) changed += 1;
    console.log(`[${marker}] ${id}  known=${known}  current=${current}`);
  }
  console.log(`\n${changed}/${ids.length} pages changed since last index.`);
  if (changed > 0) {
    console.log(
      'Run `npm run index:confluence -- --page-ids <ids>` and update the matching knowledge files.',
    );
  }
}

main();
