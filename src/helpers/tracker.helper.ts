/**
 * Test Scenario Tracker — Playwright Integration Helper
 *
 * Provides a hook that automatically skips tests whose scenario ID
 * is marked as `on-hold` in the tracker database.
 *
 * Usage in spec files:
 *   import { applyTrackerSkips } from '../../src/helpers/tracker.helper';
 *
 *   test.describe('My Suite', () => {
 *     applyTrackerSkips(test);   // auto-skips on-hold tests
 *     ...
 *   });
 *
 * Or use the pre-built fixture:
 *   import { test } from '../../src/fixtures';  // already includes tracker
 */

import path from 'path';
import fs from 'fs';
import type { TestType } from '@playwright/test';

// ── Lazy-loaded on-hold set (cached per process) ─────────────────────────────

let _onHoldIds: Set<string> | null = null;
let _trackerAvailable: boolean | null = null;

/**
 * Load on-hold IDs from the SQLite database.
 * Falls back gracefully if the DB doesn't exist or better-sqlite3 isn't available.
 */
function loadOnHoldIds(): Set<string> {
  if (_onHoldIds !== null) return _onHoldIds;

  try {
    // Check if DB file exists before attempting to load
    const dbPath = path.resolve(__dirname, '..', '..', 'config', 'scenarios.db');
    if (!fs.existsSync(dbPath)) {
      _onHoldIds = new Set();
      _trackerAvailable = false;
      return _onHoldIds;
    }

    // Dynamic import to avoid hard dependency on better-sqlite3 in test runner
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getOnHoldIds, closeDb } = require('../tracker/operations');
    _onHoldIds = getOnHoldIds() as Set<string>;
    closeDb();
    _trackerAvailable = true;
  } catch {
    // Tracker not available — no-op
    _onHoldIds = new Set();
    _trackerAvailable = false;
  }

  return _onHoldIds;
}

/**
 * Check if a test scenario ID is on hold.
 */
export function isOnHold(scenarioId: string): boolean {
  return loadOnHoldIds().has(scenarioId);
}

/**
 * Check if the tracker database is available.
 */
export function isTrackerAvailable(): boolean {
  if (_trackerAvailable === null) loadOnHoldIds();
  return _trackerAvailable!;
}

/**
 * Extract scenario IDs from a test title or allure description string.
 * Matches patterns like: AUTH-LOGIN-001, DOC-DETAIL-002, RELEASE-HEADER-010
 */
export function extractScenarioIds(text: string): string[] {
  const matches = text.match(/[A-Z][\w-]+-\d{2,}/g);
  return matches ? [...new Set(matches)] : [];
}

/**
 * Apply tracker-based auto-skip to a test suite.
 *
 * Call this inside a `test.describe()` block. It adds a `beforeEach` hook
 * that extracts scenario IDs from the test title and skips the test
 * if any ID is marked `on-hold` in the tracker DB.
 *
 * @example
 * test.describe('My Suite @smoke', () => {
 *   applyTrackerSkips(test);
 *
 *   test('AUTH-LOGIN-001: should login', async ({ page }) => { ... });
 * });
 */
export function applyTrackerSkips(testInstance: TestType<any, any>): void {
  testInstance.beforeEach(async ({}, testInfo) => {
    const onHold = loadOnHoldIds();
    if (onHold.size === 0) return;

    const ids = extractScenarioIds(testInfo.title);
    for (const id of ids) {
      if (onHold.has(id)) {
        testInstance.skip(true, `Scenario ${id} is ON HOLD in the tracker DB`);
        return;
      }
    }
  });
}
