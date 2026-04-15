import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { parseHtmlPlan } from '../../src/tracker/html-parser';

const FIXTURE = path.resolve(__dirname, '..', 'fixtures', 'automation-testing-plan.fixture.html');

test.describe('parseHtmlPlan', () => {
  // Fixture has 4 WF items:  WF01-0001, WF01-0002, WF01-0003, WF11-0001
  test('extracts all WF items from fixture', () => {
    const html = fs.readFileSync(FIXTURE, 'utf-8');
    const result = parseHtmlPlan(html);
    expect(result.scenarios.length).toBe(4);
  });

  test('generates WF-based IDs in sequence per workflow', () => {
    const html = fs.readFileSync(FIXTURE, 'utf-8');
    const { scenarios } = parseHtmlPlan(html);
    const ids = scenarios.map((s) => s.id);
    expect(ids).toContain('WF01-0001');
    expect(ids).toContain('WF01-0002');
    expect(ids).toContain('WF01-0003');
    expect(ids).toContain('WF11-0001');
  });

  test('populates title, spec_file, steps, expected_results, execution_notes from ATC lookup', () => {
    const html = fs.readFileSync(FIXTURE, 'utf-8');
    const { scenarios } = parseHtmlPlan(html);

    // WF01-0001 → AUTH-LOGIN-001 (has steps and results)
    const s1 = scenarios.find((s) => s.id === 'WF01-0001')!;
    expect(s1.title).toBe('Verify login page loads');
    expect(s1.spec_file).toBe('tests/auth/login.spec.ts');
    expect(s1.steps).toEqual(['Open app', 'Observe login form']);
    expect(s1.expected_results).toEqual(['Form is visible']);
    expect(s1.execution_notes).toBe('');

    // WF01-0003 → AUTH-LOGIN-999 (has execution_notes)
    const s3 = scenarios.find((s) => s.id === 'WF01-0003')!;
    expect(s3.execution_notes).toBe('Known flaky on QA');
  });

  test('maps AUTO_CASE_STATUS to execution_status via ATC lookup', () => {
    const html = fs.readFileSync(FIXTURE, 'utf-8');
    const { scenarios } = parseHtmlPlan(html);
    expect(scenarios.find((s) => s.id === 'WF01-0001')!.execution_status).toBe('passed');
    expect(scenarios.find((s) => s.id === 'WF01-0003')!.execution_status).toBe('failed-defect');
    expect(scenarios.find((s) => s.id === 'WF11-0001')!.execution_status).toBe('skipped');
    // Pending item with no ATC ref → not-executed
    expect(scenarios.find((s) => s.id === 'WF01-0002')!.execution_status).toBe('not-executed');
  });

  test('sets subsection from section title (null section = empty string)', () => {
    const html = fs.readFileSync(FIXTURE, 'utf-8');
    const { scenarios } = parseHtmlPlan(html);
    // Auth items have title:null section → subsection ''
    expect(scenarios.find((s) => s.id === 'WF01-0001')!.subsection).toBe('');
    // DOC item has named section
    expect(scenarios.find((s) => s.id === 'WF11-0001')!.subsection).toBe('11.1 Product Setup for DOC');
  });

  test('sets automation_state from WF item boolean', () => {
    const html = fs.readFileSync(FIXTURE, 'utf-8');
    const { scenarios } = parseHtmlPlan(html);
    expect(scenarios.find((s) => s.id === 'WF01-0001')!.automation_state).toBe('automated');
    expect(scenarios.find((s) => s.id === 'WF01-0002')!.automation_state).toBe('pending');
    expect(scenarios.find((s) => s.id === 'WF11-0001')!.automation_state).toBe('automated');
  });

  test('assigns feature_area from WF number', () => {
    const html = fs.readFileSync(FIXTURE, 'utf-8');
    const { scenarios } = parseHtmlPlan(html);
    expect(scenarios.find((s) => s.id === 'WF01-0001')!.feature_area).toBe('auth');
    expect(scenarios.find((s) => s.id === 'WF11-0001')!.feature_area).toBe('doc');
  });

  test('sets workflow name from WF title field', () => {
    const html = fs.readFileSync(FIXTURE, 'utf-8');
    const { scenarios } = parseHtmlPlan(html);
    expect(scenarios.find((s) => s.id === 'WF01-0001')!.workflow).toBe('Authentication');
    expect(scenarios.find((s) => s.id === 'WF11-0001')!.workflow).toBe('Digital Offer Certification (DOC)');
  });

  test('unescapes backslash-escaped quotes in item titles', () => {
    const html = fs.readFileSync(FIXTURE, 'utf-8');
    const { scenarios } = parseHtmlPlan(html);
    // WF01-0003 has "Forgot password" with escaped inner quotes in the HTML
    const s = scenarios.find((s) => s.id === 'WF01-0003')!;
    expect(s.title).toBe('"Forgot password" link opens the recovery flow');
  });

  test('normalizes P0 priority to P1', () => {
    const html = `<!DOCTYPE html><html><body>
<script id="doc-auto-case-details" type="application/json">{}</script>
<script>
const AUTH_SCENARIO_CASES = {};
const AUTO_CASE_STATUS = {};
const WF = [
  { n:1, title:"Auth", sections:[{ title:null, items:[
    [true, "Critical item", "P0"],
  ]}]}
];
</script></body></html>`;
    const { scenarios } = parseHtmlPlan(html);
    expect(scenarios[0].priority).toBe('P1');
  });

  test('emits warning when WF array is missing', () => {
    const html = `<!DOCTYPE html><html><body>
<script id="doc-auto-case-details" type="application/json">{}</script>
<script>const AUTO_CASE_STATUS = {};</script>
</body></html>`;
    const { scenarios, warnings } = parseHtmlPlan(html);
    expect(scenarios.length).toBe(0);
    expect(warnings.some((w) => w.toLowerCase().includes('wf array'))).toBe(true);
  });

  test('throws when doc-auto-case-details blob is missing', () => {
    const html = `<!DOCTYPE html><html><body><script>const X=1;</script></body></html>`;
    expect(() => parseHtmlPlan(html)).toThrow('Missing <script id="doc-auto-case-details">');
  });
});
