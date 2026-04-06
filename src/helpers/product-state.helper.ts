import * as fs from 'fs';
import * as path from 'path';

/**
 * Path to the persisted product-with-releases state JSON.
 * Written by create-new-release.spec.ts (RELEASE-CREATE-002) after a release
 * is successfully created, so that downstream tests can reference a known
 * product URL without re-creating one every run.
 */
const PRODUCT_STATE_FILE = path.resolve(__dirname, '../../.product-state.json');

export interface ProductState {
  /** Full URL of a Product Detail page that has at least one release. */
  productWithReleasesUrl: string;
  /** Display name of that product (for logging purposes). */
  productName: string;
}

/**
 * Reads the persisted product state from disk.
 * Throws a descriptive error if the file does not exist so that a missing
 * create-new-release run produces an actionable message.
 */
export function readProductState(): ProductState {
  if (!fs.existsSync(PRODUCT_STATE_FILE)) {
    throw new Error(
      `Product state file not found at "${PRODUCT_STATE_FILE}". ` +
      'Run the "create-new-release" spec (RELEASE-CREATE-002) before running ' +
      'PRODUCT-RELEASES-001, or ensure a prior test run has persisted the state.',
    );
  }
  const raw = fs.readFileSync(PRODUCT_STATE_FILE, 'utf-8');
  return JSON.parse(raw) as ProductState;
}

/**
 * Writes product state to disk.
 * Called from create-new-release.spec.ts after a release is successfully created.
 */
export function writeProductState(state: ProductState): void {
  fs.mkdirSync(path.dirname(PRODUCT_STATE_FILE), { recursive: true });
  fs.writeFileSync(PRODUCT_STATE_FILE, JSON.stringify(state, null, 2));
}
