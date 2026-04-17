import { test as setup, expect } from '../../src/fixtures';
import path from 'path';

const AUTH_FILE = path.join(__dirname, '../../.auth/user.json');

setup('authenticate', async ({ page, loginPage, landingPage, userCredentials }) => {
  setup.setTimeout(120_000);

  await loginPage.goto();
  await loginPage.waitForPageLoad();
  await loginPage.login(userCredentials.login, userCredentials.password);

  // Wait until landing page is confirmed — proves auth succeeded
  await landingPage.expectPageLoaded({ timeout: 60_000 });

  // Persist auth state to disk for reuse across all test projects
  await page.context().storageState({ path: AUTH_FILE });
});
