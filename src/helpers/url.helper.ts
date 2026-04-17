/**
 * URL construction helpers
 *
 * Builds absolute URLs from relative paths using the configured environment base URL.
 * For `page.goto()` calls inside Playwright tests, prefer relative paths directly
 * (Playwright resolves them against `baseURL` from config).
 *
 * Use `buildUrl()` only when you need a full absolute URL outside of `page.goto()`,
 * e.g. when constructing URLs from href attributes or comparing against full URLs.
 */

import { getEnvironment } from '../../config/environments';

const env = getEnvironment();

/** Build an absolute URL from a relative path using the current environment base URL. */
export function buildUrl(relativePath: string): string {
  const base = (process.env.BASE_URL || env.baseUrl).replace(/\/+$/, '');
  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  return `${base}${path}`;
}

/** The configured base URL for the current environment. */
export const BASE_URL = process.env.BASE_URL || env.baseUrl;
