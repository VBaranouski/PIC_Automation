import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { parseHtmlPlan } from '../../src/tracker/html-parser';

const FIXTURE = path.resolve(__dirname, '..', 'fixtures', 'automation-testing-plan.fixture.html');

test.describe('parseHtmlPlan', () => {
  test('extracts scenarios from fixture', () => {
    const html = fs.readFileSync(FIXTURE, 'utf-8');
    const result = parseHtmlPlan(html);
    expect(result.scenarios.length).toBe(3);
  });

  test('maps title, spec_path, steps, expected_results, execution_notes', () => {
    const html = fs.readFileSync(FIXTURE, 'utf-8');
    const { scenarios } = parseHtmlPlan(html);
    const loggedIn = scenarios.find((s) => s.id === 'AUTH-LOGIN-001')!;
    expect(loggedIn.title).toBe('Verify login page loads');
    expect(loggedIn.spec_file).toBe('tests/auth/login.spec.ts');
    expect(loggedIn.steps).toEqual(['Open app', 'Observe login form']);
    expect(loggedIn.expected_results).toEqual(['Form is visible']);
    expect(loggedIn.execution_notes).toBe('');

    const broken = scenarios.find((s) => s.id === 'AUTH-LOGIN-999')!;
    expect(broken.execution_notes).toBe('Known flaky on QA');
  });

  test('maps AUTO_CASE_STATUS into execution_status', () => {
    const html = fs.readFileSync(FIXTURE, 'utf-8');
    const { scenarios } = parseHtmlPlan(html);
    expect(scenarios.find((s) => s.id === 'AUTH-LOGIN-001')!.execution_status).toBe('passed');
    expect(scenarios.find((s) => s.id === 'AUTH-LOGIN-999')!.execution_status).toBe('failed-defect');
    expect(scenarios.find((s) => s.id === 'DOC-CREATE-001')!.execution_status).toBe('skipped');
  });

  test('derives subsection from SUBSECTION_INDEX', () => {
    const html = fs.readFileSync(FIXTURE, 'utf-8');
    const { scenarios } = parseHtmlPlan(html);
    expect(scenarios.find((s) => s.id === 'AUTH-LOGIN-001')!.subsection).toBe('1.1');
    expect(scenarios.find((s) => s.id === 'DOC-CREATE-001')!.subsection).toBe('4.1');
  });

  test('defaults automation_state to automated when spec_path present', () => {
    const html = fs.readFileSync(FIXTURE, 'utf-8');
    const { scenarios } = parseHtmlPlan(html);
    for (const s of scenarios) expect(s.automation_state).toBe('automated');
  });

  test('infers feature_area from ID prefix', () => {
    const html = fs.readFileSync(FIXTURE, 'utf-8');
    const { scenarios } = parseHtmlPlan(html);
    expect(scenarios.find((s) => s.id === 'AUTH-LOGIN-001')!.feature_area).toBe('auth');
    expect(scenarios.find((s) => s.id === 'DOC-CREATE-001')!.feature_area).toBe('doc');
  });

  test('defaults automation_state to pending when no spec_path', () => {
    const htmlWithPending = `<!DOCTYPE html><html><body>
<script id="doc-auto-case-details" type="application/json">
{"NO-SPEC-001":{"title":"Manual only test"}}
</script>
<script>
const SUBSECTION_INDEX = {"9.1":[["NO-SPEC-001","desc"]]};
const AUTO_CASE_STATUS = {'NO-SPEC-001':['Not Executed','not-executed']};
</script>
</body></html>`;
    const { scenarios } = parseHtmlPlan(htmlWithPending);
    const s = scenarios.find((x) => x.id === 'NO-SPEC-001')!;
    expect(s.automation_state).toBe('pending');
    expect(s.execution_status).toBe('not-executed');
  });

  test('emits warning for scenario missing from details block', () => {
    const htmlMissingDetails = `<!DOCTYPE html><html><body>
<script id="doc-auto-case-details" type="application/json">
{}
</script>
<script>
const SUBSECTION_INDEX = {"1.1":[["AUTH-GHOST-001","desc"]]};
const AUTO_CASE_STATUS = {'AUTH-GHOST-001':['Passed','passed']};
</script>
</body></html>`;
    const { scenarios, warnings } = parseHtmlPlan(htmlMissingDetails);
    expect(scenarios.length).toBe(1);
    expect(scenarios[0].id).toBe('AUTH-GHOST-001');
    expect(warnings.some((w) => w.includes('AUTH-GHOST-001') && w.includes('missing details'))).toBe(true);
  });

  test('throws when doc-auto-case-details blob is missing', () => {
    const htmlNoBlobHtml = `<!DOCTYPE html><html><body><script>const X=1;</script></body></html>`;
    expect(() => parseHtmlPlan(htmlNoBlobHtml)).toThrow('Missing <script id="doc-auto-case-details">');
  });
});
