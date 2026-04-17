import { type Page } from '@playwright/test';
import { getDefaultUser } from '../../config/users';
import { waitForOSScreenLoad } from './wait.helper';

/**
 * Navigate to a URL, re-authenticating inline if the server-side session has expired.
 *
 * OutSystems server sessions expire independently of browser cookies.
 * After page.goto() resolves, a client-side AJAX check may detect the expired
 * session and redirect to the login page asynchronously (typically 2-10 s after
 * page load). This helper detects the redirect by watching for a URL change
 * to the Login page.
 */
export async function navigateWithSessionGuard(page: Page, targetUrl: string): Promise<void> {
  await page.goto(targetUrl);

  // Immediate check: server-side 302 redirect already landed on Login
  if (/Login/i.test(page.url())) {
    await reAuthenticate(page, targetUrl);
    return;
  }

  // Async check: OutSystems JS session validation may redirect to Login
  // after an AJAX round-trip completes (typically 2-10 s after page load).
  const redirectedToLogin = await page
    .waitForURL(/Login/i, { timeout: 15_000 })
    .then(() => true)
    .catch(() => false);

  if (redirectedToLogin) {
    await reAuthenticate(page, targetUrl);
    return;
  }

  await waitForOSScreenLoad(page);
}

async function reAuthenticate(page: Page, targetUrl: string): Promise<void> {
  const loginField = page.locator('#Input_UsernameVal');
  await loginField.waitFor({ state: 'visible', timeout: 30_000 });

  const user = getDefaultUser();
  await loginField.fill(user.login);
  await page.locator('#Input_PasswordVal').fill(user.password);
  await page.getByRole('button', { name: 'Login' }).first().click();

  await page.waitForURL((url) => !/Login/i.test(url.pathname), { timeout: 60_000 });
  await waitForOSScreenLoad(page);

  // Re-navigate to the original target (login lands on landing page)
  await page.goto(targetUrl);
  await waitForOSScreenLoad(page);
}
