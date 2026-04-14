/**
 * Test Scenario Tracker — HTML Plan Parser
 *
 * Parses the three embedded data blobs from automation-testing-plan.html
 * into a clean array of scenario records ready for DB insertion.
 *
 * Pure function: takes HTML string, returns ParsedPlan. No file I/O, no DB.
 */

import type {
  Scenario,
  AutomationState,
  ExecutionStatus,
  FeatureArea,
  Priority,
} from './models';

export interface ParsedPlan {
  scenarios: Array<Omit<Scenario, 'created_at' | 'updated_at' | 'groups' | 'description'>>;
  warnings: string[];
}

interface HtmlDetailEntry {
  title: string;
  spec_path?: string;
  steps?: string[];
  expected_results?: string[];
  execution_notes?: string;
}

function extractJsonBlob(html: string, id: string): string | null {
  const re = new RegExp(`<script\\s+id="${id}"[^>]*>([\\s\\S]*?)</script>`, 'i');
  const match = re.exec(html);
  return match ? match[1].trim() : null;
}

function extractObjectLiteral(html: string, varName: string): string | null {
  // Matches:  const VAR = { ... };  including multi-line, balanced to the matching brace.
  const startRe = new RegExp(`(?:const|let|var)\\s+${varName}\\s*=\\s*{`);
  const start = startRe.exec(html);
  if (!start) return null;
  const openIdx = html.indexOf('{', start.index + start[0].length - 1);
  let depth = 0;
  for (let i = openIdx; i < html.length; i++) {
    const ch = html[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return html.slice(openIdx, i + 1);
    }
  }
  return null;
}

function parseLooseObject<T = unknown>(text: string): T {
  // Converts single-quoted JS object literals into JSON by replacing
  // keys and string values. Used for AUTO_CASE_STATUS and SUBSECTION_INDEX.
  const jsonish = text
    .replace(/([\{,]\s*)([A-Za-z_][\w-]*)\s*:/g, '$1"$2":')  // keys: `key:` → `"key":`
    .replace(/'/g, '"')                                       // single → double quotes
    .replace(/,\s*([}\]])/g, '$1');                           // trailing commas
  return JSON.parse(jsonish) as T;
}

function normalizeSpecPath(raw: string | undefined): string {
  if (!raw) return '';
  let p = raw.replace(/^projects\/pw-autotest\//, '');
  if (!p.startsWith('tests/')) p = 'tests/' + p;
  return p;
}

function inferFeatureArea(id: string, specPath: string): FeatureArea {
  const idUp = id.toUpperCase();
  const spec = specPath.toLowerCase();
  if (idUp.startsWith('AUTH-')) return 'auth';
  if (idUp.startsWith('LANDING-')) return 'landing';
  if (idUp.startsWith('PRODUCT-') || spec.includes('products/')) return 'products';
  if (idUp.startsWith('DOC-') || idUp.startsWith('ATC-DOC-') || idUp.startsWith('REVIEW-CONFIRM-')) return 'doc';
  if (idUp.startsWith('RELEASE-') || idUp.startsWith('MANAGE-') || idUp.startsWith('CLONE-') || idUp.startsWith('ATC-REVIEW-CONFIRM-')) return 'releases';
  if (spec.includes('report') || spec.includes('tableau')) return 'reports';
  if (spec.includes('backoffice')) return 'backoffice';
  if (spec.includes('integration') || spec.includes('jira') || spec.includes('jama') || spec.includes('intel')) return 'integrations';
  return 'other';
}

function inferWorkflow(subsection: string, area: FeatureArea): string {
  // Use subsection's first number to pick a workflow name.
  const major = subsection.split('.')[0];
  const map: Record<string, string> = {
    '1': 'WORKFLOW 1 — Authentication',
    '2': 'WORKFLOW 2 — Landing Page & Home Navigation',
    '3': 'WORKFLOW 3 — Product Management',
    '4': 'WORKFLOW 4 — DOC Lifecycle',
    '5': 'WORKFLOW 5 — Review & Confirm',
    '6': 'WORKFLOW 6 — Release Management',
    '7': 'WORKFLOW 7 — Reports & Dashboards',
  };
  if (map[major]) return map[major];
  // Fallback: derive from feature area
  return `WORKFLOW — ${area.charAt(0).toUpperCase()}${area.slice(1)}`;
}

function inferPriority(id: string): Priority {
  const idUp = id.toUpperCase();
  if (idUp.includes('SMOKE') || idUp.startsWith('AUTH-LOGIN-') || idUp.startsWith('DOC-CREATE-')) return 'P1';
  if (idUp.endsWith('-001')) return 'P1';
  return 'P2';
}

export function parseHtmlPlan(html: string): ParsedPlan {
  const warnings: string[] = [];

  // 1) doc-auto-case-details JSON
  const detailJson = extractJsonBlob(html, 'doc-auto-case-details');
  if (!detailJson) throw new Error('Missing <script id="doc-auto-case-details"> blob');
  const details = JSON.parse(detailJson) as Record<string, HtmlDetailEntry>;

  // 2) AUTO_CASE_STATUS object literal
  const statusLiteral = extractObjectLiteral(html, 'AUTO_CASE_STATUS');
  const statusMap: Record<string, [string, string]> = statusLiteral
    ? parseLooseObject(statusLiteral)
    : {};

  // 3) SUBSECTION_INDEX (keyed by "1.1", values are arrays-of-arrays)
  const indexLiteral = extractObjectLiteral(html, 'SUBSECTION_INDEX');
  const subsectionIndex: Record<string, Array<[string, string]>> = indexLiteral
    ? parseLooseObject(indexLiteral)
    : {};

  // Invert: scenarioId → subsection
  const idToSubsection = new Map<string, string>();
  for (const [sub, entries] of Object.entries(subsectionIndex)) {
    for (const [scenarioId] of entries) {
      idToSubsection.set(scenarioId, sub);
    }
  }

  // Union of all IDs we see
  const allIds = new Set<string>([
    ...Object.keys(details),
    ...Object.keys(statusMap),
    ...idToSubsection.keys(),
  ]);

  const scenarios: ParsedPlan['scenarios'] = [];
  for (const id of allIds) {
    const d = details[id];
    const title = d?.title ?? id;
    const spec_file = normalizeSpecPath(d?.spec_path);
    const subsection = idToSubsection.get(id) ?? '';
    const feature_area = inferFeatureArea(id, spec_file);
    const workflow = inferWorkflow(subsection, feature_area);

    const statusEntry = statusMap[id];
    const execCss = statusEntry?.[1];
    const execution_status: ExecutionStatus = (['passed', 'not-executed', 'skipped', 'failed-defect'] as const)
      .includes(execCss as ExecutionStatus) ? (execCss as ExecutionStatus) : 'not-executed';

    const automation_state: AutomationState = spec_file ? 'automated' : 'pending';

    if (!d) warnings.push(`${id}: missing details block`);
    if (!subsection) warnings.push(`${id}: missing SUBSECTION_INDEX entry`);

    scenarios.push({
      id,
      title,
      automation_state,
      execution_status,
      priority: inferPriority(id),
      feature_area,
      spec_file,
      workflow,
      subsection,
      steps: d?.steps ?? [],
      expected_results: d?.expected_results ?? [],
      execution_notes: d?.execution_notes ?? '',
    });
  }

  scenarios.sort((a, b) => a.id.localeCompare(b.id));
  return { scenarios, warnings };
}
