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
});
