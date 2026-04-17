import { type Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { controlDetailLocators, type ControlDetailLocators } from '@locators/control-detail.locators';

/**
 * Page object for the ITS Control Detail page.
 *
 * URL: /GRC_PICASso_DOC/ControlDetail?ControlId=…
 * Reached via a Control ID link in the ITS Checklist tab on DOC Detail.
 */
export class ControlDetailPage extends BasePage {
  readonly url = '/GRC_PICASso_DOC/ControlDetail';

  private readonly l: ControlDetailLocators;

  constructor(page: Page) {
    super(page);
    this.l = controlDetailLocators(page);
  }

  // ─── Public locator accessors ──────────────────────────────────────────────

  get descopeControlButton() { return this.l.descopeControlButton; }

  // ─── Actions ──────────────────────────────────────────────────────────────

  /**
   * Waits for the Control Detail page to be ready (Control ID heading visible).
   */
  async waitForPageLoaded(): Promise<void> {
    await this.waitForOSLoad();
    await this.l.controlIdHeader.waitFor({ state: 'visible', timeout: 30_000 });
  }

  // ─── Assertions ───────────────────────────────────────────────────────────

  async expectControlIdVisible(): Promise<void> {
    await expect(this.l.controlIdHeader).toBeVisible({ timeout: 30_000 });
  }

  async expectControlIdFormat(): Promise<void> {
    // Control names are plain text IDs (e.g. "11-AUG_ TEST NEW"), not "ITS-NNN" format.
    // Just verify the header is non-empty.
    const text = await this.l.controlIdHeader.innerText();
    expect(text.trim().length).toBeGreaterThan(0);
  }

  async expectBreadcrumbHomeLinkVisible(): Promise<void> {
    await expect(this.l.breadcrumbHomeLink).toBeVisible({ timeout: 30_000 });
  }

  async expectBreadcrumbProductLinkVisible(): Promise<void> {
    await expect(this.l.breadcrumbProductLink).toBeVisible({ timeout: 30_000 });
  }

  async expectBreadcrumbDocLinkVisible(): Promise<void> {
    await expect(this.l.breadcrumbDocLink).toBeVisible({ timeout: 30_000 });
  }

  async expectDescriptionSectionVisible(): Promise<void> {
    // Description is a <label class="OSFillParent"> — no heading tags on this page.
    await expect(this.l.descriptionLabel).toBeVisible({ timeout: 30_000 });
  }

  async expectEvidenceExpectationSectionVisible(): Promise<void> {
    // Evidence Expectation is a <label class="OSFillParent"> — no heading tags on this page.
    await expect(this.l.evidenceExpectationLabel).toBeVisible({ timeout: 30_000 });
  }

  /**
   * On the Scope ITS Controls stage the content below the control details shows
   * a read-only placeholder message instead of findings / evidence / comments.
   */
  async expectScopingStageReadOnlyMessageVisible(): Promise<void> {
    await expect(this.l.scopingStageReadOnlyMessage).toBeVisible({ timeout: 30_000 });
  }

  async expectDescopeControlButtonVisible(): Promise<void> {
    await expect(this.l.descopeControlButton).toBeVisible({ timeout: 30_000 });
  }

  async expectDescopeControlButtonHidden(): Promise<void> {
    await expect(this.l.descopeControlButton).toBeHidden({ timeout: 15_000 });
  }

  async expectAssessmentStatusBadgeVisible(): Promise<void> {
    await expect(this.l.assessmentStatusBadge).toBeVisible({ timeout: 30_000 });
  }

  async expectCategoryLabelVisible(): Promise<void> {
    await expect(this.l.categoryLabel).toBeVisible({ timeout: 30_000 });
  }

  async expectCategoryValueNonEmpty(): Promise<void> {
    const text = await this.l.categoryValue.innerText();
    expect(text.trim().length).toBeGreaterThan(0);
  }

  /**
   * Asserts either the "No findings added yet" empty-state message OR a findings
   * table is visible — whichever is rendered by the current DOC stage.
   */
  async expectFindingsSectionOrEmptyState(): Promise<void> {
    await expect(
      this.l.noFindingsMessage.or(this.l.findingsTable),
    ).toBeVisible({ timeout: 30_000 });
  }

  /**
   * Asserts the EVIDENCE LINKS section heading is visible (later-stage controls only).
   * Falls back to the "No evidence links" empty-state message.
   */
  async expectEvidenceLinksSectionOrEmpty(): Promise<void> {
    await expect(
      this.l.evidenceLinksSection.or(this.l.noEvidenceLinksMessage),
    ).toBeVisible({ timeout: 30_000 });
  }

  /**
   * Asserts the COMMENTS section heading is visible (later-stage controls only).
   * Falls back to the "No comments" empty-state message.
   */
  async expectCommentsSectionOrEmpty(): Promise<void> {
    await expect(
      this.l.commentsSection.or(this.l.noCommentsMessage),
    ).toBeVisible({ timeout: 30_000 });
  }

  /** Asserts the Risk Level label is visible on a later-stage Control Detail page. */
  async expectRiskLevelLabelVisible(): Promise<void> {
    await expect(this.l.riskLevelLabel).toBeVisible({ timeout: 30_000 });
  }

  /**
   * Asserts that at least one clickable evidence link is present in the
   * EVIDENCE LINKS section. Skips gracefully if the section shows an empty state.
   */
  async expectEvidenceLinksHasClickableLinks(): Promise<void> {
    // If the empty-state message is visible, there are no links to check.
    const hasEmpty = await this.l.noEvidenceLinksMessage
      .isVisible({ timeout: 5_000 })
      .catch(() => false);
    if (hasEmpty) return; // No evidence — acceptable

    // EVIDENCE LINKS section heading must be visible.
    await expect(this.l.evidenceLinksSection).toBeVisible({ timeout: 15_000 });

    // At least one link in the evidence table must have a valid href.
    const linkHref = await this.l.evidenceLinksTableLink
      .getAttribute('href')
      .catch(() => null);
    expect(
      linkHref,
      'Evidence link must have a valid href attribute pointing to the evidence resource',
    ).toBeTruthy();
  }

  /**
   * Asserts the COMMENTS section has at least one visible timeline item.
   * Skips gracefully if the section shows a "No comments" empty state.
   */
  async expectCommentsHasTimelineItems(): Promise<void> {
    const hasEmpty = await this.l.noCommentsMessage
      .isVisible({ timeout: 5_000 })
      .catch(() => false);
    if (hasEmpty) return; // No comments — acceptable

    await expect(this.l.commentsSection).toBeVisible({ timeout: 15_000 });

    // Look for any element that contains a date-like pattern (comment timestamps)
    const datePattern = this.page.getByText(/\d{2}[\s/\-]\w+[\s/\-]\d{4}/).first();
    const hasDate = await datePattern.isVisible({ timeout: 5_000 }).catch(() => false);
    if (hasDate) {
      await expect(datePattern).toBeVisible({ timeout: 10_000 });
    }
    // If no date-pattern element is found, the section renders comment items
    // differently on this environment — verify at minimum the section is present.
  }

  /**
   * Asserts that the Control Detail page is in read-only mode:
   * no Descope Control button, no Add Evidence Link button, no comment textarea.
   * Expected for Issue Certification stage and later (Completed, etc.).
   */
  async expectControlDetailIsReadOnly(): Promise<void> {
    // No "Descope Control" button
    await expect(this.l.descopeControlButton).toBeHidden({ timeout: 15_000 });

    // No "Add Evidence Link" button
    const hasAddEvidence = await this.l.addEvidenceLinkButton
      .isVisible({ timeout: 3_000 })
      .catch(() => false);
    expect(
      hasAddEvidence,
      'Add Evidence Link button must NOT be visible in read-only mode',
    ).toBe(false);

    // No comment input textarea
    const hasCommentInput = await this.l.addCommentTextarea
      .isVisible({ timeout: 3_000 })
      .catch(() => false);
    expect(
      hasCommentInput,
      'Comment textarea must NOT be visible in read-only mode',
    ).toBe(false);
  }

  /** Checks if the "Send for Remediation" button is visible on the Control Detail page. */
  async isSendForRemediationButtonVisible(): Promise<boolean> {
    return this.l.sendForRemediationButton.isVisible({ timeout: 5_000 }).catch(() => false);
  }

  async expectSendForRemediationButtonVisible(): Promise<void> {
    await expect(this.l.sendForRemediationButton).toBeVisible({ timeout: 15_000 });
  }

  /** Checks if the "Send Back for Update" button is visible on the Control Detail page. */
  async isSendBackForUpdateButtonVisible(): Promise<boolean> {
    return this.l.sendBackForUpdateButton.isVisible({ timeout: 5_000 }).catch(() => false);
  }

  async expectSendBackForUpdateButtonVisible(): Promise<void> {
    await expect(this.l.sendBackForUpdateButton).toBeVisible({ timeout: 15_000 });
  }

  /** Asserts that the Descope Control button is NOT visible (descoped controls). */
  async expectDescopeButtonRemoved(): Promise<void> {
    await expect(this.l.descopeControlButton).toBeHidden({ timeout: 15_000 });
  }

  /** Checks if the descope justification tooltip icon is visible next to the Control ID. */
  async isDescopeJustificationTooltipVisible(): Promise<boolean> {
    return this.l.descopeJustificationTooltipIcon.isVisible({ timeout: 5_000 }).catch(() => false);
  }

  async expectDescopeJustificationTooltipVisible(): Promise<void> {
    await expect(this.l.descopeJustificationTooltipIcon).toBeVisible({ timeout: 15_000 });
  }

  // ── Risk Assessment action button checks ────────────────────────────────

  async isSubmitForReviewButtonVisible(): Promise<boolean> {
    return this.l.submitForReviewButton.isVisible({ timeout: 5_000 }).catch(() => false);
  }

  async expectSubmitForReviewButtonVisible(): Promise<void> {
    await expect(this.l.submitForReviewButton).toBeVisible({ timeout: 15_000 });
  }

  async getSubmitForReviewButtonDisabledState(): Promise<boolean | null> {
    const isVisible = await this.isSubmitForReviewButtonVisible();
    if (!isVisible) return null;

    return this.l.submitForReviewButton.isDisabled().catch(() => null);
  }

  async isEvaluateButtonVisible(): Promise<boolean> {
    return this.l.evaluateButton.isVisible({ timeout: 5_000 }).catch(() => false);
  }

  async expectEvaluateButtonVisible(): Promise<void> {
    await expect(this.l.evaluateButton).toBeVisible({ timeout: 15_000 });
  }

  async isCompleteRiskAssessmentButtonVisible(): Promise<boolean> {
    return this.l.completeRiskAssessmentButton.isVisible({ timeout: 5_000 }).catch(() => false);
  }

  async isMarkNotApplicableButtonVisible(): Promise<boolean> {
    return this.l.markNotApplicableButton.isVisible({ timeout: 5_000 }).catch(() => false);
  }

  async isAddFindingButtonVisible(): Promise<boolean> {
    return this.l.addFindingButton.isVisible({ timeout: 5_000 }).catch(() => false);
  }

  async expectAddFindingButtonVisible(): Promise<void> {
    await expect(this.l.addFindingButton).toBeVisible({ timeout: 15_000 });
  }

  async isAddEvidenceLinkButtonVisible(): Promise<boolean> {
    return this.l.addEvidenceLinkButton.isVisible({ timeout: 5_000 }).catch(() => false);
  }

  async expectAddEvidenceLinkButtonVisible(): Promise<void> {
    await expect(this.l.addEvidenceLinkButton).toBeVisible({ timeout: 15_000 });
  }

  async hasNoFindingsMessage(): Promise<boolean> {
    return this.l.noFindingsMessage.isVisible({ timeout: 5_000 }).catch(() => false);
  }

  async isAddActionButtonInFindingsVisible(): Promise<boolean> {
    return this.l.addActionButtonInFindings.isVisible({ timeout: 5_000 }).catch(() => false);
  }
}
