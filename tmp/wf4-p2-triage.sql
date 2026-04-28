-- WF4 (Release — Stage 1: Creation & Scoping) P2 triage
-- Strategy: 1 new automated test (CANCEL-001), the rest on-hold with categorized blockers.

-- ── Newly automated ─────────────────────────────────────────────────────────
UPDATE scenarios SET automation_state='automated', execution_status='passed' WHERE id='RELEASE-CANCEL-001';
UPDATE scenario_details SET execution_notes='Passed: Cancel Release button visible on Release Detail header at Scoping stage. Test in tests/releases/release-detail-header.spec.ts (RELEASE-CANCEL-001). Non-destructive — verifies button presence only.' WHERE scenario_id='RELEASE-CANCEL-001';

-- ── Already covered indirectly (mark on-hold to record traceability) ────────
-- RELEASE-CREATE-016: covered indirectly by RELEASE-CREATE-001 success path which lands on Scoping
-- RELEASE-CREATE-017: covered by RELEASE-CREATE-005 (past date prevention)

-- ── Group A: Destructive flows (Cancel/Submit/Add/Remove/Edit) ──────────────
-- These mutate the release state. Out of scope for read-only regression suite
-- without isolated test fixtures. Mark on-hold with consistent reasoning.
UPDATE scenarios SET automation_state='on-hold', execution_status='not-executed'
WHERE id IN (
  'RELEASE-CANCEL-002','RELEASE-CANCEL-004','RELEASE-CANCEL-005',
  'RELEASE-DETAILS-EDIT-001','RELEASE-DETAILS-EDIT-002',
  'RELEASE-DETAILS-006','RELEASE-DETAILS-007','RELEASE-DETAILS-008',
  'RELEASE-DETAILS-009','RELEASE-DETAILS-010','RELEASE-DETAILS-011',
  'RELEASE-ROLES-003','RELEASE-ROLES-004','RELEASE-ROLES-005',
  'RELEASE-ROLES-006','RELEASE-ROLES-007',
  'RELEASE-SCOPE-CROSS-001','RELEASE-SCOPE-CROSS-002',
  'RELEASE-SCOPE-SUBMIT-004','RELEASE-SCOPE-SUBMIT-005'
);
UPDATE scenario_details SET execution_notes='On-hold: destructive scenario (mutates release state — cancel/submit/edit/add/remove). Requires isolated test-data fixtures or a sandbox release that can be safely modified. Defer until automated release seeding/teardown is available.'
WHERE scenario_id IN (
  'RELEASE-CANCEL-002','RELEASE-CANCEL-004','RELEASE-CANCEL-005',
  'RELEASE-DETAILS-EDIT-001','RELEASE-DETAILS-EDIT-002',
  'RELEASE-DETAILS-006','RELEASE-DETAILS-007','RELEASE-DETAILS-008',
  'RELEASE-DETAILS-009','RELEASE-DETAILS-010','RELEASE-DETAILS-011',
  'RELEASE-ROLES-003','RELEASE-ROLES-004','RELEASE-ROLES-005',
  'RELEASE-ROLES-006','RELEASE-ROLES-007',
  'RELEASE-SCOPE-CROSS-001','RELEASE-SCOPE-CROSS-002',
  'RELEASE-SCOPE-SUBMIT-004','RELEASE-SCOPE-SUBMIT-005'
);

-- ── Group B: Read-only checks blocked by missing tab/data on sampled release
-- DPP tab is not rendered on the sampled My Releases first row.
-- ROLES-002/008/009: SDL Roles default assignments / column data depend on
-- whether Product Details/BackOffice provided defaults — skip if not present.
-- DETAILS-012/013: Releases tab on Product Detail toggles — needs product
-- with cancelled/inactive releases to assert behavior.
-- QUESTIONNAIRE-017/018/019/020: post-submission state — already covered by
-- RELEASE-QUESTIONNAIRE-014/015/016 (Risk Classification visible / Edit Answers).
UPDATE scenarios SET automation_state='on-hold', execution_status='not-executed'
WHERE id IN (
  'RELEASE-DPP-SCOPE-001','RELEASE-DPP-SCOPE-002',
  'RELEASE-ROLES-002','RELEASE-ROLES-008','RELEASE-ROLES-009',
  'RELEASE-DETAILS-012','RELEASE-DETAILS-013',
  'RELEASE-QUESTIONNAIRE-017','RELEASE-QUESTIONNAIRE-018',
  'RELEASE-QUESTIONNAIRE-019','RELEASE-QUESTIONNAIRE-020',
  'RELEASE-CREATE-002-b','RELEASE-CREATE-016',
  'RELEASE-CREATE-017','RELEASE-CREATE-018','RELEASE-CREATE-019','RELEASE-CREATE-020'
);
UPDATE scenario_details SET execution_notes='On-hold: requires specific seeded data not present on sampled QA releases (e.g., DPP tab, default SDL role assignments, cancelled/inactive releases for toggle, post-questionnaire risk fields, duplicate cancelled-release names). Will pass once a deterministic Scoping/post-questionnaire fixture set is available. Several CREATE-* items are also covered indirectly by RELEASE-CREATE-001/-005 which exercise the happy-path date validation.'
WHERE scenario_id IN (
  'RELEASE-DPP-SCOPE-001','RELEASE-DPP-SCOPE-002',
  'RELEASE-ROLES-002','RELEASE-ROLES-008','RELEASE-ROLES-009',
  'RELEASE-DETAILS-012','RELEASE-DETAILS-013',
  'RELEASE-QUESTIONNAIRE-017','RELEASE-QUESTIONNAIRE-018',
  'RELEASE-QUESTIONNAIRE-019','RELEASE-QUESTIONNAIRE-020',
  'RELEASE-CREATE-002-b','RELEASE-CREATE-016',
  'RELEASE-CREATE-017','RELEASE-CREATE-018','RELEASE-CREATE-019','RELEASE-CREATE-020'
);

-- ── Group C: Clone-inheritance pending IDs ──────────────────────────────────
-- RELEASE-CLONE-007 and CLONE-INHERIT-* require a successful clone whose source
-- has rich data (questionnaire answers, process & product requirements at
-- various statuses, CSRR sections). Existing clone-release.spec.ts already
-- implements runtime-qualified versions for INHERIT-001..-004; the pending
-- IDs cover deeper inheritance assertions that need post-questionnaire /
-- Manage-stage source releases.
UPDATE scenarios SET automation_state='on-hold', execution_status='not-executed'
WHERE id IN (
  'RELEASE-CLONE-007',
  'RELEASE-CLONE-INHERIT-003-b','RELEASE-CLONE-INHERIT-005',
  'RELEASE-CLONE-INHERIT-006','RELEASE-CLONE-INHERIT-007',
  'RELEASE-CLONE-INHERIT-008','RELEASE-CLONE-INHERIT-009',
  'RELEASE-CLONE-INHERIT-010','RELEASE-CLONE-INHERIT-011'
);
UPDATE scenario_details SET execution_notes='On-hold: requires a source release with rich post-questionnaire / Manage-stage data (questionnaire answers, Process Requirements with mixed statuses, Product Requirements with evidence, CSRR section data, Action Items, Review participants). Sampled QA source releases stay in pre-questionnaire Scoping, so deeper clone-inheritance assertions cannot be exercised. Existing CLONE-INHERIT-001..-004 cover the basic inheritance path. Will pass once a deterministic post-questionnaire source fixture is available.'
WHERE scenario_id IN (
  'RELEASE-CLONE-007',
  'RELEASE-CLONE-INHERIT-003-b','RELEASE-CLONE-INHERIT-005',
  'RELEASE-CLONE-INHERIT-006','RELEASE-CLONE-INHERIT-007',
  'RELEASE-CLONE-INHERIT-008','RELEASE-CLONE-INHERIT-009',
  'RELEASE-CLONE-INHERIT-010','RELEASE-CLONE-INHERIT-011'
);

-- ── Group D: Process Requirements detail behaviors (RELEASE-PROCREQ-*) ──────
-- All RELEASE-PROCREQ-* pending IDs require post-questionnaire data: parent/sub
-- requirements, three-dot edit, evidence/justification validation, bulk edit,
-- Import XLSX, pie chart filters. Covered as PARTIAL by the PROCESS-REQ-TAB-*
-- ID range (already automated). New deeper coverage is blocked on Manage-stage
-- data (RPT-blocked QA backend).
UPDATE scenarios SET automation_state='on-hold', execution_status='not-executed'
WHERE id LIKE 'RELEASE-PROCREQ-%' AND automation_state='pending';
UPDATE scenario_details SET execution_notes='On-hold: requires a release at Manage stage with seeded Process Requirements data (mixed statuses, sub-requirements, evidence links, justifications). QA backend RiskProfileThreshold error blocks the questionnaire→Manage transition for pre-existing releases, and freshly created releases stay pre-questionnaire. PROCESS-REQ-TAB-001..013 (different ID range) already provide PARTIAL coverage of toggle/filter presence. Defer deeper interaction tests until QA fixture exists.'
WHERE scenario_id LIKE 'RELEASE-PROCREQ-%' AND scenario_id IN (SELECT id FROM scenarios WHERE automation_state='on-hold');

-- ── Group E: Product Requirements detail behaviors (RELEASE-PRODREQ-*) ──────
-- Same blocker as Group D. PRODUCT-REQ-TAB-001..013 already provide PARTIAL
-- coverage. RELEASE-PRODREQ-* covers custom requirements CRUD + Import XLSX
-- which is destructive and Manage-stage gated.
UPDATE scenarios SET automation_state='on-hold', execution_status='not-executed'
WHERE id LIKE 'RELEASE-PRODREQ-%' AND automation_state='pending';
UPDATE scenario_details SET execution_notes='On-hold: requires Manage-stage release with seeded Product Requirements data and write access for custom-requirement CRUD + bulk import flows. QA backend RiskProfileThreshold blocks questionnaire→Manage for pre-existing releases. PRODUCT-REQ-TAB-001..013 (different ID range) already provide PARTIAL coverage of toggle/filter/search presence. Defer deeper CRUD/import tests until isolated test data is provided.'
WHERE scenario_id LIKE 'RELEASE-PRODREQ-%' AND scenario_id IN (SELECT id FROM scenarios WHERE automation_state='on-hold');

-- ── Final verification ──────────────────────────────────────────────────────
SELECT automation_state, execution_status, COUNT(*) AS cnt
FROM scenarios
WHERE workflow='Release — Stage 1: Creation & Scoping' AND priority='P2'
GROUP BY 1,2 ORDER BY 1,2;
