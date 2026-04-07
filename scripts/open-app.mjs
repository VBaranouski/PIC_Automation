/**
 * open-app.mjs — Interactive browser session for visual inspection
 *
 * Launches a headed Chromium window, logs in with the QA process_quality_leader
 * account, and leaves the browser open for manual exploration, locator inspection,
 * and element identification.
 *
 * Usage:
 *   node scripts/open-app.mjs                    # opens Landing Page
 *   node scripts/open-app.mjs --url "/DOCDetail?DOCId=77&ProductId=730"
 *   node scripts/open-app.mjs --url "full-url"   # opens specific URL after login
 *   node scripts/open-app.mjs --save-auth        # saves auth state to .auth-state.json
 *
 * After launching, the window stays open — press Ctrl+C in this terminal to close.
 * Use Playwright Inspector or DevTools to inspect elements.
 */
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const { chromium } = require('../node_modules/playwright');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// ── Config ────────────────────────────────────────────────────────────────────
const BASE_URL   = 'https://qa.leap.schneider-electric.com';
const LOGIN_URL  = `${BASE_URL}/GRC_Th/Login`;
const LANDING_URL = `${BASE_URL}/GRC_PICASso/`;
const LOGIN      = 'PICEMDEPQL';
const PASSWORD   = 'outsystems';
const AUTH_STATE_FILE = path.join(projectRoot, '.auth-state.json');

// Parse CLI args
const args = process.argv.slice(2);
const urlArgIdx = args.indexOf('--url');
const targetPath = urlArgIdx !== -1 ? args[urlArgIdx + 1] : null;
const saveAuth = args.includes('--save-auth');

const targetUrl = targetPath
  ? (targetPath.startsWith('http') ? targetPath : `${BASE_URL}${targetPath.startsWith('/') ? '' : '/GRC_PICASso/'}${targetPath}`)
  : LANDING_URL;

// ── Wait for OutSystems load overlay ─────────────────────────────────────────
async function waitForOSLoad(page, timeout = 30_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const loading = await page
      .locator('.feedback-message-loading, .os-loading-overlay, .content-placeholder.loading')
      .first()
      .isVisible()
      .catch(() => false);
    if (!loading) break;
    await page.waitForTimeout(400);
  }
  await page.waitForFunction(
    () => document.querySelectorAll('.content-placeholder.loading').length === 0,
    { timeout: 20_000 },
  ).catch(() => {});
}

// ── Main ──────────────────────────────────────────────────────────────────────
(async () => {
  console.log('🚀 Launching headed Chromium for visual inspection...');

  // Try to load existing auth state for faster startup
  const authStateExists = fs.existsSync(AUTH_STATE_FILE);
  const storageState = authStateExists ? AUTH_STATE_FILE : undefined;
  if (authStateExists) {
    console.log(`🔑 Reusing saved auth state from ${AUTH_STATE_FILE}`);
  }

  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
    slowMo: 0,
  });

  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 1440, height: 900 },
    ...(storageState ? { storageState } : {}),
  });

  const page = await context.newPage();

  // ── Login ──────────────────────────────────────────────────────────────────
  if (!authStateExists) {
    console.log('🔐 Logging in...');
    await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });

    // Wait for login form
    await page.waitForSelector('input[name="Username"], input[type="text"]', { timeout: 15_000 });

    // Fill credentials
    const usernameField = page.locator('input[name="Username"], input[type="text"]').first();
    const passwordField = page.locator('input[name="Password"], input[type="password"]').first();
    await usernameField.fill(LOGIN);
    await passwordField.fill(PASSWORD);

    // Click Login
    const loginBtn = page.getByRole('button', { name: /login/i }).first();
    await loginBtn.click();

    // Wait for redirect to app
    await page.waitForURL(/GRC_PICASso/, { timeout: 60_000 }).catch(async () => {
      // Sometimes redirects to GRC_Th first — wait again
      await page.waitForURL(/GRC_PICASso|GRC_Th\/Main/, { timeout: 30_000 });
      if (!page.url().includes('GRC_PICASso')) {
        await page.goto(LANDING_URL, { waitUntil: 'domcontentloaded' });
      }
    });

    await waitForOSLoad(page);
    console.log(`✅ Logged in. Current URL: ${page.url()}`);

    if (saveAuth) {
      await context.storageState({ path: AUTH_STATE_FILE });
      console.log(`💾 Auth state saved to ${AUTH_STATE_FILE}`);
    }
  }

  // ── Navigate to target ─────────────────────────────────────────────────────
  if (!page.url().includes(targetUrl.replace(BASE_URL, ''))) {
    console.log(`🌐 Navigating to: ${targetUrl}`);
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await waitForOSLoad(page);
  }

  console.log(`\n✅ Browser open at: ${page.url()}`);
  console.log('─────────────────────────────────────────────────────────────');
  console.log('💡 Tips:');
  console.log('   • Open DevTools (F12) → Elements tab to inspect the DOM');
  console.log('   • Use Playwright Inspector: set PWDEBUG=1 before running tests');
  console.log('   • Run codegen: npm run codegen');
  console.log('   • Press Ctrl+C here to close the browser');
  console.log('─────────────────────────────────────────────────────────────');

  // Keep alive until user presses Ctrl+C
  await new Promise((resolve) => {
    process.on('SIGINT', async () => {
      if (saveAuth) {
        await context.storageState({ path: AUTH_STATE_FILE });
        console.log(`\n💾 Auth state saved to ${AUTH_STATE_FILE}`);
      }
      console.log('\n👋 Closing browser...');
      await browser.close();
      resolve(undefined);
    });
  });
})();
