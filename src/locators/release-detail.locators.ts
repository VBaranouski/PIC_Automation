import type { Page } from '@playwright/test';

/**
 * Locators for the Release Detail page.
 *
 * DOM notes (observed 2026-04-07 on qa.leap.schneider-electric.com):
 *   - Breadcrumb:   <nav aria-label="breadcrumb" class="breadcrumbs">
 *   - Release badge: [data-block="Patterns.ReleaseStatusTag"] .tag span
 *   - Pipeline:     .wizard-wrapper[role="tablist"] > .wizard-wrapper-item[role="tab"]
 *   - Active stage: .wizard-wrapper-item.active[role="tab"]
 *   - View Flow:    div.expandable-area--toggle  (collapses/expands pipeline area)
 *   - Need Help:    [data-block="Release.ReleaseHelp"] a
 */
export function releaseDetailLocators(page: Page) {
  return {
    // ── Breadcrumb ──────────────────────────────────────────────────────────
    /** Full breadcrumb nav element */
    breadcrumbNav: page.locator('nav[aria-label="breadcrumb"], .breadcrumbs').first(),
    /** "Home" anchor in breadcrumb */
    breadcrumbHomeLink: page
      .locator('nav[aria-label="breadcrumb"] a[href*="HomePage"], .breadcrumbs a[href*="HomePage"]')
      .first(),
    /** Product name anchor in breadcrumb */
    breadcrumbProductLink: page
      .locator(
        'nav[aria-label="breadcrumb"] a[href*="ProductDetail"], .breadcrumbs a[href*="ProductDetail"]',
      )
      .first(),
    /** Current-page anchor (release version) — has aria-current="page" */
    breadcrumbCurrentLink: page
      .locator(
        'nav[aria-label="breadcrumb"] a[aria-current="page"], .breadcrumbs a[aria-current="page"]',
      )
      .first(),
    /** All breadcrumb item wrappers */
    breadcrumbItems: page.locator('.breadcrumbs-item, nav[aria-label="breadcrumb"] li'),

    // ── Header status badges ─────────────────────────────────────────────────
    /** Release status badge text (e.g. "Scoping", "Active", "Actions Closure") */
    releaseStatusBadge: page.locator('[data-block="Patterns.ReleaseStatusTag"] .tag span').first(),
    /** Product status badge text (e.g. "Active") */
    productStatusBadge: page.locator('[data-block="Patterns.ProductStatusTag"] .tag span').first(),

    // ── Pipeline / workflow bar ──────────────────────────────────────────────
    /** Tablist wrapper that contains all 7 stage tabs */
    pipelineTablist: page.locator('.wizard-wrapper[role="tablist"]').first(),
    /** All 7 stage tab elements */
    pipelineStages: page.locator('.wizard-wrapper-item[role="tab"]'),
    /** The single currently-active stage tab */
    pipelineActiveStage: page.locator('.wizard-wrapper-item.active[role="tab"]').first(),
    /** Stage tabs that have been completed (past) */
    pipelinePastStages: page.locator('.wizard-wrapper-item.past[role="tab"]'),

    // ── View Flow toggle (div — NOT a button) ───────────────────────────────
    /** Clicking this div expands/collapses the pipeline expandable area */
    viewFlowToggle: page.locator('div.expandable-area--toggle').first(),
    /** Wrapper div that is expanded/collapsed by the toggle */
    pipelineExpandableArea: page.locator('div.expandable-area').first(),

    // ── Need Help ───────────────────────────────────────────────────────────
    /** "Need Help" anchor link in the top-right of the release header */
    needHelpLink: page
      .locator('[data-block="Release.ReleaseHelp"] a, a:has-text("Need Help")')
      .first(),

    // ── Release Details tab ────────────────────────────────────────────────
    /** Default content tab on Release Detail */
    releaseDetailsTab: page.getByRole('tab', { name: /^Release Details\b/i }).first(),
    questionnaireTab: page.getByRole('tab', { name: /^Questionnaire\b/i }).first(),
    processRequirementsTab: page.getByRole('tab', { name: /^Process Requirements\b/i }).first(),
    productRequirementsTab: page.getByRole('tab', { name: /^Product Requirements\b/i }).first(),
    reviewAndConfirmTab: page.getByRole('tab', { name: /^Review\s*&\s*Confirm\b/i }).first(),
    csrrTab: page.getByRole('tab', { name: /^(Cybersecurity Residual Risks\b|CSRR\b)/i }).first(),
    fcsrDecisionTab: page.getByRole('tab', { name: /^FCSR Decision\b/i }).first(),
    dppReviewTab: page.getByRole('tab', { name: /^(Data Protection and Privacy Review\b|DPP Review\b)/i }).first(),
    startQuestionnaireButton: page.getByRole('button', { name: /Start Questionnaire/i }).first(),
    questionnaireEmptyState: page.getByText(/No questionnaire started yet!?/i).first(),
    questionnaireSubmitGuidance: page
      .getByText(/The "Submit for Review" button will be enabled, once the Questionnaire has been submitted/i)
      .first(),
    /** Nested SE product subtabs inside Release Details */
    includedSeComponentsTab: page.getByRole('tab', { name: /^Included SE Components$/i }).first(),
    partOfSeProductsTab: page.getByRole('tab', { name: /^Part of SE Products$/i }).first(),
    /** Action button shown in Included SE Components area */
    addSeProductButton: page.getByRole('button', { name: /Add SE Product/i }).first(),
    /** Header action for cancelling a Scoping release */
    cancelReleaseButton: page.getByRole('button', { name: /^Cancel Release$/i }).first(),
    /** Confirmation dialog opened by Cancel Release */
    cancelReleaseDialog: page.locator('[role="dialog"], .osui-popup, .popup-dialog')
      .filter({ hasText: /Cancel Release|cancel release|justification|reason/i })
      .last(),
    /** Modal opened from Included SE Components */
    addSeProductDialog: page.getByRole('dialog').filter({ has: page.getByText(/Add SE Component/i) }).first(),
    /** Inline edit trigger in Release Details */
    editReleaseDetailsButton: page.getByRole('button', { name: /Edit Release Details/i }).first(),
    /** Inline actions and fields rendered after entering edit mode */
    saveReleaseDetailsButton: page.getByRole('button', { name: /^Save$/ }).first(),
    cancelReleaseDetailsButton: page.getByRole('button', { name: /^Cancel$/ }).first(),
    targetReleaseDateInput: page.getByRole('textbox', { name: 'Select a date.' }).first(),
    changeSummaryTextarea: page.getByRole('textbox', { name: /Change Summary/i }).first(),
    /** Empty state observed when no related SE products are associated */
    includedSeComponentsEmptyState: page.getByText(/No Components Associated yet|There are no SE products included in this product/i).first(),

    // ── Review & Confirm tab ───────────────────────────────────────────────
    /**
     * Content tab "Review & Confirm" (osui-tabs__header-item) — NOT the pipeline wizard step.
     * Has class `disabled-tab` when the release is at Scoping stage (not yet advanced).
     */
    reviewConfirmContentTab: page
      .locator('.osui-tabs__header-item[role="tab"]')
      .filter({ hasText: /Review\s*&\s*Confirm/i })
      .first(),

    /** "REQUIREMENTS SUMMARY" collapsible accordion item */
    requirementsSummaryAccordion: page
      .locator('.osui-accordion-item')
      .filter({ has: page.getByText(/^REQUIREMENTS SUMMARY$/i) })
      .first(),

    /** Title/trigger inside the Requirements Summary accordion (role=button) */
    requirementsSummaryAccordionTitle: page
      .locator('.osui-accordion-item')
      .filter({ has: page.getByText(/^REQUIREMENTS SUMMARY$/i) })
      .locator('[role="button"]')
      .first(),

    /** "Previous FCSR Summary" collapsible accordion item */
    previousFcsrAccordion: page
      .locator('.osui-accordion-item')
      .filter({ has: page.getByText(/Previous FCSR Summary/i) })
      .first(),

    /** Title/trigger inside Previous FCSR Summary accordion */
    previousFcsrAccordionTitle: page
      .locator('.osui-accordion-item')
      .filter({ has: page.getByText(/Previous FCSR Summary/i) })
      .locator('[role="button"]')
      .first(),

    /** "SCOPE REVIEW PARTICIPANTS" section header text (CSS text-transform: uppercase; DOM text is Title Case) */
    scopeReviewParticipantsHeader: page.getByText(/scope review participants/i).first(),

    /**
     * Table/grid inside the Scope Review Participants section.
     * Supports both standard <table><th> and ARIA grid implementations.
     */
    scopeReviewParticipantsTable: page
      .locator('table, [role="grid"]')
      .filter({ has: page.locator('[role="columnheader"], th').filter({ hasText: /scope review participant name/i }) })
      .first(),

    /** "Add Participant" button — visible only when release is at Review & Confirm stage */
    addParticipantButton: page.getByRole('button', { name: /Add Participant/i }).first(),

    /** "KEY DISCUSSION TOPICS" section header text (CSS text-transform: uppercase; DOM text is Title Case) */
    keyDiscussionTopicsHeader: page.getByText(/key discussion topics/i).first(),

    /**
     * Table/grid inside the Key Discussion Topics section.
     * Supports both standard <table><th> and ARIA grid implementations.
     */
    keyDiscussionTopicsTable: page
      .locator('table, [role="grid"]')
      .filter({ has: page.locator('[role="columnheader"], th').filter({ hasText: /topic name/i }) })
      .first(),

    /** "Add Topic" button — visible only when release is at Review & Confirm stage */
    addTopicButton: page.getByRole('button', { name: /Add Topic/i }).first(),

    /** "SCOPE REVIEW DECISION" section header (CSS text-transform: uppercase; DOM text is Title Case) */
    scopeReviewDecisionHeader: page.getByText(/scope review decision/i).first(),

    /** The Scope Review Decision dropdown (select element) */
    scopeReviewDecisionDropdown: page.locator('select').filter({ has: page.locator('option').filter({ hasText: /Approved|Rework/i }) }).first(),

    /** "ACTION PLAN FOR SCOPE REVIEW DECISIONS" section header text (CSS text-transform: uppercase; DOM text is Title Case) */
    actionPlanHeader: page.getByText(/action plan for scope review decisions/i).first(),

    /** Empty state shown inside Action Plan when no actions exist */
    actionPlanEmptyState: page.getByText(/No Actions added yet/i).first(),

    /** "Add Action" button in the Action Plan section */
    addActionButton: page.getByRole('button', { name: /Add Action/i }).first(),

    /** "Submit" button shown when release is at Review & Confirm stage (advances to Manage) */
    reviewConfirmSubmitButton: page
      .locator('.content-middle-actions')
      .getByRole('button', { name: /^Submit$/i })
      .first(),

    /** "Rework" button shown when release is at Review & Confirm stage */
    reviewConfirmReworkButton: page
      .locator('.content-middle-actions')
      .getByRole('button', { name: /Rework/i })
      .first(),

    // ── Manage Stage (WF6) ─────────────────────────────────────────────────

    /**
     * "Submit for SA & PQL Sign Off" action button — visible when release is at Manage stage.
     * May also be labelled "Submit for Security & Privacy Readiness Sign Off" in some releases.
     */
    submitForSaPqlButton: page
      .getByRole('button', { name: /Submit for (SDPA?\s*&\s*PQL|SA\s*&\s*PQL|Security\s*&\s*Privacy)/i })
      .first(),

    /** Generic "Submit for ..." button in the main content actions bar (Manage stage — fallback) */
    manageStageSubmitButton: page
      .getByRole('button', { name: /^Submit for\b/i })
      .first(),

    /** "Rework" button at Manage stage */
    manageStageReworkButton: page
      .locator('.content-middle-actions, [class*="action-buttons"]')
      .getByRole('button', { name: /Rework/i })
      .first(),

    /**
     * Sidebar link to "Actions Management" page.
     * Typically rendered as an anchor below the release header sidebar.
     */
    actionsManagementLink: page
      .locator('a')
      .filter({ hasText: /Actions Management/i })
      .first(),

    /**
     * Sidebar link to "View Release History".
     */
    viewReleaseHistoryLink: page
      .locator('a')
      .filter({ hasText: /View Release History/i })
      .first(),

    /**
     * Sidebar link to "Generate Report".
     */
    generateReportLink: page
      .locator('a')
      .filter({ hasText: /Generate Report/i })
      .first(),

    // ── CSRR Tab (Cybersecurity Residual Risks) ────────────────────────────

    /**
     * The CSRR left-navigation or section list that lists the 10 CSRR sub-sections.
     * Each sub-section link is a clickable anchor in the left panel.
     */
    csrrSubSectionLinks: page
      .locator('.sidebar-nav a, [class*="csrr-nav"] a, [class*="side-nav"] a')
      .filter({ hasText: /SDL Process|Product Requirement|System Design|Threat Model|3rd Party|Static Code|Software Composition|FOSS|Security Defect|External Vuln/i }),

    /**
     * "SDL Processes Summary" section heading visible after opening the CSRR tab.
     */
    csrrSdlProcessesSummaryHeading: page
      .getByText(/SDL Processes Summary/i)
      .first(),

    /**
     * SBOM Status dropdown in the CSRR → SDL Processes Summary section.
     * id: SBOMStatusDropdown (observed in DOM)
     */
    sbomStatusDropdown: page
      .locator('select#SBOMStatusDropdown, select[id*="SBOM"]')
      .first(),

    /**
     * "SBOM Status" label — useful as a presence check.
     */
    sbomStatusLabel: page.getByText(/SBOM Status/i).first(),

    /**
     * SDL Details section within CSRR SDL Processes Summary.
     */
    sdlDetailsSection: page.getByText(/SDL Details|SDL DETAILS/i).first(),

    /**
     * Evaluation Status dropdown in CSRR sections (SDL Processes Summary, Product Requirements).
     */
    evaluationStatusDropdown: page
      .locator('select')
      .filter({ has: page.locator('option').filter({ hasText: /Not evaluated|Not met|Partially met|Fully met/i }) })
      .first(),

    /**
     * Process Requirements progress percentage shown at Manage stage.
     * Typically rendered as a span/div with a "%" sign.
     */
    processReqProgressIndicator: page
      .locator('[class*="progress"], [class*="completion"], [class*="percentage"]')
      .filter({ hasText: /%/ })
      .first(),

    // ── FCSR Decision Tab ──────────────────────────────────────────────────

    /**
     * FCSR Approval Decision dropdown on the FCSR Decision tab.
     * Options: Select / Go / Go with Post-Conditions / Go with Pre-Conditions / No-Go
     */
    fcsrApprovalDecisionDropdown: page
      .locator('select')
      .filter({ has: page.locator('option').filter({ hasText: /Go|No-Go/i }) })
      .first(),

    /**
     * "Exception Required" checkbox on the FCSR Decision tab.
     */
    exceptionRequiredCheckbox: page
      .getByRole('checkbox', { name: /Exception Required/i })
      .first(),

    /**
     * "+ Add Participant" button on the FCSR Decision tab.
     * Similar to Review & Confirm but in the FCSR Decision context.
     */
    fcsrAddParticipantButton: page
      .getByRole('button', { name: /Add\s*(FCSR\s*)?Participant/i })
      .first(),

    /**
     * FCSR participants table.
     */
    fcsrParticipantsTable: page
      .locator('table, [role="grid"]')
      .filter({ has: page.locator('[role="columnheader"], th').filter({ hasText: /FCSR Participant|Recommendation/i }) })
      .first(),

    /**
     * FCSR Decision section heading on the FCSR Decision tab.
     */
    fcsrDecisionSectionHeader: page.getByText(/FCSR Decisions?|FCSR Decision$/i).first(),
  };
}

export type ReleaseDetailLocators = ReturnType<typeof releaseDetailLocators>;
