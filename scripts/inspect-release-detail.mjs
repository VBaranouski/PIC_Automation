/**
 * CLI inspection script — Release Detail page breadcrumb + pipeline
 * Usage: node scripts/inspect-release-detail.mjs
 */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('@playwright/test');
import { writeFileSync } from 'fs';

const EXEC_PATH = '/Users/Uladzislau_Baranouski/Library/Caches/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const LOGIN      = 'PICEMDEProductOwner';
const PASSWORD   = 'outsystems';
const LOGIN_URL  = 'https://qa.leap.schneider-electric.com/GRC_Th/Login';
const LANDING_URL= 'https://qa.leap.schneider-electric.com/GRC_PICASso/HomePage';

async function waitForOSLoad(page) {
  for (const sel of ['.feedback-message-loading', '.os-loading-overlay']) {
    const el = page.locator(sel).first();
    if (await el.isVisible().catch(() => false)) {
      await el.waitFor({ state: 'hidden', timeout: 30_000 }).catch(() => {});
    }
  }
  const ph = page.locator('.content-placeholder.loading').first();
  if (await ph.isVisible().catch(() => false)) {
    await ph.waitFor({ state: 'hidden', timeout: 30_000 }).catch(() => {});
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page    = await context.newPage();

  // ── 1. Login ──────────────────────────────────────────────────────────────
  console.log('Logging in...');
  await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await waitForOSLoad(page);

  await page.locator('#Input_UsernameVal, input[name="Username"], input[type="text"]').first().fill(LOGIN);
  await page.locator('#Input_PasswordVal, input[name="Password"], input[type="password"]').first().fill(PASSWORD);
  await page.getByRole('button', { name: /log.?in/i }).first().click();
  await page.waitForURL(/GRC_PICASso/, { timeout: 60_000 });
  await waitForOSLoad(page);
  console.log('Logged in. Landing URL:', page.url());

  // ── 2. Navigate to My Releases ────────────────────────────────────────────
  console.log('Navigating to Landing page + My Releases tab...');
  await page.goto(LANDING_URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await waitForOSLoad(page);

  // Click "My Releases" tab
  const myReleasesTab = page.getByRole('tab', { name: /My Releases/i }).first();
  const tabCount = await myReleasesTab.count();
  console.log('My Releases tab count:', tabCount);

  if (tabCount > 0) {
    await myReleasesTab.click();
    await waitForOSLoad(page);
    await page.waitForTimeout(2000);
  } else {
    // Dump all tabs
    const tabs = await page.evaluate(() =>
      Array.from(document.querySelectorAll('[role="tab"]')).map(t => t.textContent?.trim())
    );
    console.log('Available tabs:', JSON.stringify(tabs));
  }

  await page.screenshot({ path: '/tmp/landing-my-releases.png' });

  // ── 3. Click first release link ───────────────────────────────────────────
  const firstLink = page.getByRole('grid').getByRole('row').nth(1).getByRole('link').first();
  const firstLinkCount = await firstLink.count().catch(() => 0);
  console.log('First release link count:', firstLinkCount);

  if (firstLinkCount === 0) {
    // Try broader grid row approach
    const anyGridLink = page.locator('table tbody tr:first-child a, .grid tbody tr:first-child a').first();
    const anyCount = await anyGridLink.count().catch(() => 0);
    console.log('Any grid link count:', anyCount);
    if (anyCount > 0) {
      await Promise.all([
        page.waitForURL(/ReleaseDetail/, { timeout: 60_000 }),
        anyGridLink.click(),
      ]);
    }
  } else {
    await Promise.all([
      page.waitForURL(/ReleaseDetail/, { timeout: 60_000 }),
      firstLink.click(),
    ]);
  }

  await waitForOSLoad(page);
  const releaseUrl = page.url();
  console.log('\nRelease Detail URL:', releaseUrl);
  await page.screenshot({ path: '/tmp/release-detail.png' });

  // ── 4. Inspect the breadcrumb ─────────────────────────────────────────────
  const breadcrumbInfo = await page.evaluate(() => {
    // Find all possible breadcrumb containers
    const navBreadcrumb = document.querySelector('nav[aria-label="breadcrumb"]');
    const breadcrumbsDiv = document.querySelector('.breadcrumbs');
    const container = navBreadcrumb || breadcrumbsDiv;

    if (!container) {
      // Look for any breadcrumb-like structure
      const allAnchors = Array.from(document.querySelectorAll('a[href*="HomePage"], a[href*="ProductDetail"]'));
      return {
        foundContainer: false,
        allBreadcrumbAnchors: allAnchors.map(a => ({
          text: a.textContent?.trim(),
          href: a.getAttribute('href'),
          parent: a.parentElement?.tagName + '.' + a.parentElement?.className,
        })),
        containerHtml: 'NO CONTAINER',
      };
    }

    const anchors = Array.from(container.querySelectorAll('a, li, span')).map(el => ({
      tag: el.tagName,
      text: el.textContent?.trim().slice(0, 80),
      href: el.getAttribute('href') || '',
      classes: el.className,
      ariaCurrent: el.getAttribute('aria-current') || '',
    }));

    return {
      foundContainer: true,
      containerTag: container.tagName,
      containerClass: container.className,
      anchors,
      containerHtml: container.outerHTML.slice(0, 2000),
    };
  });

  console.log('\n=== BREADCRUMB INFO ===');
  console.log(JSON.stringify(breadcrumbInfo, null, 2));

  // ── 5. Inspect the pipeline bar ───────────────────────────────────────────
  const pipelineInfo = await page.evaluate(() => {
    // Check wizard wrapper
    const wizard = document.querySelector('.wizard-wrapper[role="tablist"]');
    const stages = Array.from(document.querySelectorAll('.wizard-wrapper-item[role="tab"]'));
    const activeStage = document.querySelector('.wizard-wrapper-item.active[role="tab"]');

    // Check View Flow toggle
    const viewFlowToggle = document.querySelector('div.expandable-area--toggle');
    const expandableArea = document.querySelector('div.expandable-area');

    // Need Help
    const needHelp = document.querySelector('[data-block="Release.ReleaseHelp"] a, a[href*="help" i]');

    return {
      wizardFound: !!wizard,
      stagesCount: stages.length,
      stageTexts: stages.map(s => ({ text: s.textContent?.trim(), classes: s.className, ariaLabel: s.getAttribute('aria-label') })),
      activeStage: activeStage ? { text: activeStage.textContent?.trim(), classes: activeStage.className } : null,
      viewFlowToggleFound: !!viewFlowToggle,
      viewFlowToggleHtml: viewFlowToggle ? viewFlowToggle.outerHTML.slice(0, 500) : 'NOT FOUND',
      expandableAreaFound: !!expandableArea,
      needHelpFound: !!needHelp,
      needHelpText: needHelp ? needHelp.textContent?.trim() : 'NOT FOUND',
    };
  });

  console.log('\n=== PIPELINE INFO ===');
  console.log(JSON.stringify(pipelineInfo, null, 2));

  // ── 6. Release status badge ───────────────────────────────────────────────
  const statusBadge = await page.evaluate(() => {
    const badge = document.querySelector('[data-block="Patterns.ReleaseStatusTag"] .tag span');
    // Also try broader search
    const anyBadge = document.querySelector('.tag span, .badge, .status-tag, [class*="status"] span');
    return {
      specificBadge: badge ? { text: badge.textContent?.trim(), html: badge.outerHTML } : null,
      anyBadge: anyBadge ? { text: anyBadge.textContent?.trim(), html: anyBadge.outerHTML } : null,
    };
  });

  console.log('\n=== STATUS BADGE ===');
  console.log(JSON.stringify(statusBadge, null, 2));

  // Save full inspection data
  const data = { releaseUrl, breadcrumbInfo, pipelineInfo, statusBadge };
  writeFileSync('/tmp/release-inspection.json', JSON.stringify(data, null, 2));
  console.log('\nSaved to /tmp/release-inspection.json');
  console.log('Screenshots: /tmp/landing-my-releases.png, /tmp/release-detail.png');

  await browser.close();
})();
