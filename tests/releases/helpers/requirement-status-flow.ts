/* eslint-disable playwright/no-wait-for-timeout */
import { expect, test } from '@playwright/test';

const REVIEW_READY_STATUS = 'Not Applicable';
const REQUIREMENT_STATUS_PATTERN = /(planned|done|in progress|partial|postponed|not applicable|delegated)/i;

type RequirementTabName = 'Process Requirements' | 'Product Requirements';
type RequirementStatus = typeof REVIEW_READY_STATUS;

type ReleaseRequirementsPage = {
  clickTopLevelTab(name: string): Promise<void>;
  expectTopLevelTabSelected(name: string): Promise<void>;
  isTopLevelTabDisabled(name: string): Promise<boolean>;
};

type ActionCandidate = {
  index: number;
  score: number;
};

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function requirementRows(page: import('@playwright/test').Page) {
  return page.getByRole('grid').getByRole('row');
}

function getStatusCellForRow(row: import('@playwright/test').Locator) {
  return row
    .locator('[role="gridcell"], td')
    .filter({ hasText: new RegExp(`${REQUIREMENT_STATUS_PATTERN.source}\\s*?`, 'i') })
    .first();
}

function getStatusIconForRow(row: import('@playwright/test').Locator) {
  return getStatusCellForRow(row)
    .locator('text=/[⋮︙]|\.\.\./')
    .first();
}

function getStatusTriggerForRow(row: import('@playwright/test').Locator) {
  return row.locator(
    '[data-block*="EditStatus_Optimised"] .popover-top, ' +
    '[data-block*="EditStatus_Optimised"] [data-popover], ' +
    '[data-block*="EditStatus_Optimised"] [role="button"], ' +
    '[data-block*="EditStatus_Optimised"] button',
  ).first();
}

function getRequirementActionCellForRow(row: import('@playwright/test').Locator) {
  return row.locator('[role="gridcell"], td').last();
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

function getRequirementActionIconForRow(row: import('@playwright/test').Locator) {
  return getRequirementActionCellForRow(row)
    .locator('text=/[⋮︙]|\.\.\./')
    .first();
}

function getActionMenuItem(
  scope: import('@playwright/test').Page | import('@playwright/test').Locator,
  label: RegExp,
) {
  return scope.locator('button, [role="menuitem"], [role="option"], a, li, div, span').filter({ hasText: label }).first();
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

async function openRequirementsTab(
  page: import('@playwright/test').Page,
  releaseDetailPage: ReleaseRequirementsPage,
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

async function expandRequirementGroupRows(page: import('@playwright/test').Page): Promise<void> {
  const rows = requirementRows(page);
  const count = Math.min(await rows.count().catch(() => 0), 20);

  for (let index = 0; index < count; index += 1) {
    const row = rows.nth(index);
    const visible = await row.isVisible().catch(() => false);
    if (!visible) {
      continue;
    }

    const rowText = ((await row.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
    if (!rowText || /^REQUIREMENT DESCRIPTION\b/i.test(rowText) || REQUIREMENT_STATUS_PATTERN.test(rowText)) {
      continue;
    }

    const firstCell = row.locator('[role="gridcell"], td').first();
    const triggers = [
      firstCell.locator('button, [role="button"], a, .fa, [class*="icon"]').first(),
      row.locator('button, [role="button"], a, .fa, [class*="icon"]').first(),
      firstCell.getByText(new RegExp(escapeRegex(rowText), 'i')).first(),
      firstCell,
      row,
    ];

    for (const trigger of triggers) {
      const triggerVisible = await trigger.isVisible().catch(() => false);
      if (!triggerVisible) {
        continue;
      }

      await trigger.scrollIntoViewIfNeeded().catch(() => undefined);
      await trigger.click({ force: true }).catch(() => undefined);
      await page.keyboard.press('Escape').catch(() => undefined);
      await page.waitForTimeout(400);

      const statusRowsVisible = await rows
        .filter({ hasText: REQUIREMENT_STATUS_PATTERN })
        .count()
        .catch(() => 0);
      if (statusRowsVisible > 0) {
        return;
      }
    }
  }
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
  desiredCount: number,
): Promise<number[]> {
  const rows = requirementRows(page);
  const count = await rows.count().catch(() => 0);
  const indexes: number[] = [];

  for (let index = 0; index < Math.min(count, 30) && indexes.length < desiredCount; index += 1) {
    const row = rows.nth(index);
    const visible = await row.isVisible().catch(() => false);
    if (!visible) {
      continue;
    }

    const rowText = ((await row.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
    if (!rowText || /^(Process|Product|Status|Actions|Requirement Name|Name)$/i.test(rowText)) {
      continue;
    }

    if (/\bNot Applicable\b/i.test(rowText)) {
      continue;
    }

    const statusTriggerVisible = await getStatusTriggerForRow(row).isVisible().catch(() => false);
    if (statusTriggerVisible && REQUIREMENT_STATUS_PATTERN.test(rowText)) {
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
    const actionCandidateCount = (await getRowActionCandidates(row).catch(() => [])).length;
    const text = ((await row.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim().slice(0, 180);

    rowSummaries.push(
      `row${index + 1}{visible=${visible},statusTrigger=${statusTriggerVisible},actionCandidates=${actionCandidateCount},text="${text}"}`,
    );
  }

  return `url=${page.url()}; matchedRows=${totalRows}; ${rowSummaries.join(' | ')}`;
}

async function clickRowEllipsisViaDom(
  row: import('@playwright/test').Locator,
  target: 'action' | 'status',
): Promise<boolean> {
  return row.evaluate((element, clickTarget) => {
    type DomNode = {
      textContent?: string | null;
      querySelectorAll?: (selector: string) => ArrayLike<DomNode>;
      getBoundingClientRect(): { width: number; height: number };
      dispatchEvent(event: unknown): boolean;
    };
    const browserGlobal = globalThis as unknown as {
      getComputedStyle(node: DomNode): { display: string; visibility: string };
      MouseEvent: new (type: string, init?: Record<string, unknown>) => unknown;
    };
    const isVisible = (node: DomNode) => {
      const style = browserGlobal.getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && rect.width > 0
        && rect.height > 0;
    };

    const cells = Array.from(element.querySelectorAll('[role="gridcell"], td')) as DomNode[];
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

    const iconCandidates = [candidateCell, ...Array.from(candidateCell.querySelectorAll?.('*') ?? [])]
      .filter((node) => isVisible(node) && /[⋮︙]|\.\.\./.test((node.textContent || '').trim()));
    const clickable = iconCandidates[iconCandidates.length - 1] || candidateCell;

    clickable.dispatchEvent(new browserGlobal.MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    clickable.dispatchEvent(new browserGlobal.MouseEvent('mouseup', { bubbles: true, cancelable: true }));
    clickable.dispatchEvent(new browserGlobal.MouseEvent('click', { bubbles: true, cancelable: true }));

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

    const statusMenu = await findStatusMenuRoot(page);
    if (statusMenu) {
      return statusMenu;
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

    const statusMenu = await findStatusMenuRoot(page);
    if (statusMenu) {
      return statusMenu;
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

    const statusMenu = await findStatusMenuRoot(page);
    if (statusMenu) {
      return statusMenu;
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

    const statusMenu = await findStatusMenuRoot(page);
    if (statusMenu) {
      return statusMenu;
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

    const statusMenu = await findStatusMenuRoot(page);
    if (statusMenu) {
      return statusMenu;
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

    const statusMenu = await findStatusMenuRoot(page);
    if (statusMenu) {
      return statusMenu;
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

  return null;
}

async function selectStatusInPopup(
  popup: import('@playwright/test').Locator,
  page: import('@playwright/test').Page,
  status: RequirementStatus,
): Promise<boolean> {
  const statusPattern = new RegExp(`^${escapeRegex(status)}(?:\\b|\\s*-)`, 'i');
  const domClicked = await popup.evaluate((element, targetStatus) => {
    const normalize = (value: string | null | undefined) => (value || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const target = normalize(targetStatus);
    type DomNode = {
      textContent?: string | null;
      getBoundingClientRect(): { width: number; height: number };
      dispatchEvent(event: unknown): boolean;
    };
    const browserGlobal = globalThis as unknown as {
      getComputedStyle(node: DomNode): { display: string; visibility: string };
      MouseEvent: new (type: string, init?: Record<string, unknown>) => unknown;
    };
    const isVisible = (node: DomNode) => {
      const style = browserGlobal.getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && rect.width > 0
        && rect.height > 0;
    };

    const candidates = [element, ...Array.from(element.querySelectorAll('button, [role="button"], [role="menuitem"], [role="option"], li, span, div'))] as DomNode[];
    const visibleCandidates = candidates
      .filter((candidate) => isVisible(candidate) && normalize(candidate.textContent).includes(target))
      .sort((left, right) => normalize(left.textContent).length - normalize(right.textContent).length);
    const match = visibleCandidates.find((candidate) => normalize(candidate.textContent) === target) || visibleCandidates[0];
    if (!match) {
      return false;
    }

    match.dispatchEvent(new browserGlobal.MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    match.dispatchEvent(new browserGlobal.MouseEvent('mouseup', { bubbles: true, cancelable: true }));
    match.dispatchEvent(new browserGlobal.MouseEvent('click', { bubbles: true, cancelable: true }));
    return true;
  }, status).catch(() => false);

  if (domClicked) {
    await page.waitForTimeout(500);
    return true;
  }

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

  const textChoice = popup.getByText(statusPattern).first();
  if (await textChoice.isVisible({ timeout: 1_000 }).catch(() => false)) {
    await textChoice.click().catch(() => undefined);
    return true;
  }

  const directChoice = popup
    .locator('button, [role="button"], [role="menuitem"], [role="option"], label, span, div')
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

async function savePopup(
  popup: import('@playwright/test').Locator,
  page: import('@playwright/test').Page,
): Promise<void> {
  const saveButton = popup.getByRole('button', { name: /Save|Confirm|Update|Apply|Submit/i }).first();
  const visible = await saveButton.isVisible({ timeout: 2_000 }).catch(() => false);
  if (!visible) {
    const popupText = await popup.innerText().catch(() => '');
    if (/Done|In Progress|Partial|Planned|Postponed|Not Applicable|Delegated/i.test(popupText)) {
      return;
    }

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
): Promise<boolean> {
  const evidenceUrl = `https://example.com/evidence/${tabName.toLowerCase().replace(/\s+/g, '-')}/${Date.now()}`;
  const popup = await openStatusActionMenuForRow(page, rowIndex);

  if (!popup) {
    return false;
  }

  const statusSelected = await selectStatusInPopup(popup, page, status);
  if (!statusSelected) {
    await page.keyboard.press('Escape').catch(() => undefined);
    return false;
  }

  await fillEvidenceLinkIfVisible(popup, evidenceUrl);
  await fillJustificationIfVisible(popup, `${status} status set by WF6 Manage pre-req automation on ${tabName}.`);
  await savePopup(popup, page);

  const statusApplied = await expect.poll(async () => getRowText(page, rowIndex), {
    timeout: 20_000,
    message: `${tabName}: requirement row ${rowIndex + 1} should show status ${status}`,
  }).toMatch(new RegExp(status.replace(/\s+/g, '\\s+'), 'i'))
    .then(() => true)
    .catch(() => false);

  return statusApplied;
}

export async function markRequirementsReviewReady(
  page: import('@playwright/test').Page,
  releaseDetailPage: ReleaseRequirementsPage,
  tabName: RequirementTabName,
  maxRows = 12,
): Promise<number> {
  await openRequirementsTab(page, releaseDetailPage, tabName);
  await enableShowAllRequirementsIfVisible(page);
  await expandVisibleAccordions(page);
  await expandRequirementGroupRows(page);

  const rowIndexes = await findEditableRowIndexes(page, maxRows);
  if (rowIndexes.length === 0) {
    return 0;
  }

  let updatedCount = 0;
  for (const rowIndex of rowIndexes) {
    const updated = await updateRequirementStatus(page, tabName, rowIndex, REVIEW_READY_STATUS);
    if (updated) {
      updatedCount += 1;
    }
  }

  if (updatedCount === 0) {
    const diagnostics = await getRequirementGridDiagnostics(page).catch(() => 'grid diagnostics unavailable');
    test.info().annotations.push({
      type: 'wf6-requirement-status-prep',
      description: `${tabName}: no editable requirement rows were updated. ${diagnostics}`,
    });
  }

  return updatedCount;
}
