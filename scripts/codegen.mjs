/**
 * codegen.mjs — Playwright codegen launcher with pre-authenticated session
 *
 * Logs in, saves auth state, then launches `playwright codegen` with the
 * saved storage state so you start recording from an authenticated session.
 *
 * Usage:
 *   node scripts/codegen.mjs                     # opens Landing Page
 *   node scripts/codegen.mjs --url "/DOCDetail?DOCId=77&ProductId=730"
 *   node scripts/codegen.mjs --url "https://qa..."  # full URL
 *
 * Or via npm:
 *   npm run codegen
 *   npm run codegen -- --url "/GRC_PICASso/ProductDetail?ProductId=1200"
 */
import { createRequire } from 'module';
import { execSync, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const { chromium } = require('../node_modules/playwright');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const BASE_URL    = 'https://qa.leap.schneider-electric.com';
const LOGIN_URL   = `${BASE_URL}/GRC_Th/Login`;
const LANDING_URL = `${BASE_URL}/GRC_PICASso/`;
const LOGIN       = 'PICEMDEPQL';
const PASSWORD    = 'outsystems';
const AUTH_STATE_FILE = path.join(projectRoot, '.auth-state.json');

async function waitForOSLoad(page, timeout = 30_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const loading = await page
      .locator('.feedback-message-loading, .os-loading-overlay, .content-placeholder.loading')
      .first().isVisible().catch(() => false);
    if (!loading) break;
    await page.waitForTimeout(400);
  }
}

async function saveAuthState() {
  console.log('🔐 Saving auth state...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForSelector('input[name="Username"], input[type="text"]', { timeout: 15_000 });

  const usernameField = page.locator('input[name="Username"], input[type="text"]').first();
  const passwordField = page.locator('input[name="Password"], input[type="password"]').first();
  await usernameField.fill(LOGIN);
  await passwordField.fill(PASSWORD);
  await page.getByRole('button', { name: /login/i }).first().click();
  await page.waitForURL(/GRC_PICASso/, { timeout: 60_000 }).catch(() => {});
  await waitForOSLoad(page);

  await context.storageState({ path: AUTH_STATE_FILE });
  await browser.close();
  console.log(`✅ Auth state saved to ${AUTH_STATE_FILE}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
(async () => {
  const args = process.argv.slice(2);
  const urlArgIdx = args.indexOf('--url');
  const targetPath = urlArgIdx !== -1 ? args[urlArgIdx + 1] : null;
  const targetUrl = targetPath
    ? (targetPath.startsWith('http') ? targetPath
        : `${BASE_URL}${targetPath.startsWith('/GRC') ? '' : '/GRC_PICASso'}${targetPath}`)
    : LANDING_URL;

  // Refresh auth state if missing or >4 hours old
  const authAge = fs.existsSync(AUTH_STATE_FILE)
    ? Date.now() - fs.statSync(AUTH_STATE_FILE).mtimeMs
    : Infinity;

  if (authAge > 4 * 60 * 60 * 1000) {
    await saveAuthState();
  } else {
    console.log(`🔑 Reusing auth state (${Math.round(authAge / 60_000)}m old)`);
  }

  console.log(`🎬 Launching codegen at: ${targetUrl}`);
  console.log('   Record your interactions in the browser window.');
  console.log('   Generated code will appear in the Playwright Inspector.');
  console.log('');

  const playwright = path.join(projectRoot, 'node_modules', '.bin', 'playwright');
  const result = spawnSync(
    playwright,
    ['codegen', '--load-storage', AUTH_STATE_FILE, targetUrl],
    { stdio: 'inherit', env: { ...process.env } },
  );

  if (result.status !== 0) {
    console.error('❌ codegen exited with code', result.status);
    process.exit(result.status ?? 1);
  }
})();
