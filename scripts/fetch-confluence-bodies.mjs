#!/usr/bin/env node
/**
 * One-off: fetch body.view (HTML) for a small list of page-ids so we can distill
 * into Tier-2 knowledge files. Writes raw text (tags stripped) to stdout.
 *
 * Usage: node scripts/fetch-confluence-bodies.mjs <pageId> [pageId ...]
 */
import 'dotenv/config';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const base = process.env.CONFLUENCE_BASE_URL;
const token = process.env.CONFLUENCE_PERSONAL_TOKEN;
if (!base || !token) { console.error('Missing CONFLUENCE_BASE_URL or CONFLUENCE_PERSONAL_TOKEN'); process.exit(1); }

const ids = process.argv.slice(2);
if (ids.length === 0) { console.error('No page ids'); process.exit(1); }

function stripHtml(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<\/(p|div|li|h[1-6]|tr|td|th|br)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
}

for (const id of ids) {
  const url = `${base}/rest/api/content/${id}?expand=body.view,version`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } });
  if (!res.ok) { console.error(`${id}: HTTP ${res.status}`); continue; }
  const json = await res.json();
  console.log(`\n===== ${id} | ${json.title} | v${json.version?.number} =====\n`);
  console.log(stripHtml(json.body?.view?.value || ''));
}
