/**
 * Test Scenario Tracker — Shared helpers
 *
 * Utility functions shared across tracker modules.
 */

import type { FeatureArea } from './models';

export const WORKFLOW_ORDER = [
  'Authentication',
  'Landing Page & Home Navigation',
  'Product Management',
  'Release — Stage 1: Creation & Scoping',
  'Release — Stage 2: Review & Confirm',
  'Release — Stage 3: Manage',
  'Release — Stage 4: SA & PQL Sign Off',
  'Release — Stage 5: FCSR Review',
  'Release — Stage 6: Post FCSR Actions',
  'Release — Stage 7: Final Acceptance',
  'Digital Offer Certification (DOC)',
  'Roles Delegation',
  'Actions Management',
  'Release History',
  'Stage Sidebar & Responsible Users',
  'Data Protection & Privacy (DPP) Review',
  'Reports & Dashboards (Tableau Integration)',
  'Maintenance Mode',
  'Requirements Versioning: BackOffice Administration',
  'Integration: Data Extraction API',
  'Integration: Data Ingestion API',
  'Integration: Intel DS / Informatica (Training Completion)',
] as const;

export function workflowSortKey(name: string): number {
  const cleaned = name.replace(/^WORKFLOW\s+\d+\s*[—–-]\s*/i, '').trim().toLowerCase();
  const exactIndex = WORKFLOW_ORDER.findIndex((entry) => entry.toLowerCase() === cleaned);
  if (exactIndex >= 0) return exactIndex + 1;
  const prefixIndex = WORKFLOW_ORDER.findIndex((entry) => cleaned.startsWith(entry.toLowerCase()));
  if (prefixIndex >= 0) return prefixIndex + 1;
  return WORKFLOW_ORDER.length + 100;
}

export function now(): string {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

export function parseJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  // Prefer JSON array format (e.g. '["step1","step2"]')
  try { const v = JSON.parse(raw); return Array.isArray(v) ? v.map(String) : []; }
  // Fallback: newline-separated plain text (legacy backfill format)
  catch { return raw.split('\n').map(s => s.trim()).filter(Boolean); }
}

export function normalizeSpecFilePath(specFile: string | undefined): string {
  return String(specFile ?? '').replace(/\\/g, '/').replace(/^\.\//, '');
}

export function featureAreaFromSpecFile(specFile: string): FeatureArea {
  const normalized = normalizeSpecFilePath(specFile);
  if (normalized.startsWith('tests/auth/')) return 'auth';
  if (normalized.startsWith('tests/landing/')) return 'landing';
  if (normalized.startsWith('tests/products/')) return 'products';
  if (normalized.startsWith('tests/releases/')) return 'releases';
  if (normalized.startsWith('tests/doc/')) return 'doc';
  return 'other';
}

export function workflowNameFromSubsection(subsection: string): string {
  const workflowNumber = Number(String(subsection).match(/^(\d+)/)?.[1] ?? '0');
  if (workflowNumber >= 1 && workflowNumber <= WORKFLOW_ORDER.length) {
    return WORKFLOW_ORDER[workflowNumber - 1];
  }
  return '';
}
