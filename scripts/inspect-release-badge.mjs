import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('../node_modules/playwright');

const LOGIN    = 'PICEMDEPQL';
const PASSWORD = 'outsystems';
const LOGIN_URL    = 'https://qa.leap.schneider-electric.com/GRC_Th/Login';
const PRODUCT_URL  = 'https://qa.leap.schneider-electric.com/GRC_PICASso/ProductDetail?ProductId=1200';
const HEADLESS_SHELL = '/Users/Uladzislau_Baranouski/Library/Caches/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-mac-arm64/chrome-headless-shell';

async function waitForOSLoad(page) {
  for (let i = 0; i < 30; i++) {
    const loading = await page.locator('.feedback-message-loading, .os-loading-overlay').first().isVisible().catch(() => false);
    if (!loading) break;
    await page.waitForTimeout(500);
  }
  await page.waitForFunction(() => {
    const placeholders = document.querySelectorAll('.content-placeholder.loading');
    return placeholders.length === 0;
  }, { timeout: 20000 }).catch(() => {});
}

(async () => {
const browser = await chromium.launch({ executablePath: HEADLESS_SHELL, headless: true });
const context = await browser.newContext({ ignoreHTTPSErrors: true });
const page = await context.newPage();

// Login
console.log('Navigating to login page...');
await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });
await waitForOSLoad(page);
await page.locator('#Input_UsernameVal, input[name="Username"], input[type="text"]').first().fill(LOGIN);
await page.locator('#Input_PasswordVal, input[name="Password"], input[type="password"]').first().fill(PASSWORD);
await page.getByRole('button', { name: /log.?in/i }).first().click();
await page.waitForURL(/GRC_PICASso/, { timeout: 60_000 });
await waitForOSLoad(page);
console.log('Logged in. URL:', page.url());

// Navigate to Product Detail - wait for full load
await page.goto(PRODUCT_URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });
await page.waitForURL(/ProductDetail/, { timeout: 30_000 });
await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {});
await waitForOSLoad(page);
await page.waitForTimeout(3000);
console.log('Current URL after Product Detail nav:', page.url());
const bodySnap = await page.evaluate(() => document.body.innerHTML.slice(0, 2000));
console.log('Body snapshot:', bodySnap);

// Screenshot after Product Detail loads
await page.screenshot({ path: '/tmp/product-detail.png' });
console.log('Product Detail page screenshot saved to /tmp/product-detail.png');

// Dump tabs
const tabs = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('[role="tab"]'))
    .map(t => ({ text: t.textContent?.trim(), cls: t.className }));
});
console.log('Tabs found:', JSON.stringify(tabs));

// Click Releases tab
const releasesTab = page.locator('[role="tab"]').filter({ hasText: /releases/i }).first();
const releasesTabCount = await releasesTab.count();
console.log('Releases tab count:', releasesTabCount);
if (releasesTabCount > 0) {
  await releasesTab.click();
  await waitForOSLoad(page);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/product-detail-releases.png' });
  console.log('After Releases tab click, screenshot saved');
}

// Dump all links in the releases section
const allLinks = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('a[href*="ReleaseDetail"]'))
    .slice(0, 5)
    .map(a => ({ href: a.href, text: a.textContent?.trim() }));
});
console.log('ReleaseDetail links:', JSON.stringify(allLinks));

// Click first release
const firstLink = page.locator('a[href*="ReleaseDetail"], table tbody tr a, [role="grid"] [role="row"] a').first();
await firstLink.waitFor({ state: 'visible', timeout: 20000 });
await Promise.all([
  page.waitForURL(/ReleaseDetail/, { timeout: 30000 }),
  firstLink.click()
]);
await waitForOSLoad(page);
await page.waitForTimeout(2000);
console.log('\nRelease Detail URL:', page.url());

// Inspect status badge related elements
console.log('\n=== STATUS BADGE ELEMENTS ===');
const badgeCandidates = await page.evaluate(() => {
  const selectors = [
    '[data-block="Patterns.ReleaseStatusTag"]',
    '.tag',
    '[class*="tag"]',
    '[class*="badge"]',
    '[class*="status"]',
    '[class*="label"]',
    '.release-status',
    '[data-block*="Status"]',
    '[data-block*="status"]',
  ];
  const results = [];
  for (const sel of selectors) {
    const els = document.querySelectorAll(sel);
    if (els.length > 0) {
      results.push({
        selector: sel,
        count: els.length,
        samples: Array.from(els).slice(0, 3).map(el => ({
          tag: el.tagName,
          classes: el.className,
          text: el.textContent.trim().slice(0, 60),
          dataBlock: el.getAttribute('data-block'),
          innerHTML: el.innerHTML.trim().slice(0, 200)
        }))
      });
    }
  }
  return results;
});
console.log(JSON.stringify(badgeCandidates, null, 2));

// Check all data-block attributes containing "status" or "release"
console.log('\n=== SEARCHING FOR Status/Release IN data-block ===');
const statusBlocks = await page.evaluate(() => {
  const allDataBlocks = document.querySelectorAll('[data-block]');
  return Array.from(allDataBlocks)
    .filter(el => {
      const db = el.getAttribute('data-block') || '';
      return db.toLowerCase().includes('status') || db.toLowerCase().includes('release');
    })
    .slice(0, 20)
    .map(el => ({
      dataBlock: el.getAttribute('data-block'),
      text: el.textContent.trim().slice(0, 80),
      innerHTML: el.innerHTML.trim().slice(0, 300),
      classes: el.className
    }));
});
console.log(JSON.stringify(statusBlocks, null, 2));

// Dump page header HTML
console.log('\n=== PAGE TITLE / H1 AREA ===');
const titleArea = await page.evaluate(() => {
  const h1 = document.querySelector('h1');
  const titleEl = document.querySelector('.page-title, .release-title, [class*="title"]');
  return {
    h1: h1 ? h1.outerHTML : 'none',
    titleEl: titleEl ? titleEl.outerHTML.slice(0, 500) : 'none',
    bodyStart: document.body.innerHTML.slice(0, 2000)
  };
});
console.log('H1:', titleArea.h1);
console.log('Title el:', titleArea.titleEl);

await browser.close();
console.log('Done.');
})();
