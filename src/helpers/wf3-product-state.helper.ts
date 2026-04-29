import * as fs from 'fs';
import * as path from 'path';

const WF3_PRODUCT_STATE_FILE = path.resolve(__dirname, '../../.wf3-product-state.json');

export interface WF3ProductState {
  dataProtectionEnabled?: boolean;
  productName: string;
  productUrl: string;
  releaseCreationProduct?: {
    productName: string;
    productUrl: string;
  };
  releaseVersion: string;
  releaseUrl: string;
  trackingTools: {
    jiraFieldsVerified: boolean;
    jiraProjectKey: string;
    jiraSourceLink: string;
    jamaFieldsVerified: boolean;
    jamaProjectId: string;
  };
}

export function readWF3ProductState(): WF3ProductState {
  if (!fs.existsSync(WF3_PRODUCT_STATE_FILE)) {
    throw new Error(
      `WF3 product state file not found at "${WF3_PRODUCT_STATE_FILE}". ` +
      'Run the "wf3-pre-req" Playwright project before executing WF3 specs that need deterministic product/release data.',
    );
  }

  const raw = fs.readFileSync(WF3_PRODUCT_STATE_FILE, 'utf-8');
  return JSON.parse(raw) as WF3ProductState;
}

export function writeWF3ProductState(state: WF3ProductState): void {
  fs.mkdirSync(path.dirname(WF3_PRODUCT_STATE_FILE), { recursive: true });
  fs.writeFileSync(WF3_PRODUCT_STATE_FILE, JSON.stringify(state, null, 2));
}
