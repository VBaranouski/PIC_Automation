import * as fs from 'fs';
import * as path from 'path';

const WF6_MANAGE_RELEASE_STATE_FILE = path.resolve(__dirname, '../../.wf6-manage-release-state.json');

export interface WF6ManageReleaseState {
  productName: string;
  productUrl: string;
  releaseVersion: string;
  releaseUrl: string;
  activeStage: string;
}

export function readWF6ManageReleaseState(): WF6ManageReleaseState {
  if (!fs.existsSync(WF6_MANAGE_RELEASE_STATE_FILE)) {
    throw new Error(
      `WF6 manage release state file not found at "${WF6_MANAGE_RELEASE_STATE_FILE}". ` +
      'Run the "wf6-manage-pre-req" Playwright project before executing WF6 specs that need deterministic Manage-stage release data.',
    );
  }

  const raw = fs.readFileSync(WF6_MANAGE_RELEASE_STATE_FILE, 'utf-8');
  return JSON.parse(raw) as WF6ManageReleaseState;
}

export function tryReadWF6ManageReleaseState(): WF6ManageReleaseState | null {
  if (!fs.existsSync(WF6_MANAGE_RELEASE_STATE_FILE)) {
    return null;
  }

  return readWF6ManageReleaseState();
}

export function writeWF6ManageReleaseState(state: WF6ManageReleaseState): void {
  fs.mkdirSync(path.dirname(WF6_MANAGE_RELEASE_STATE_FILE), { recursive: true });
  fs.writeFileSync(WF6_MANAGE_RELEASE_STATE_FILE, JSON.stringify(state, null, 2));
}
