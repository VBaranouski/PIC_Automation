import { type Page } from '@playwright/test';

/**
 * Locators for the Control Detail page (/GRC_PICASso_DOC/ControlDetail).
 *
 * A Control Detail page is reached by clicking a Control ID link in the
 * ITS Checklist tab on the DOC Detail page.
 */
export const controlDetailLocators = (page: Page) => ({

  // ─── Breadcrumb ──────────────────────────────────────────────────────────
  // OutSystems renders breadcrumb links; nav has aria-label="breadcrumb".
  // 3 links: Home [0], Product [1], DOC [2]; current page is a span.title (not a link).
  breadcrumbHomeLink:    page.locator('nav[aria-label="breadcrumb"] a').nth(0),
  breadcrumbProductLink: page.locator('nav[aria-label="breadcrumb"] a').nth(1),
  breadcrumbDocLink:     page.locator('nav[aria-label="breadcrumb"] a').nth(2),
  // The current page segment (e.g. "ITS Control: 11-AUG_ TEST NEW") is a span.title — not a link.
  breadcrumbCurrentText: page.locator('nav[aria-label="breadcrumb"] span.title').last(),

  // ─── Header ──────────────────────────────────────────────────────────────
  // Control name is in .header-title-structure__title (plain div, NOT a heading role).
  // The control name is the raw control ID text (e.g. "11-AUG_ TEST NEW"), not "ITS-NNN" format.
  controlIdHeader:       page.locator('.header-title-structure__title').first(),
  // Assessment status is rendered as a plain div with text like "Assessment Completed",
  // "Assessment In Progress", "Assessment Not Started", etc.  — NOT a .badge class element.
  assessmentStatusBadge: page.getByText(/Assessment (Completed|In Progress|Not Started|Pending|Approved|Rejected)/i).first(),

  // ─── Content sections ────────────────────────────────────────────────────
  // Description and Evidence Expectation are <label class="OSFillParent"> inside div.info-large.
  // No heading tags exist on this page — section labels are <label> elements.
  descriptionLabel:           page.locator('label.OSFillParent').filter({ hasText: 'Description' }).first(),
  evidenceExpectationLabel:   page.locator('label.OSFillParent').filter({ hasText: 'Evidence Expectation' }).first(),
  // The content value sits in a sibling element after the label's parent.
  descriptionValue:           page.locator('.info-large').filter({ has: page.locator('label').filter({ hasText: 'Description' }) }).locator('p, span, div').last(),
  evidenceExpectationValue:   page.locator('.info-large').filter({ has: page.locator('label').filter({ hasText: 'Evidence Expectation' }) }).locator('p, span, div').last(),

  // Category: <label class="OSFillParent"> inside div.OSInline, value is a sibling span/div.
  categoryLabel:   page.locator('label.OSFillParent').filter({ hasText: 'Category' }).first(),
  categoryValue:   page.locator('.OSInline').filter({ has: page.locator('label').filter({ hasText: 'Category' }) }).locator('span, div').last(),

  // ─── Stage-specific messages ─────────────────────────────────────────────
  // Shown during Controls Scoping stage — before Risk Assessment has started.
  scopingStageReadOnlyMessage: page.getByText(/No evidence links, findings or comments yet/),

  // ─── Evidence Links section ──────────────────────────────────────────────
  // Visible on later-stage controls (Risk Assessment and beyond).
  // Section heading text rendered by OutSystems as a label or span.
  evidenceLinksSection:    page.getByText(/EVIDENCE LINKS/i).first(),
  noEvidenceLinksMessage:  page.getByText(/No evidence links/i).first(),

  // ─── Comments section ────────────────────────────────────────────────────
  // Visible on later-stage controls (Risk Assessment and beyond).
  commentsSection:   page.getByText(/COMMENTS/i).first(),
  noCommentsMessage: page.getByText(/No comments/i).first(),

  // ─── Findings section ────────────────────────────────────────────────────
  // No heading tags — finding these by text in a label/span.
  noFindingsMessage:   page.getByText('No findings added yet'),
  // Findings table — scoped by the FINDING ID column header to avoid matching other tables.
  findingsTable:       page.locator('table').filter({ has: page.locator('th', { hasText: /FINDING ID/i }) }),

  // ─── Actions ─────────────────────────────────────────────────────────────
  // "Descope Control" is a proper <button> element with that exact text.
  descopeControlButton: page.getByRole('button', { name: 'Descope Control' }),
  // After descoping: button is removed and a tooltip icon may appear next to the Control ID.
  descopeJustificationTooltipIcon: page.locator('[class*="tooltip"][title*="justif"], [aria-label*="justif"]').first(),

  // "Send for Remediation" button — visible on controls with findings
  sendForRemediationButton: page.getByRole('button', { name: /Send for Remediation/i }),
  // "Send Back for Update" button — DOCL can send control back to DO Team
  sendBackForUpdateButton: page.getByRole('button', { name: /Send Back for Update/i }),

  // ─── Risk Level section ───────────────────────────────────────────────────
  // Shown on later-stage controls where a risk assessment has been started.
  // OutSystems renders Risk Level as a labeled field near Category.
  riskLevelLabel: page.getByText(/Risk Level/i).first(),

  // ─── Evidence Links — links when evidence is attached ────────────────────
  // When evidence IS present it renders in the first <table> on the page
  // (the findings table, if any, comes last).
  evidenceLinksTableLink: page.locator('table').first().getByRole('link').first(),

  // ─── Read-only mode checks (absent in Issue Certification / Completed) ────
  // These editing controls MUST NOT be visible when the DOC is read-only.
  addEvidenceLinkButton: page.getByRole('button', { name: /Add (Evidence|Link)/i }).first(),
  addCommentTextarea:    page.getByRole('textbox', { name: /[Cc]omment/ }).first(),

  // ─── Risk Assessment actions ─────────────────────────────────────────────
  submitForReviewButton:       page.getByRole('button', { name: /Submit for Review/i }),
  evaluateButton:              page.getByRole('button', { name: /Evaluate/i }),
  completeRiskAssessmentButton: page.getByRole('button', { name: /Complete Risk Assessment/i }),
  markNotApplicableButton:     page.getByRole('button', { name: /Mark.*Not Applicable/i }),
  addFindingButton:            page.getByRole('button', { name: /Add Finding/i }),
  addActionButtonInFindings:   page.getByRole('button', { name: /Add Action/i }),
});

export type ControlDetailLocators = ReturnType<typeof controlDetailLocators>;
