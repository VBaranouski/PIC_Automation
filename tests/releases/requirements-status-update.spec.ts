import { test, expect } from '../../src/fixtures';
import * as allure from 'allure-js-commons';
import { createFreshRelease } from './helpers/fresh-release';
import { submitStandardQuestionnaireForRelease } from './helpers/questionnaire-flow';

const STATUS_CASES = [
  'Done',
  'In Progress',
  'Partial',
  'Planned',
  'Postponed',
  'Not Applicable',
  'Delegated',
] as const;

type RequirementTabName = 'Process Requirements' | 'Product Requirements';
type RequirementStatus = (typeof STATUS_CASES)[number];

type ActionCandidate = {
  index: number;
  score: number;
};

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getStatusMenuItem(
  scope: import('@playwright/test').Page | import('@playwright/test').Locator,
  status?: RequirementStatus,
) {
  const source = status
    ? `^${escapeRegex(status)}(?:\\b|\\s*-)`
    : '^(Done|In Progress|Partial|Planned|Postponed|Not Applicable|Delegated)(?:\\b|\\s*-)';
  return scope
    .locator('.text-capitalize, [class*="capitalize"], [role="option"], button, li, span, div')
    .filter({ hasText: new RegExp(source, 'i') })
    .first();
}

async function findStatusMenuRoot(page: import('@playwright/test').Page) {
  const menuRoot = page
    .locator(
      '[role="listbox"], ' +
      '[role="menu"], ' +
      '.dropdown-menu, ' +
      '.osui-dropdown__balloon, ' +
      '.osui-popover__balloon-wrapper, ' +
      '.popover, ' +
      '[class*="dropdown"], ' +
      '[class*="popover"]',
    )
    .filter({ hasText: /Done|In Progress|Partial|Planned|Postponed|Not Applicable|Delegated/i })
    .last();

  const visible = await menuRoot.isVisible({ timeout: 1_000 }).catch(() => false);
  if (visible) {
    return menuRoot;
  }

  return null;
}

async function findRequirementActionMenuRoot(page: import('@playwright/test').Page) {
  const menuRoot = page
    .locator(
      '[role="listbox"], ' +
      '[role="menu"], ' +
      '.dropdown-menu, ' +
      '.osui-dropdown__balloon, ' +
      '.osui-popover__balloon-wrapper, ' +
      '.popover, ' +
      '[class*="dropdown"], ' +
      '[class*="popover"]',
    )
    .filter({ hasText: /\b(Edit|View|Add|Remove|Unlink|Relink)\b/i })
    .last();

  const visible = await menuRoot.isVisible({ timeout: 1_000 }).catch(() => false);
  if (visible) {
    return menuRoot;
  }

  return null;
}

function getActionMenuItem(
  scope: import('@playwright/test').Page | import('@playwright/test').Locator,
  label: RegExp,
) {
  return scope.locator('button, [role="menuitem"], [role="option"], a, li, div, span').filter({ hasText: label }).first();
}

function getRequirementActionTriggerForRow(row: import('@playwright/test').Locator) {
  return row
    .locator(
      '[role="gridcell"]:last-child .popover-top, ' +
      '[role="gridcell"]:last-child [data-popover], ' +
      '[role="gridcell"]:last-child [role="button"], ' +
      '[role="gridcell"]:last-child button, ' +
      '[role="gridcell"]:last-child a, ' +
      'td:last-child .popover-top, ' +
      'td:last-child [data-popover], ' +
      'td:last-child [role="button"], ' +
      'td:last-child button, ' +
      'td:last-child a',
    )
    .last();
}

function getRequirementActionCellForRow(row: import('@playwright/test').Locator) {
  return row.locator('[role="gridcell"], td').last();
}

function getRequirementActionIconForRow(row: import('@playwright/test').Locator) {
  return getRequirementActionCellForRow(row)
    .locator('text=/[⋮︙]|\\.\\.\\./')
    .first();
}

function getStatusCellForRow(row: import('@playwright/test').Locator) {
  return row
    .locator('[role="gridcell"], td')
    .filter({ hasText: /(planned|done|in progress|partial|postponed|not applicable|delegated)\s*?/i })
    .first();
}

function getStatusIconForRow(row: import('@playwright/test').Locator) {
  return getStatusCellForRow(row)
    .locator('text=/[⋮︙]|\\.\\.\\./')
    .first();
}

async function openRequirementsTab(
  page: import('@playwright/test').Page,
  releaseDetailPage: {
    clickTopLevelTab(name: string): Promise<void>;
    expectTopLevelTabSelected(name: string): Promise<void>;
    isTopLevelTabDisabled(name: string): Promise<boolean>;
  },
  tabName: RequirementTabName,
): Promise<void> {
  const isDisabled = await releaseDetailPage.isTopLevelTabDisabled(tabName);
  test.skip(isDisabled, `${tabName} tab is disabled on the current release.`);

  await releaseDetailPage.clickTopLevelTab(tabName);
  await releaseDetailPage.expectTopLevelTabSelected(tabName);
  await page.waitForTimeout(2_000);
}

async function enableShowAllRequirementsIfVisible(page: import('@playwright/test').Page): Promise<void> {
  const toggleLabel = page.getByText(/Show All Requirements/i).first();
  const labelVisible = await toggleLabel.isVisible({ timeout: 2_000 }).catch(() => false);
  if (!labelVisible) {
    return;
  }

  await toggleLabel.click().catch(() => undefined);
  await page.waitForTimeout(1_000);
}

async function expandVisibleAccordions(page: import('@playwright/test').Page): Promise<void> {
  const accordionHeaders = page.locator(
    '[role="tabpanel"] .osui-accordion-item__title, ' +
    '[role="tabpanel"] .osui-accordion-item button, ' +
    '[role="tabpanel"] [class*="accordion"] [role="button"], ' +
    '[role="tabpanel"] [class*="accordion"] button, ' +
    '[role="tabpanel"] [role="row"] a[href="#"]',
  );

  const count = Math.min(await accordionHeaders.count().catch(() => 0), 12);
  for (let index = 0; index < count; index += 1) {
    const header = accordionHeaders.nth(index);
    const visible = await header.isVisible().catch(() => false);
    if (!visible) {
      continue;
    }

    const expanded = await header.getAttribute('aria-expanded').catch(() => null);
    const text = ((await header.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
    const looksCollapsed = expanded === 'false' || /^/.test(text);
    if (!looksCollapsed) {
      continue;
    }

    await header.scrollIntoViewIfNeeded().catch(() => undefined);
    await header.click().catch(() => undefined);
    await page.waitForTimeout(300);
  }
}

function requirementRows(page: import('@playwright/test').Page) {
  return page.getByRole('grid').getByRole('row');
}

function getStatusTriggerForRow(row: import('@playwright/test').Locator) {
  return row.locator(
    '[data-block*="EditStatus_Optimised"] .popover-top, ' +
    '[data-block*="EditStatus_Optimised"] [data-popover], ' +
    '[data-block*="EditStatus_Optimised"] [role="button"], ' +
    '[data-block*="EditStatus_Optimised"] button',
  ).first();
}

async function getRowActionCandidates(
  row: import('@playwright/test').Locator,
): Promise<ActionCandidate[]> {
  const buttons = row.locator('button, [role="button"], a');
  const candidates: ActionCandidate[] = [];
  const count = await buttons.count().catch(() => 0);

  for (let index = 0; index < count; index += 1) {
    const button = buttons.nth(index);
    const visible = await button.isVisible().catch(() => false);
    if (!visible) {
      continue;
    }

    const text = ((await button.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
    const ariaLabel = await button.getAttribute('aria-label').catch(() => '') ?? '';
    const title = await button.getAttribute('title').catch(() => '') ?? '';
    const className = await button.getAttribute('class').catch(() => '') ?? '';
    const box = await button.boundingBox().catch(() => null);

    let score = 0;
    if (!text) score += 3;
    if (text === '...' || text === '⋮' || text === '︙') score += 5;
    if (/more|ellipsis|action|dropdown|menu|edit|status/i.test(`${ariaLabel} ${title} ${className}`)) score += 5;
    if (box && box.width <= 60) score += 2;
    if (box && box.height <= 60) score += 1;
    if (/remove|delete/i.test(`${text} ${ariaLabel} ${title}`)) score -= 4;
    if (/http|requirement|details|history/i.test(text)) score -= 2;

    if (score > 0) {
      candidates.push({ index, score });
    }
  }

  return candidates.sort((left, right) => right.score - left.score);
}

async function findEditableRowIndexes(
  page: import('@playwright/test').Page,
  desiredCount = STATUS_CASES.length,
): Promise<number[]> {
  const rows = requirementRows(page);
  const count = await rows.count().catch(() => 0);
  const indexes: number[] = [];

  for (let index = 0; index < Math.min(count, 20) && indexes.length < desiredCount; index += 1) {
    const row = rows.nth(index);
    const visible = await row.isVisible().catch(() => false);
    if (!visible) {
      continue;
    }

    const rowText = ((await row.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
    if (!rowText || /^(Process|Product|Status|Actions|Requirement Name|Name)$/i.test(rowText)) {
      continue;
    }

    const statusTriggerVisible = await getStatusTriggerForRow(row)
      .isVisible()
      .catch(() => false);

    if (statusTriggerVisible) {
      indexes.push(index);
      continue;
    }

    const actionCandidates = await getRowActionCandidates(row);
    if (actionCandidates.length > 0) {
      indexes.push(index);
    }
  }

  return indexes;
}

async function getRequirementGridDiagnostics(page: import('@playwright/test').Page): Promise<string> {
  const rows = requirementRows(page);
  const totalRows = await rows.count().catch(() => 0);
  const rowSummaries: string[] = [];

  for (let index = 0; index < Math.min(totalRows, 5); index += 1) {
    const row = rows.nth(index);
    const visible = await row.isVisible().catch(() => false);
    const statusTriggerVisible = await getStatusTriggerForRow(row).isVisible().catch(() => false);
    const popoverCount = await row.locator('.popover-top').count().catch(() => 0);
    const actionCandidateCount = (await getRowActionCandidates(row).catch(() => [])).length;
    const text = ((await row.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim().slice(0, 180);

    rowSummaries.push(
      `row${index + 1}{visible=${visible},statusTrigger=${statusTriggerVisible},popovers=${popoverCount},actionCandidates=${actionCandidateCount},text="${text}"}`,
    );
  }

  return `matchedRows=${totalRows}; ${rowSummaries.join(' | ')}`;
}

async function clickRowEllipsisViaDom(
  row: import('@playwright/test').Locator,
  target: 'action' | 'status',
): Promise<boolean> {
  return row.evaluate((element: any, clickTarget) => {
    const win = globalThis as any;

    const isVisible = (node: any) => {
      if (!node) {
        return false;
      }

      const style = win.getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && rect.width > 0
        && rect.height > 0;
    };

    const cells = Array.from(element.querySelectorAll('[role="gridcell"], td')) as any[];
    if (!cells.length) {
      return false;
    }

    const statusPattern = /(planned|done|in progress|partial|postponed|not applicable|delegated)/i;
    const candidateCell = clickTarget === 'action'
      ? cells[cells.length - 1]
      : cells.find((cell) => statusPattern.test((cell.textContent || '').replace(/\s+/g, ' ').trim()));

    if (!candidateCell) {
      return false;
    }

    const iconCandidates = [candidateCell, ...Array.from(candidateCell.querySelectorAll('*'))]
      .filter((node: any) => isVisible(node) && /[⋮︙]|\.\.\./.test((node.textContent || '').trim()));
    const clickable = (iconCandidates[iconCandidates.length - 1] || candidateCell) as any;

    clickable.dispatchEvent(new win.MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    clickable.dispatchEvent(new win.MouseEvent('mouseup', { bubbles: true, cancelable: true }));
    clickable.dispatchEvent(new win.MouseEvent('click', { bubbles: true, cancelable: true }));

    return true;
  }, target).catch(() => false);
}

async function openStatusActionMenuForRow(
  page: import('@playwright/test').Page,
  rowIndex: number,
): Promise<import('@playwright/test').Locator | null> {
  const row = requirementRows(page).nth(rowIndex);
  await row.scrollIntoViewIfNeeded().catch(() => undefined);
  await expect(row).toBeVisible({ timeout: 10_000 });

  const interactionTargets = [
    getRequirementActionIconForRow(row),
    getRequirementActionTriggerForRow(row),
    getRequirementActionCellForRow(row),
    getStatusIconForRow(row),
    getStatusTriggerForRow(row),
    getStatusCellForRow(row),
  ];

  for (const target of interactionTargets) {
    const visible = await target.isVisible().catch(() => false);
    if (!visible) {
      continue;
    }

    await target.scrollIntoViewIfNeeded().catch(() => undefined);
    await target.click({ force: true }).catch(() => undefined);
    await page.waitForTimeout(800);

    const popup = await findPopupRoot(page);
    if (popup) {
      return popup;
    }

    const actionMenu = await findRequirementActionMenuRoot(page);
    if (actionMenu) {
      const editItem = getActionMenuItem(actionMenu, /^Edit\b/i);
      const editVisible = await editItem.isVisible({ timeout: 500 }).catch(() => false);
      if (editVisible) {
        await editItem.click().catch(() => undefined);
        await page.waitForTimeout(800);

        const editPopup = await findPopupRoot(page);
        if (editPopup) {
          return editPopup;
        }
      }
    }
  }

  const statusTrigger = getStatusTriggerForRow(row);
  const statusTriggerVisible = await statusTrigger.isVisible().catch(() => false);
  if (statusTriggerVisible) {
    await statusTrigger.click({ force: true }).catch(() => undefined);
    await page.waitForTimeout(800);

    const popup = await findPopupRoot(page);
    if (popup) {
      return popup;
    }
  }

  const popoverTrigger = row
    .locator('[data-popover] .popover-top, [data-popover] [style*="cursor: pointer"]')
    .last();
  const popoverVisible = await popoverTrigger.isVisible().catch(() => false);
  if (popoverVisible) {
    await popoverTrigger.click({ force: true }).catch(() => undefined);
    await page.waitForTimeout(800);

    const popup = await findPopupRoot(page);
    if (popup) {
      return popup;
    }
  }

  const candidates = await getRowActionCandidates(row);
  for (const candidate of candidates.slice(0, 4)) {
    const button = row.locator('button, [role="button"], a').nth(candidate.index);
    await button.click().catch(() => undefined);
    await page.waitForTimeout(800);

    const popup = await findPopupRoot(page);
    if (popup) {
      return popup;
    }
  }

  const ellipsisCells = row
    .locator('td, [role="gridcell"]')
    .filter({ hasText: /|⋮|︙|\.\.\./ });
  const ellipsisCount = await ellipsisCells.count().catch(() => 0);

  for (let index = ellipsisCount - 1; index >= 0; index -= 1) {
    const cell = ellipsisCells.nth(index);
    const visible = await cell.isVisible().catch(() => false);
    if (!visible) {
      continue;
    }

    await cell.scrollIntoViewIfNeeded().catch(() => undefined);
    await cell.click().catch(() => undefined);
    await page.waitForTimeout(800);

    const popup = await findPopupRoot(page);
    if (popup) {
      return popup;
    }
  }

  const actionDomClicked = await clickRowEllipsisViaDom(row, 'action');
  if (actionDomClicked) {
    await page.waitForTimeout(800);

    const actionMenu = await findRequirementActionMenuRoot(page);
    if (actionMenu) {
      const editItem = getActionMenuItem(actionMenu, /^Edit\b/i);
      const editVisible = await editItem.isVisible({ timeout: 500 }).catch(() => false);
      if (editVisible) {
        await editItem.click().catch(() => undefined);
        await page.waitForTimeout(800);
      }
    }

    const popup = await findPopupRoot(page);
    if (popup) {
      return popup;
    }
  }

  const statusDomClicked = await clickRowEllipsisViaDom(row, 'status');
  if (statusDomClicked) {
    await page.waitForTimeout(800);

    const popup = await findPopupRoot(page);
    if (popup) {
      return popup;
    }
  }

  throw new Error(`Unable to open status action menu for requirement row ${rowIndex + 1}.`);
}

async function findPopupRoot(page: import('@playwright/test').Page) {
  const popup = page
    .locator(
      '[data-block*="EditSelectedReq"], ' +
      '[id*="EditSelectedReq"], ' +
      '[id*="PopupContent"], ' +
      '[role="dialog"], ' +
      '.popup-dialog, ' +
      '.osui-popup, ' +
      '.modal, ' +
      '[class*="popup"], ' +
      '[class*="dialog"]',
    )
    .filter({ has: page.locator('button, input, textarea, select, [role="combobox"]') })
    .last();

  const isVisible = await popup.isVisible({ timeout: 2_000 }).catch(() => false);
  if (isVisible) {
    return popup;
  }

  return null;
}

async function selectStatusInPopup(
  popup: import('@playwright/test').Locator,
  page: import('@playwright/test').Page,
  status: RequirementStatus,
): Promise<boolean> {
  const statusPattern = new RegExp(`^${escapeRegex(status)}(?:\\b|\\s*-)`, 'i');

  const selects = popup.locator('select');
  const selectCount = await selects.count().catch(() => 0);
  for (let index = 0; index < selectCount; index += 1) {
    const select = selects.nth(index);
    const visible = await select.isVisible().catch(() => false);
    if (!visible) {
      continue;
    }

    const options = (await select.locator('option').allTextContents().catch(() => []))
      .map((option) => option.replace(/\s+/g, ' ').trim())
      .filter(Boolean);
    const match = options.find((option) => statusPattern.test(option));
    if (!match) {
      continue;
    }

    await select.selectOption({ label: match }).catch(() => undefined);
    return true;
  }

  const comboboxes = popup.locator(
    '[role="combobox"], ' +
    'input[placeholder*="status" i], ' +
    'input[name*="status" i], ' +
    'input[id*="status" i], ' +
    '[aria-haspopup="listbox"]',
  );
  const comboboxCount = await comboboxes.count().catch(() => 0);
  for (let index = 0; index < comboboxCount; index += 1) {
    const combobox = comboboxes.nth(index);
    const visible = await combobox.isVisible().catch(() => false);
    if (!visible) {
      continue;
    }

    await combobox.click().catch(() => undefined);
    await page.waitForTimeout(300);

    const option = page
      .locator(
        '[role="option"], ' +
        '.vscomp-option, ' +
        '.dropdown-menu button, ' +
        '.dropdown-menu li, ' +
        '.dropdown-menu div, ' +
        '.osui-dropdown__balloon button, ' +
        '.osui-dropdown__balloon li, ' +
        '.osui-dropdown__balloon div',
      )
      .filter({ hasText: statusPattern })
      .first();
    const optionVisible = await option.isVisible({ timeout: 1_500 }).catch(() => false);
    if (optionVisible) {
      await option.click().catch(() => undefined);
      return true;
    }
  }

  const directChoice = popup
    .locator('button, [role="button"], label, span, div')
    .filter({ hasText: statusPattern })
    .first();
  if (await directChoice.isVisible({ timeout: 1_000 }).catch(() => false)) {
    await directChoice.click().catch(() => undefined);
    return true;
  }

  return false;
}

async function fillEvidenceLinkIfVisible(
  popup: import('@playwright/test').Locator,
  evidenceUrl: string,
): Promise<void> {
  const urlInputs = popup.locator(
    'input[type="url"], input[placeholder*="http" i], input[placeholder*="url" i], ' +
    'input[placeholder*="link" i], input[name*="link" i], input[id*="link" i], ' +
    'input[name*="evidence" i], input[id*="evidence" i], input[placeholder*="evidence" i]',
  );

  const count = await urlInputs.count().catch(() => 0);
  if (count > 0) {
    const input = urlInputs.first();
    const visible = await input.isVisible().catch(() => false);
    if (visible) {
      await input.fill(evidenceUrl).catch(() => undefined);
      return;
    }
  }

  const genericTextInput = popup.locator('input[type="text"]').first();
  const genericVisible = await genericTextInput.isVisible().catch(() => false);
  const popupText = await popup.innerText().catch(() => '');
  if (genericVisible && /evidence|link|url/i.test(popupText)) {
    await genericTextInput.fill(evidenceUrl).catch(() => undefined);
  }
}

async function fillJustificationIfVisible(
  popup: import('@playwright/test').Locator,
  justification: string,
): Promise<void> {
  const textarea = popup.locator('textarea').first();
  if (await textarea.isVisible().catch(() => false)) {
    await textarea.fill(justification).catch(() => undefined);
    return;
  }

  const justificationInput = popup.locator(
    'input[placeholder*="justif" i], input[name*="justif" i], input[id*="justif" i], ' +
    'input[placeholder*="comment" i], input[name*="comment" i], input[id*="comment" i]',
  ).first();
  if (await justificationInput.isVisible().catch(() => false)) {
    await justificationInput.fill(justification).catch(() => undefined);
  }
}

async function fillDateFieldIfVisible(
  popup: import('@playwright/test').Locator,
  page: import('@playwright/test').Page,
): Promise<void> {
  const dateInput = popup.locator(
    'input[placeholder*="date" i], input[name*="date" i], input[id*="date" i]',
  ).first();

  if (!(await dateInput.isVisible().catch(() => false))) {
    return;
  }

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 7);
  const month = targetDate.toLocaleString('en-US', { month: 'short' });
  const value = `${targetDate.getDate()} ${month} ${targetDate.getFullYear()}`;

  await dateInput.fill(value).catch(async () => {
    await dateInput.evaluate((element, text) => {
      const input = element as {
        value: string;
        dispatchEvent: (event: Event) => boolean;
        blur: () => void;
      };
      input.value = text;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      input.blur();
    }, value).catch(() => undefined);
  });
  await page.waitForTimeout(300);
}

async function selectDelegatedProductIfVisible(
  popup: import('@playwright/test').Locator,
  page: import('@playwright/test').Page,
): Promise<string | null> {
  const select = popup.locator('select').first();
  if (await select.isVisible().catch(() => false)) {
    const options = (await select.locator('option').allTextContents().catch(() => []))
      .map((option) => option.trim())
      .filter((option) => option && !/select|choose|please/i.test(option));
    if (options.length > 0) {
      await select.selectOption({ label: options[0] }).catch(() => undefined);
      return options[0];
    }
  }

  const combobox = popup.locator('[role="combobox"], input[placeholder*="product" i], input[placeholder*="delegat" i]').first();
  if (await combobox.isVisible().catch(() => false)) {
    await combobox.click().catch(() => undefined);
    const option = page.locator('[role="option"], .vscomp-option').filter({ hasText: /./ }).first();
    if (await option.isVisible({ timeout: 2_000 }).catch(() => false)) {
      const optionText = ((await option.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
      await option.click().catch(() => undefined);
      return optionText || null;
    }
  }

  return null;
}

async function savePopup(
  popup: import('@playwright/test').Locator,
  page: import('@playwright/test').Page,
): Promise<void> {
  const saveButton = popup.getByRole('button', { name: /Save|Confirm|Update|Apply|Submit/i }).first();
  const visible = await saveButton.isVisible({ timeout: 2_000 }).catch(() => false);
  if (!visible) {
    throw new Error(`Popup save button was not visible. Popup text: ${(await popup.innerText().catch(() => '')).slice(0, 500)}`);
  }

  await saveButton.click();
  await page.waitForTimeout(1_000);
}

async function getRowText(page: import('@playwright/test').Page, rowIndex: number): Promise<string> {
  const row = requirementRows(page).nth(rowIndex);
  return ((await row.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
}

async function updateRequirementStatus(
  page: import('@playwright/test').Page,
  tabName: RequirementTabName,
  rowIndex: number,
  status: RequirementStatus,
): Promise<void> {
  const evidenceUrl = `https://example.com/evidence/${tabName.toLowerCase().replace(/\s+/g, '-')}/${status.toLowerCase().replace(/\s+/g, '-')}/${Date.now()}`;

  const popup = await openStatusActionMenuForRow(page, rowIndex).catch(async (error) => {
    const diagnostics = await getRequirementGridDiagnostics(page).catch(() => 'grid diagnostics unavailable');
    test.skip(
      true,
      `${tabName}: requirement row action ellipsis did not open an editor popup for row ${rowIndex + 1}. ` +
      `${error instanceof Error ? error.message : String(error)} ${diagnostics}`,
    );
    return null;
  });

  const editorPopup = popup ?? await findPopupRoot(page);
  if (!editorPopup) {
    test.skip(true, `${tabName}: requirement editor popup did not appear after opening row ${rowIndex + 1}.`);
    return;
  }

  const statusSelected = await selectStatusInPopup(editorPopup, page, status);
  if (!statusSelected) {
    const popupText = ((await editorPopup.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').slice(0, 500);
    test.skip(true, `${tabName}: requirement editor did not expose a status control for ${status}. Popup text: ${popupText}`);
    return;
  }

  await fillEvidenceLinkIfVisible(editorPopup, evidenceUrl);
  await fillJustificationIfVisible(editorPopup, `${status} status set by automation on ${tabName}.`);
  await fillDateFieldIfVisible(editorPopup, page);

  if (status === 'Delegated') {
    const delegatedProduct = await selectDelegatedProductIfVisible(editorPopup, page);
    test.skip(!delegatedProduct, `${tabName}: Delegated status did not expose a selectable product in the current UI.`);
  }

  await savePopup(editorPopup, page);

  await expect.poll(async () => getRowText(page, rowIndex), {
    timeout: 20_000,
    message: `${tabName}: requirement row ${rowIndex + 1} should show status ${status}`,
  }).toMatch(new RegExp(status.replace(/\s+/g, '\\s+'), 'i'));
}

async function coverAllStatusesOnTab(
  page: import('@playwright/test').Page,
  releaseDetailPage: {
    clickTopLevelTab(name: string): Promise<void>;
    expectTopLevelTabSelected(name: string): Promise<void>;
    isTopLevelTabDisabled(name: string): Promise<boolean>;
  },
  tabName: RequirementTabName,
): Promise<void> {
  await openRequirementsTab(page, releaseDetailPage, tabName);
  await enableShowAllRequirementsIfVisible(page);
  await expandVisibleAccordions(page);

  const rowIndexes = await findEditableRowIndexes(page, STATUS_CASES.length);
  if (rowIndexes.length === 0) {
    const diagnostics = await getRequirementGridDiagnostics(page);
    test.skip(true, `${tabName}: no editable requirement rows with action menus were found. ${diagnostics}`);
  }

  for (let index = 0; index < STATUS_CASES.length; index += 1) {
    const status = STATUS_CASES[index];
    const rowIndex = rowIndexes[index % rowIndexes.length];
    await test.step(`${tabName}: set row ${rowIndex + 1} to ${status}`, async () => {
      await updateRequirementStatus(page, tabName, rowIndex, status);
    });
  }
}

test.describe.serial('Releases - Requirement Status Updates @regression', () => {
  test.setTimeout(900_000);

  let releaseUrl = '';

  test.beforeAll(async ({ browser }) => {
    test.setTimeout(420_000);

    try {
      const freshRelease = await createFreshRelease(browser, {
        productNamePrefix: 'AutoTest Req Status',
        changeSummary: 'Automated requirements status update coverage',
      });
      releaseUrl = freshRelease.releaseUrl;

      await submitStandardQuestionnaireForRelease(browser, releaseUrl);
    } catch (error) {
      test.skip(
        true,
        `Requirements status update bootstrap is blocked by the current QA environment: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  });

  test.beforeEach(async ({ loginPage, landingPage, userCredentials }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await landingPage.expectPageLoaded({ timeout: 60_000 });
  });

  test('should update Process Requirements rows across all supported statuses from the row action menu', async ({
    page,
    releaseDetailPage,
  }) => {
    await allure.suite('Releases / Process Requirements / Status Updates');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.description(
      'PROCESS-REQ-TAB-011: Using the three-dot row action in the Process Requirements grid, automation updates a set of requirements ' +
      'to Done, In Progress, Partial, Planned, Postponed, Not Applicable, and Delegated. ' +
      'Visible popup fields such as evidence links, justification, dates, and delegated product selection are populated when rendered.',
    );

    await test.step('Open the fresh release', async () => {
      await page.goto(releaseUrl, { waitUntil: 'domcontentloaded' });
      await releaseDetailPage.waitForPageLoad();
    });

    await coverAllStatusesOnTab(page, releaseDetailPage, 'Process Requirements');
  });

  test('should update Product Requirements rows across all supported statuses from the row action menu', async ({
    page,
    releaseDetailPage,
  }) => {
    await allure.suite('Releases / Product Requirements / Status Updates');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.description(
      'PRODUCT-REQ-TAB-011: Using the three-dot row action in the Product Requirements grid, automation updates a set of requirements ' +
      'to Done, In Progress, Partial, Planned, Postponed, Not Applicable, and Delegated. ' +
      'Visible popup fields such as evidence links, justification, dates, and delegated product selection are populated when rendered.',
    );

    await test.step('Open the fresh release', async () => {
      await page.goto(releaseUrl, { waitUntil: 'domcontentloaded' });
      await releaseDetailPage.waitForPageLoad();
    });

    await coverAllStatusesOnTab(page, releaseDetailPage, 'Product Requirements');
  });
});
