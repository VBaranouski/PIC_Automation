// inspect-tracking-tools.mjs v2
import { createRequire } from 'module';
import fs from 'fs';

const require = createRequire(import.meta.url);
const { chromium } = require('@playwright/test');

// ── helpers ──────────────────────────────────────────────────────────────────
async function dumpInnerText(page, label) {
  const txt = await page.evaluate(() => {
    const panel = document.querySelector('.osui-tabs__content--is-active, [role="tabpanel"]');
    return panel ? panel.innerText : '(no panel found)';
  });
  console.log(`\n====== ${label} ======`);
  console.log(txt.trim().substring(0, 3000));
}

async function dumpAllInputs(page, label) {
  const data = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('input, select, textarea').forEach(el => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const lbl = document.querySelector(`label[for="${el.id}"]`)?.textContent?.trim()
        || el.closest('.label, .field-container, [class*="label"]')?.querySelector('span,div')?.textContent?.trim()
        || el.placeholder || '';
      out.push(`[${el.tagName}#${el.id || '?'}] type=${el.type} checked=${el.checked} disabled=${el.disabled} placeholder="${el.placeholder}" value="${el.value?.substring(0,40)}" label="${lbl?.substring(0,50)}"`); 
    });
    // Also log buttons
    document.querySelectorAll('button').forEach(btn => {
      const r = btn.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const t = btn.textContent?.trim();
      if (t && !t.includes('\n') && t.length < 80) out.push(`[BUTTON#${btn.id||'?'}] "${t}" disabled=${btn.disabled}`);
    });
    return out;
  });
  console.log(`\n====== ${label} ======`);
  data.forEach(l => console.log(' ', l));
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 1440, height: 900 },
    storageState: '/Users/Uladzislau_Baranouski/Automation 2026/PIC_Automation/.auth-state.json',
  });
  const page = await context.newPage();

  await page.goto('https://qa.leap.schneider-electric.com/GRC_PICASso/ProductDetail?ProductId=1133', {
    waitUntil: 'domcontentloaded', timeout: 60000
  });
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});

  const editBtn = page.getByRole('button', { name: 'Edit Product' });
  await editBtn.waitFor({ state: 'visible', timeout: 20000 });
  await editBtn.click();
  await page.waitForTimeout(3000);

  const configTab = page.getByRole('tab', { name: /Product Configuration/ });
  await configTab.waitFor({ state: 'visible', timeout: 15000 });
  await configTab.click();
  await page.waitForTimeout(2000);

  await dumpInnerText(page, 'PRODUCT CONFIG TAB — INITIAL STATE');
  await dumpAllInputs(page, 'ALL INPUTS — INITIAL');

  // --- ENABLE JIRA ---
  console.log('\n>>> Enabling Jira switch (#b19-Jira_Switch)...');
  const jiraSwitch = page.locator('#b19-Jira_Switch');
  const jiraDisabled = await jiraSwitch.isDisabled().catch(() => true);
  console.log('Jira switch disabled:', jiraDisabled);
  if (!jiraDisabled) {
    await jiraSwitch.check({ force: true });
    await page.waitForTimeout(3000);
    await dumpInnerText(page, 'AFTER JIRA ENABLED');
    await dumpAllInputs(page, 'INPUTS AFTER JIRA ENABLED');
    fs.writeFileSync('/tmp/jira-enabled.html', await page.content());

    // disable again
    await jiraSwitch.uncheck({ force: true });
    await page.waitForTimeout(2000);
  }

  // --- ENABLE JAMA ---
  console.log('\n>>> Enabling Jama switch (#b19-Jama_Switch)...');
  const jamaSwitch = page.locator('#b19-Jama_Switch');
  const jamaDisabled = await jamaSwitch.isDisabled().catch(() => true);
  console.log('Jama switch disabled:', jamaDisabled);
  if (!jamaDisabled) {
    await jamaSwitch.check({ force: true });
    await page.waitForTimeout(3000);
    await dumpInnerText(page, 'AFTER JAMA ENABLED');
    await dumpAllInputs(page, 'INPUTS AFTER JAMA ENABLED');
    fs.writeFileSync('/tmp/jama-enabled.html', await page.content());
  }

  await browser.close();
  console.log('\n=== DONE ===');
})();
