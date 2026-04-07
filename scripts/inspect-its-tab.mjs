import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('../node_modules/playwright');
import { writeFileSync } from 'fs';

const LOGIN    = 'PICEMDEProductOwner';
const PASSWORD = 'outsystems';
const LOGIN_URL = 'https://qa.leap.schneider-electric.com/GRC_Th/Login';
const DOC_URL  = 'https://qa.leap.schneider-electric.com/GRC_PICASso_DOC/DOCDetail?DOCId=77&ProductId=730';

/** Wait for OutSystems loading overlays to disappear */
async function waitForOSLoad(page) {
  for (const sel of ['.feedback-message-loading', '.os-loading-overlay']) {
    const el = page.locator(sel).first();
    if (await el.isVisible().catch(() => false)) {
      await el.waitFor({ state: 'hidden', timeout: 30_000 }).catch(() => {});
    }
  }
  const placeholder = page.locator('.content-placeholder.loading').first();
  if (await placeholder.isVisible().catch(() => false)) {
    await placeholder.waitFor({ state: 'hidden', timeout: 30_000 }).catch(() => {});
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: '/Users/Uladzislau_Baranouski/Library/Caches/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-mac-arm64/chrome-headless-shell' });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page    = await context.newPage();

  // ── 1. Login ─────────────────────────────────────────────────────────────
  console.log('Navigating to login page...');
  await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await waitForOSLoad(page);

  await page.locator('#Input_UsernameVal, input[name="Username"], input[type="text"]').first().fill(LOGIN);
  await page.locator('#Input_PasswordVal, input[name="Password"], input[type="password"]').first().fill(PASSWORD);
  await page.getByRole('button', { name: /log.?in/i }).first().click();

  await page.waitForURL(/GRC_PICASso/, { timeout: 60_000 });
  await waitForOSLoad(page);
  console.log('Logged in. URL:', page.url());

  // ── 2. Navigate to DOC Detail ─────────────────────────────────────────────
  console.log('Navigating to DOC Detail...');
  await page.goto(DOC_URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await waitForOSLoad(page);
  console.log('DOC Detail loaded. URL:', page.url());
  await page.screenshot({ path: '/tmp/doc-before-its.png' });

  // ── 3. Dump ALL tabs ──────────────────────────────────────────────────────
  await page.waitForTimeout(2_000);
  const allTabs = await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('[role="tab"], .tab-header-item, .TabItem, [class*="tab"]'));
    return tabs.map(t => ({ text: t.textContent?.trim().slice(0, 80), cls: t.className, role: t.getAttribute('role') })).filter(t => t.text);
  });
  console.log('\n=== ALL TAB ELEMENTS ===');
  allTabs.forEach(t => console.log(' -', JSON.stringify(t)));

  // ── 4. Click ITS Checklist tab ────────────────────────────────────────────
  const itsTab = page.getByRole('tab', { name: /ITS Checklist/i }).first();
  const itsTabCount = await itsTab.count();
  console.log('\nITS tab (getByRole) count:', itsTabCount);

  if (itsTabCount > 0) {
    await itsTab.click();
  } else {
    // Fallback: find any element containing "ITS"
    const fallback = page.locator(':text("ITS Checklist"), :text("ITS")').first();
    const fbCount = await fallback.count();
    console.log('Fallback ITS locator count:', fbCount);
    if (fbCount > 0) await fallback.click();
  }

  await waitForOSLoad(page);
  await page.waitForTimeout(2_000);
  await page.screenshot({ path: '/tmp/doc-its-tab.png', fullPage: true });

  // ── 5. Inspect ITS tab panel content ─────────────────────────────────────
  const info = await page.evaluate(() => {
    // Active tabpanel
    const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
    const visiblePanel = panels.find(p => {
      const style = window.getComputedStyle(p);
      return style.display !== 'none' && style.visibility !== 'hidden';
    }) || panels[0];

    const panelHtml = visiblePanel ? visiblePanel.innerHTML.slice(0, 3000) : 'NO TABPANEL';

    // All <th> in page
    const thTexts = Array.from(document.querySelectorAll('th')).map(th => th.textContent?.trim()).filter(Boolean);

    // All headings
    const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6,.title,.section-title'))
      .map(h => h.textContent?.trim()).filter(Boolean);

    // Text containing IT SECURITY
    const itSecEls = Array.from(document.querySelectorAll('*'))
      .filter(el => el.children.length === 0 && (el.textContent || '').includes('IT SECURITY'))
      .map(el => ({ tag: el.tagName, cls: el.className, text: el.textContent?.trim().slice(0, 100) }));

    return { panelHtml, thTexts, headings, itSecEls };
  });

  console.log('\n=== TABLE HEADERS ===');
  console.log(JSON.stringify(info.thTexts, null, 2));
  console.log('\n=== PAGE HEADINGS ===');
  console.log(JSON.stringify(info.headings, null, 2));
  console.log('\n=== IT SECURITY ELEMENTS ===');
  console.log(JSON.stringify(info.itSecEls, null, 2));
  console.log('\n=== VISIBLE TABPANEL HTML (first 3000 chars) ===');
  console.log(info.panelHtml);

  writeFileSync('/tmp/its-inspection.json', JSON.stringify(info, null, 2));
  console.log('\nDone. Screenshots at /tmp/doc-before-its.png and /tmp/doc-its-tab.png');
  console.log('Full JSON at /tmp/its-inspection.json');

  await browser.close();
})();
