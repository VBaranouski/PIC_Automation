import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('@playwright/test');

const BASE_URL = 'https://qa.leap.schneider-electric.com';
const LOGIN_URL = `${BASE_URL}/GRC_Th/Login`;
const LANDING_URL = `${BASE_URL}/GRC_PICASso/HomePage`;
const KNOWN_RELEASE_URL = `${BASE_URL}/GRC_PICASso/ReleaseDetail?ReleaseId=3625`;
const LOGIN = 'PICEMDEPQL';
const PASSWORD = 'outsystems';

const STATUSES = [
  'Done',
  'In Progress',
  'Partial',
  'Planned',
  'Postponed',
  'Not Applicable',
  'Delegated',
];

async function waitForOSLoad(page, timeout = 30000) {
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
}

async function login(page) {
  await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.locator('#Input_UsernameVal, input[name="Username"], input[type="text"]').first().fill(LOGIN);
  await page.locator('#Input_PasswordVal, input[name="Password"], input[type="password"]').first().fill(PASSWORD);
  await page.getByRole('button', { name: /log.?in/i }).first().click();
  await page.waitForURL(/GRC_PICASso/, { timeout: 60000 });
  await waitForOSLoad(page);
}

async function areRequirementTabsAccessible(page) {
  const names = ['Process Requirements', 'Product Requirements'];
  for (const name of names) {
    const tab = page.getByRole('tab', { name: new RegExp(`^${name}\\b`, 'i') }).first();
    const visible = await tab.isVisible().catch(() => false);
    if (!visible) return false;
    const disabled = await tab.evaluate((element) => {
      const className = (element.getAttribute('class') ?? '').toLowerCase();
      return element.getAttribute('aria-disabled') === 'true'
        || element.hasAttribute('disabled')
        || className.includes('disabled');
    }).catch(() => true);
    if (disabled) return false;
  }
  return true;
}

async function getTopLevelTabDebug(page) {
  return page.evaluate(() => Array.from(document.querySelectorAll('[role="tab"]')).map((element) => ({
    text: (element.textContent || '').replace(/\s+/g, ' ').trim(),
    ariaLabel: element.getAttribute('aria-label') || '',
    ariaDisabled: element.getAttribute('aria-disabled') || '',
    className: (element.getAttribute('class') || '').slice(0, 200),
  })));
}

async function openReleaseWithRequirementsAccess(page) {
  await page.goto(KNOWN_RELEASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => undefined);
  await waitForOSLoad(page);
  if (await areRequirementTabsAccessible(page)) {
    return page.url();
  }
  console.log('Known release URL:', page.url());
  console.log('Known release title:', await page.title().catch(() => ''));
  console.log('Known release body sample:', (await page.locator('body').innerText().catch(() => '')).slice(0, 500));
  console.log('Known release tab debug:', JSON.stringify(await getTopLevelTabDebug(page), null, 2));

  await page.goto(LANDING_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await waitForOSLoad(page);
  await page.getByRole('tab', { name: /My Releases/i }).first().click();
  await waitForOSLoad(page);
  await page.waitForTimeout(2000);

  const rows = page.getByRole('grid').getByRole('row');
  const rowCount = await rows.count();
  const candidateUrls = [];

  for (let index = 1; index < Math.min(rowCount, 101); index += 1) {
    const href = await rows.nth(index).getByRole('link').first().getAttribute('href').catch(() => null);
    if (!href) continue;
    candidateUrls.push(href.startsWith('http') ? href : `${BASE_URL}${href}`);
  }

  for (const url of candidateUrls) {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await waitForOSLoad(page);
    if (await areRequirementTabsAccessible(page)) {
      return page.url();
    }
  }

  throw new Error('No release with accessible Process/Product Requirements tabs found in first 100 My Releases rows');
}

async function clickTab(page, tabName) {
  const tab = page.getByRole('tab', { name: new RegExp(`^${tabName}\\b`, 'i') }).first();
  await tab.waitFor({ state: 'visible', timeout: 20000 });
  const disabled = await tab.evaluate((element) => {
    const className = (element.getAttribute('class') ?? '').toLowerCase();
    return element.getAttribute('aria-disabled') === 'true'
      || element.hasAttribute('disabled')
      || className.includes('disabled');
  }).catch(() => true);
  if (disabled) {
    throw new Error(`${tabName} tab is disabled on sampled release`);
  }
  await tab.click();
  await waitForOSLoad(page);
  await page.waitForTimeout(2000);
}

async function findActionButton(page) {
  return page.evaluateHandle(() => {
    const panel = document.querySelector('[role="tabpanel"]') || document.body;
    const candidates = Array.from(panel.querySelectorAll('button, [role="button"], a'));
    const visible = candidates.filter((el) => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && rect.width > 0
        && rect.height > 0;
    });

    const scored = visible
      .map((el) => {
        const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
        const aria = el.getAttribute('aria-label') || '';
        const title = el.getAttribute('title') || '';
        const cls = el.getAttribute('class') || '';
        const rect = el.getBoundingClientRect();
        const row = el.closest('tr, [role="row"], .table-row, [class*="row"]');
        let score = 0;
        if (row) score += 2;
        if (!text) score += 3;
        if (text === '...' || text === '⋮' || text === '︙') score += 5;
        if (/more|ellipsis|action|dropdown|menu|kebab/i.test(`${aria} ${title} ${cls}`)) score += 5;
        if (rect.width <= 60) score += 2;
        return { el, text, aria, title, cls, score };
      })
      .sort((a, b) => b.score - a.score);

    return scored[0]?.el ?? null;
  });
}

async function getVisibleStatusMenuItems(page) {
  const texts = await page.evaluate((statusNames) => {
    const nodes = Array.from(document.querySelectorAll('body *'));
    const visibleTexts = [];
    for (const node of nodes) {
      const text = (node.textContent || '').replace(/\s+/g, ' ').trim();
      if (!text) continue;
      const style = window.getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      if (style.display === 'none' || style.visibility === 'hidden' || rect.width === 0 || rect.height === 0) continue;
      if (statusNames.some((name) => new RegExp(`^${name}$`, 'i').test(text))) {
        visibleTexts.push(text);
      }
    }
    return [...new Set(visibleTexts)];
  }, STATUSES);
  return texts;
}

async function inspectPopupForStatus(page, status) {
  const option = page.getByText(new RegExp(`^${status}$`, 'i')).first();
  const visible = await option.isVisible({ timeout: 5000 }).catch(() => false);
  if (!visible) {
    return { status, found: false };
  }

  await option.click();
  await waitForOSLoad(page);
  await page.waitForTimeout(1200);

  const details = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]') || document.querySelector('.popup-dialog, .osui-popup, .modal');
    const root = dialog || document.body;
    const labels = Array.from(root.querySelectorAll('label, .form-label, .mandatory, .label'))
      .map((el) => (el.textContent || '').replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .slice(0, 30);
    const buttons = Array.from(root.querySelectorAll('button, [role="button"]'))
      .map((el) => (el.textContent || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .slice(0, 20);
    const placeholders = Array.from(root.querySelectorAll('input, textarea, select'))
      .map((el) => ({
        tag: el.tagName,
        type: el.getAttribute('type') || '',
        name: el.getAttribute('name') || '',
        placeholder: el.getAttribute('placeholder') || '',
        value: el.value || '',
      }))
      .slice(0, 20);
    const text = (root.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 800);
    return { labels, buttons, placeholders, text };
  });

  const cancel = page.getByRole('button', { name: /Cancel|Close/i }).first();
  if (await cancel.isVisible({ timeout: 2000 }).catch(() => false)) {
    await cancel.click().catch(() => undefined);
  } else {
    await page.keyboard.press('Escape').catch(() => undefined);
  }
  await page.waitForTimeout(800);

  return { status, found: true, ...details };
}

async function inspectTab(page, tabName) {
  await clickTab(page, tabName);

  const tabText = await page.locator('[role="tabpanel"]').first().innerText().catch(() => '');
  const actionHandle = await findActionButton(page);
  const actionElement = actionHandle.asElement();
  if (!actionElement) {
    return { tabName, tabText: tabText.slice(0, 500), actionButtonFound: false };
  }

  await actionElement.click().catch(() => undefined);
  await page.waitForTimeout(1200);

  const menuItems = await getVisibleStatusMenuItems(page);
  const popupDetails = [];

  for (const status of STATUSES) {
    if (menuItems.some((item) => new RegExp(`^${status}$`, 'i').test(item))) {
      popupDetails.push(await inspectPopupForStatus(page, status));
      await actionElement.click().catch(() => undefined);
      await page.waitForTimeout(700);
    }
  }

  return {
    tabName,
    tabText: tabText.slice(0, 1200),
    actionButtonFound: true,
    menuItems,
    popupDetails,
  };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  try {
    await login(page);
    const releaseUrl = await openReleaseWithRequirementsAccess(page);
    const process = await inspectTab(page, 'Process Requirements').catch((error) => ({ tabName: 'Process Requirements', error: error.message }));
    const product = await inspectTab(page, 'Product Requirements').catch((error) => ({ tabName: 'Product Requirements', error: error.message }));

    console.log(JSON.stringify({ releaseUrl, process, product }, null, 2));
  } finally {
    await browser.close();
  }
})();
