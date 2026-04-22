#!/usr/bin/env npx tsx
/**
 * Confluence Index Generator
 *
 * Fetches metadata (title, version, updated) for pages in the PICASso Confluence
 * space and writes docs/ai/knowledge-base/corpus/confluence-index.md.
 *
 * Auth: uses CONFLUENCE_BASE_URL + CONFLUENCE_PERSONAL_TOKEN (Bearer PAT) from
 * the environment (.env) — same variables consumed by the existing MCP server.
 *
 * Usage:
 *   npx tsx scripts/index-confluence.ts --space PIC
 *   npx tsx scripts/index-confluence.ts --space PIC --limit 500
 *   npx tsx scripts/index-confluence.ts --page-ids 576736204,705565013
 *   npx tsx scripts/index-confluence.ts --root-page 400856947
 *
 * Design rule: metadata only — page body is NEVER written to the index.
 */

import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.join(
  ROOT,
  'docs',
  'ai',
  'knowledge-base',
  'corpus',
  'confluence-index.md',
);
const SYNC_STATE = path.join(ROOT, 'docs', 'ai', 'knowledge-base', '.sync-state.json');

interface Args {
  space: string | null;
  limit: number;
  pageIds: string[];
  rootPage: string | null;
  dryRun: boolean;
}

interface PageMeta {
  id: string;
  title: string;
  space: string;
  version: number;
  updated: string;
  parentId: string | null;
  depth: number;
}

function parseArgs(argv: string[]): Args {
  const args: Args = {
    space: null,
    limit: 2000,
    pageIds: [],
    rootPage: null,
    dryRun: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--space') args.space = argv[++i];
    else if (a === '--limit') args.limit = Number(argv[++i]);
    else if (a === '--page-ids') args.pageIds = (argv[++i] ?? '').split(',').filter(Boolean);
    else if (a === '--root-page') args.rootPage = argv[++i];
    else if (a === '--dry-run') args.dryRun = true;
  }
  return args;
}

async function fetchJson(url: string, token: string): Promise<any> {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    // Node 18+ fetch uses global agent; the MCP server runs with CONFLUENCE_SSL_VERIFY=false
    // for the internal cert, but we keep this strict here — if it fails, set
    // NODE_TLS_REJECT_UNAUTHORIZED=0 explicitly on the command line.
  });
  if (!res.ok) {
    throw new Error(`GET ${url} → ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function fetchPageMeta(
  base: string,
  token: string,
  id: string,
  depth = 0,
  parentId: string | null = null,
): Promise<PageMeta> {
  const url = `${base}/rest/api/content/${id}?expand=version,space,ancestors`;
  const body = (await fetchJson(url, token)) as any;
  const ancestors = Array.isArray(body?.ancestors) ? body.ancestors : [];
  const computedParent =
    parentId ?? (ancestors.length ? String(ancestors[ancestors.length - 1]?.id ?? '') : null);
  return {
    id: String(body.id),
    title: String(body.title ?? ''),
    space: String(body?.space?.key ?? ''),
    version: Number(body?.version?.number ?? 0),
    updated: String(body?.version?.when ?? ''),
    parentId: computedParent || null,
    depth,
  };
}

async function fetchChildPages(
  base: string,
  token: string,
  parentId: string,
): Promise<any[]> {
  const out: any[] = [];
  let start = 0;
  const pageSize = 100;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const url = `${base}/rest/api/content/${parentId}/child/page?limit=${pageSize}&start=${start}&expand=version,space`;
    const body = (await fetchJson(url, token)) as any;
    const results = Array.isArray(body?.results) ? body.results : [];
    out.push(...results);
    if (results.length < pageSize) break;
    start += pageSize;
  }
  return out;
}

async function fetchPageTree(
  base: string,
  token: string,
  rootId: string,
  limit: number,
): Promise<PageMeta[]> {
  const collected: PageMeta[] = [];
  const rootMeta = await fetchPageMeta(base, token, rootId, 0, null);
  collected.push(rootMeta);

  const queue: { id: string; depth: number }[] = [{ id: rootId, depth: 0 }];
  const seen = new Set<string>([rootId]);

  while (queue.length > 0 && collected.length < limit) {
    const { id: parentId, depth } = queue.shift()!;
    let children: any[] = [];
    try {
      children = await fetchChildPages(base, token, parentId);
    } catch (err) {
      console.error(`  child fetch failed for ${parentId}: ${(err as Error).message}`);
      continue;
    }
    for (const c of children) {
      const cid = String(c.id);
      if (seen.has(cid)) continue;
      seen.add(cid);
      collected.push({
        id: cid,
        title: String(c.title ?? ''),
        space: String(c?.space?.key ?? rootMeta.space),
        version: Number(c?.version?.number ?? 0),
        updated: String(c?.version?.when ?? ''),
        parentId,
        depth: depth + 1,
      });
      queue.push({ id: cid, depth: depth + 1 });
      if (collected.length >= limit) break;
    }
    if (collected.length % 50 === 0) {
      console.log(`  ...${collected.length} pages traversed`);
    }
  }
  return collected;
}

async function fetchSpacePages(
  base: string,
  token: string,
  space: string,
  limit: number,
): Promise<PageMeta[]> {
  const out: PageMeta[] = [];
  let start = 0;
  const pageSize = Math.min(100, limit);
  while (out.length < limit) {
    const url = `${base}/rest/api/content?spaceKey=${encodeURIComponent(space)}&type=page&limit=${pageSize}&start=${start}&expand=version,space`;
    const body = (await fetchJson(url, token)) as any;
    const results = Array.isArray(body?.results) ? body.results : [];
    if (results.length === 0) break;
    for (const p of results) {
      out.push({
        id: String(p.id),
        title: String(p.title ?? ''),
        space: String(p?.space?.key ?? space),
        version: Number(p?.version?.number ?? 0),
        updated: String(p?.version?.when ?? ''),
        parentId: null,
        depth: 0,
      });
      if (out.length >= limit) break;
    }
    if (results.length < pageSize) break;
    start += pageSize;
  }
  return out;
}

function writeIndex(pages: PageMeta[], rootPage: string | null): void {
  pages.sort((a, b) => {
    if (rootPage) return a.depth - b.depth || a.title.localeCompare(b.title);
    return a.space.localeCompare(b.space) || a.title.localeCompare(b.title);
  });
  const out: string[] = [];
  out.push('# Confluence Index');
  out.push('');
  out.push('> Generated by `scripts/index-confluence.ts`. Do not edit by hand.');
  out.push(
    '> Metadata only. Fetch content via `confluence_get_page(id=…)` through Atlassian MCP.',
  );
  if (rootPage) {
    out.push(`> Scope: page-tree rooted at **${rootPage}** (descendants included).`);
  }
  out.push('');
  out.push('| Page ID | Title | Space | Version | Updated | Depth | Parent | Owning Area |');
  out.push('|---|---|---|---|---|---|---|---|');
  for (const p of pages) {
    const title = p.title.replace(/\|/g, '\\|');
    const indent = '— '.repeat(p.depth);
    out.push(
      `| ${p.id} | ${indent}${title} | ${p.space} | ${p.version} | ${p.updated} | ${p.depth} | ${p.parentId ?? ''} | — |`,
    );
  }
  out.push('');
  fs.writeFileSync(OUTPUT, out.join('\n'), 'utf8');
}

function updateSyncState(pages: PageMeta[]): void {
  if (!fs.existsSync(SYNC_STATE)) return;
  const state = JSON.parse(fs.readFileSync(SYNC_STATE, 'utf8'));
  state.confluence ??= {};
  for (const p of pages) {
    state.confluence[p.id] = { title: p.title, version: p.version, updated: p.updated };
  }
  state.confluenceLastIndexed = new Date().toISOString();
  fs.writeFileSync(SYNC_STATE, JSON.stringify(state, null, 2) + '\n', 'utf8');
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const base = process.env.CONFLUENCE_BASE_URL ?? process.env.CONFLUENCE_URL ?? '';
  const token =
    process.env.CONFLUENCE_PERSONAL_TOKEN ?? process.env.CONFLUENCE_API_TOKEN ?? '';

  if (!base || !token) {
    console.error(
      'Missing CONFLUENCE_BASE_URL / CONFLUENCE_PERSONAL_TOKEN. Source your .env before running.',
    );
    process.exit(2);
  }

  let pages: PageMeta[] = [];
  try {
    if (args.pageIds.length > 0) {
      for (const id of args.pageIds) pages.push(await fetchPageMeta(base, token, id));
    } else if (args.rootPage) {
      console.log(`Walking tree rooted at page ${args.rootPage} (limit=${args.limit})...`);
      pages = await fetchPageTree(base, token, args.rootPage, args.limit);
    } else if (args.space) {
      pages = await fetchSpacePages(base, token, args.space, args.limit);
    } else {
      console.error('Specify --root-page <id>, --space <KEY>, or --page-ids <csv>.');
      process.exit(2);
    }
  } catch (err) {
    console.error(`Confluence fetch failed: ${(err as Error).message}`);
    process.exit(1);
  }

  if (args.dryRun) {
    console.log(`Would write ${pages.length} rows to ${OUTPUT}`);
    return;
  }

  writeIndex(pages, args.rootPage);
  updateSyncState(pages);
  console.log(`Wrote ${OUTPUT} — ${pages.length} pages indexed.`);
}

main();
