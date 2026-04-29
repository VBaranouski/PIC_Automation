import { test as base } from '@playwright/test';
import { getUser, getDefaultUser } from '../../config/users';
import type { UserCredentials, UserRole } from '../../config/users/user.types';
import type { DisposableProduct, DisposableRelease } from '../helpers/disposable-test-data.helper';
import { LoginPage, LandingPage, NewProductPage, DocDetailsPage, ControlDetailPage, ReleaseDetailPage } from '../pages';
import {
  createDisposableProduct,
  createDisposableRelease,
} from '../helpers/disposable-test-data.helper';

type CustomFixtures = {
  /** Credentials for the current test role (from TEST_ROLE env var, defaults to 'admin') */
  userCredentials: UserCredentials;
  /** Get credentials for a specific role */
  getUserByRole: (role: UserRole) => UserCredentials;
  /** LoginPage instance */
  loginPage: LoginPage;
  /** LandingPage instance */
  landingPage: LandingPage;
  /** NewProductPage instance */
  newProductPage: NewProductPage;
  /** DocDetailsPage instance */
  docDetailsPage: DocDetailsPage;
  /** ControlDetailPage instance */
  controlDetailPage: ControlDetailPage;
  /** ReleaseDetailPage instance */
  releaseDetailPage: ReleaseDetailPage;
  /** Fresh automation-created product that can be safely mutated by the current test */
  disposableProduct: DisposableProduct;
  /** Fresh automation-created release that can be safely mutated by the current test */
  disposableRelease: DisposableRelease;
};

export const test = base.extend<CustomFixtures>({

  userCredentials: async ({}, use) => {
    await use(getDefaultUser());
  },

  getUserByRole: async ({}, use) => {
    await use((role: UserRole) => getUser(role));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  landingPage: async ({ page }, use) => {
    await use(new LandingPage(page));
  },

  newProductPage: async ({ page }, use) => {
    await use(new NewProductPage(page));
  },

  docDetailsPage: async ({ page }, use) => {
    await use(new DocDetailsPage(page));
  },

  controlDetailPage: async ({ page }, use) => {
    await use(new ControlDetailPage(page));
  },

  releaseDetailPage: async ({ page }, use) => {
    await use(new ReleaseDetailPage(page));
  },

  disposableProduct: async ({ page, newProductPage }, use) => {
    const product = await createDisposableProduct(page, newProductPage);
    await use(product);
  },

  disposableRelease: async ({ page, newProductPage, releaseDetailPage, disposableProduct }, use) => {
    const release = await createDisposableRelease(page, newProductPage, releaseDetailPage, disposableProduct);
    await use(release);
  },
});

export { expect } from '@playwright/test';
