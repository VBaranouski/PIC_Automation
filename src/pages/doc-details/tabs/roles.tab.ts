import { type Page, expect } from '@playwright/test';
import { waitForOSScreenLoad } from '@helpers/wait.helper';
import type { DocDetailsLocators } from '@locators/doc-details.locators';

export class RolesTab {
  constructor(
    private readonly page: Page,
    private readonly l: DocDetailsLocators,
  ) {}

  private async waitForOSLoad(): Promise<void> {
    await waitForOSScreenLoad(this.page);
  }

  async clickRolesResponsibilitiesTab(): Promise<void> {
    await this.waitForOSLoad();

    const rolesVisible = await this.l.rolesGrid.isVisible().catch(() => false);
    const editRolesVisible = await this.l.editRolesButton.isVisible().catch(() => false);
    const saveRolesVisible = await this.l.saveRolesChangesButton.isVisible().catch(() => false);
    if (rolesVisible && (editRolesVisible || saveRolesVisible)) {
      return;
    }

    await this.l.rolesResponsibilitiesTab.waitFor({ state: 'visible', timeout: 30_000 });
    for (let attempt = 1; attempt <= 3; attempt++) {
      await this.l.rolesResponsibilitiesTab.click({ force: attempt > 1 });
      await this.waitForOSLoad();

      if (await this.l.rolesGrid.isVisible().catch(() => false)) {
        return;
      }
    }

    await this.l.rolesGrid.waitFor({ state: 'visible', timeout: 30_000 });
  }

  async expectRolesGridVisible(): Promise<void> {
    await expect(this.l.rolesGrid).toBeVisible({ timeout: 30_000 });
  }

  async expectRolesGridColumnHeaders(): Promise<void> {
    const expected = ['USER ROLE', 'TEAM MEMBERS', 'EMAIL', 'LOCATION'];
    for (const header of expected) {
      await expect(this.l.rolesGrid.locator('th').filter({ hasText: header })).toBeVisible({ timeout: 15_000 });
    }
  }

  async expectRolesRowPresent(roleName: string | RegExp): Promise<void> {
    await expect(this.l.rolesGrid.locator('tr').filter({ hasText: roleName }).first()).toBeVisible({ timeout: 15_000 });
  }

  async expectAllRoleRowsPresent(): Promise<void> {
    const requiredRoles = [
      'IT Owner',
      'Project Manager',
      'Product Owner',
      /Security (and Data Protection )?Advisor/,
    ];
    const optionalRoles = [
      'BU Security Officer',
      'CISO',
      'Digital Offer Certification Lead',
      'Digital Risk Lead',
      'Business Vice President',
      'Senior Business Vice President',
    ];
    for (const role of requiredRoles) {
      await this.expectRolesRowPresent(role);
    }

    for (const role of optionalRoles) {
      const isVisible = await this.l.rolesGrid.locator('tr').filter({ hasText: role }).first().isVisible().catch(() => false);
      if (isVisible) {
        await this.expectRolesRowPresent(role);
      }
    }
  }

  async expectEditRolesButtonVisible(): Promise<void> {
    await expect(this.l.editRolesButton).toBeVisible({ timeout: 15_000 });
  }

  async clickEditRoles(): Promise<void> {
    await this.l.editRolesButton.waitFor({ state: 'visible', timeout: 15_000 });
    await this.l.editRolesButton.click();
    await this.waitForOSLoad();
  }

  async expectSaveRolesChangesButtonDisabled(): Promise<void> {
    await expect(this.l.saveRolesChangesButton).toBeDisabled({ timeout: 15_000 });
  }

  async clickCancelRoles(): Promise<void> {
    await this.l.cancelRolesButton.click();
    await this.waitForOSLoad();
  }

  async expectEditModeUserLookupVisible(): Promise<void> {
    await expect(this.l.rolesEditModeInput).toBeVisible({ timeout: 15_000 });
  }

  async expectRolesGridColumnsVisible(): Promise<void> {
    await expect(this.l.rolesGrid).toBeVisible({ timeout: 15_000 });
    await expect(this.l.rolesGrid.getByRole('columnheader', { name: /User Role/i })).toBeVisible({ timeout: 10_000 });
    await expect(this.l.rolesGrid.getByRole('columnheader', { name: /Team Members/i })).toBeVisible({ timeout: 10_000 });
  }

  async expectRolesResponsibilitiesTabClickable(): Promise<void> {
    await expect(this.l.rolesResponsibilitiesTab).toBeVisible({ timeout: 30_000 });
    await expect(this.l.rolesResponsibilitiesTab).toBeEnabled();
  }

  async isEditRolesButtonVisible(): Promise<boolean> {
    return this.l.editRolesButton.isVisible().catch(() => false);
  }

  async isSaveRolesChangesDisabled(): Promise<boolean> {
    return this.l.saveRolesChangesButton.isDisabled().catch(() => false);
  }

  async expectSaveRolesChangesButtonVisible(): Promise<void> {
    await expect(this.l.saveRolesChangesButton).toBeVisible({ timeout: 15_000 });
  }

  async getRolesTeamMembersText(roleName: string): Promise<string> {
    const row = this.l.rolesGrid.locator('tr').filter({ hasText: roleName }).first();
    await expect(row).toBeVisible({ timeout: 15_000 });
    const teamMembersCell = row.locator('td').nth(1);
    return (await teamMembersCell.textContent())?.trim() ?? '';
  }

  async clickSaveRoles(): Promise<void> {
    await this.l.saveRolesChangesButton.waitFor({ state: 'visible', timeout: 15_000 });
    await this.l.saveRolesChangesButton.click();
    await this.waitForOSLoad();
  }
}
