import { test, expect } from '../../src/fixtures';
import * as allure from 'allure-js-commons';

/**
 * Product Configuration — Tracking Tools: Jira & Jama (Section 3.8)
 *
 * Covers the Tracking Tools Configuration section inside the Product Details
 * edit mode → Product Configuration tab. Tests verify:
 *   — Jira toggle reveals Source Link + Project Key fields
 *   — Jira toggle auto-assigns radio selections (Product + Process reqs)
 *   — Jama toggle reveals Project Id field
 *   — Jama toggle auto-assigns Product requirements radio only (Process stays N/A)
 *   — Test Connection button visibility
 *   — Status Mapping Configuration link visibility
 *   — Warning message visibility
 *   — Save-with-empty-fields shows validation error
 *
 * Test product: ProductId=1133 (AutoTest Exploration Product 2026-03-28)
 * — No active releases, so tracking tool fields are editable.
 * — All tests cancel without saving to leave no side effects.
 *
 * Plan reference: docs/ai/automation-testing-plan.md §3.8
 * Spec file:      products/tracking-tools.spec.ts
 */

const PRODUCT_URL =
  '/GRC_PICASso/ProductDetail?ProductId=1133';

test.describe('Product Configuration — Tracking Tools @regression', () => {
  test.setTimeout(180_000);

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
  });

  // ────────────────────────────────────────────────────────────────────────────
  // TRACKING-TOOLS-001 — Product Configuration tab is accessible
  // ────────────────────────────────────────────────────────────────────────────
  test(
    'TRACKING-TOOLS-001: Product Configuration tab is accessible as 4th sub-tab in edit mode',
    async ({ newProductPage, page }) => {
      await allure.suite('Products - Tracking Tools Configuration');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'TRACKING-TOOLS-001: Navigate to a product in edit mode and verify the ' +
        '"Product Configuration" sub-tab is visible and shows the TRACKING TOOLS CONFIGURATION section.',
      );

      await test.step('Navigate to product detail page', async () => {
        await page.goto(PRODUCT_URL);
        await newProductPage.expectProductDetailLoaded();
      });

      await test.step('Enter edit mode', async () => {
        await newProductPage.clickEditProductAndWaitForForm();
      });

      await test.step('Verify Product Configuration tab is visible', async () => {
        await expect(newProductPage.productConfigurationTab).toBeVisible({ timeout: 15_000 });
      });

      await test.step('Click Product Configuration tab', async () => {
        await newProductPage.clickProductConfigurationTab();
      });

      await test.step('Verify TRACKING TOOLS CONFIGURATION section is shown', async () => {
        await expect(page.getByText('TRACKING TOOLS CONFIGURATION', { exact: true })).toBeVisible();
        await expect(page.getByText('ASSIGN TRACKING TOOLS', { exact: true })).toBeVisible();
        await expect(newProductPage.jiraSwitch).toBeVisible();
        await expect(newProductPage.jamaSwitch).toBeVisible();
      });

      await test.step('Cancel edit mode', async () => {
        await newProductPage.clickCancelAndReturnToViewMode();
      });
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // TRACKING-TOOLS-002 — Jira toggle reveals Source Link + Project Key fields
  // ────────────────────────────────────────────────────────────────────────────
  test(
    'TRACKING-TOOLS-002: Enabling Jira toggle reveals "Jira Source Link" and "Jira Project Key" fields',
    async ({ newProductPage, page }) => {
      await allure.suite('Products - Tracking Tools Configuration');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'TRACKING-TOOLS-002: After enabling the Jira toggle in Product Configuration, ' +
        '"Jira Source Link" and "Jira Project Key" fields appear.',
      );

      await test.step('Navigate to product in edit mode → Product Configuration tab', async () => {
        await page.goto(PRODUCT_URL);
        await newProductPage.expectProductDetailLoaded();
        await newProductPage.clickEditProductAndWaitForForm();
        await newProductPage.clickProductConfigurationTab();
      });

      await test.step('Verify Jira/Jama fields are NOT visible before enabling', async () => {
        await expect(newProductPage.jiraSourceLinkInput).not.toBeVisible();
        await expect(newProductPage.jiraProjectKeyInput).not.toBeVisible();
      });

      await test.step('Enable Jira toggle', async () => {
        await newProductPage.enableJiraToggle();
      });

      await test.step('Verify Jira fields are revealed', async () => {
        await newProductPage.expectJiraFieldsVisible();
        await expect(newProductPage.jiraSourceLinkInput).toHaveAttribute('placeholder', 'Insert project source link');
        await expect(newProductPage.jiraProjectKeyInput).toHaveAttribute('placeholder', 'Insert project authentication key');
      });

      await test.step('Cancel edit mode', async () => {
        await newProductPage.clickCancelAndReturnToViewMode();
      });
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // TRACKING-TOOLS-003 — Jira toggle auto-selects both radio groups
  // ────────────────────────────────────────────────────────────────────────────
  test(
    'TRACKING-TOOLS-003: Enabling Jira auto-selects "Jira" in Product requirements AND Process requirements radios',
    async ({ newProductPage, page }) => {
      await allure.suite('Products - Tracking Tools Configuration');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'TRACKING-TOOLS-003: Enabling the Jira toggle automatically sets the ' +
        '"Product requirements tracking tool" radio to Jira AND the ' +
        '"Process requirements and issues tracking tool" radio to Jira.',
      );

      await test.step('Navigate to product in edit mode → Product Configuration tab', async () => {
        await page.goto(PRODUCT_URL);
        await newProductPage.expectProductDetailLoaded();
        await newProductPage.clickEditProductAndWaitForForm();
        await newProductPage.clickProductConfigurationTab();
      });

      await test.step('Verify radios default to Not Applicable (both disabled)', async () => {
        await expect(newProductPage.productReqNotApplicableRadio).toBeChecked();
        await expect(newProductPage.processReqNotApplicableRadio).toBeChecked();
        // Jira radios are disabled while no toggle is active
        await expect(newProductPage.productReqJiraRadio).toBeDisabled();
        await expect(newProductPage.processReqJiraRadio).toBeDisabled();
      });

      await test.step('Enable Jira toggle', async () => {
        await newProductPage.enableJiraToggle();
      });

      await test.step('Verify Product requirements radio auto-switched to Jira', async () => {
        await expect(newProductPage.productReqJiraRadio).toBeChecked();
        await expect(newProductPage.productReqNotApplicableRadio).not.toBeChecked();
      });

      await test.step('Verify Process requirements radio auto-switched to Jira', async () => {
        await expect(newProductPage.processReqJiraRadio).toBeChecked();
        await expect(newProductPage.processReqNotApplicableRadio).not.toBeChecked();
      });

      await test.step('Cancel edit mode', async () => {
        await newProductPage.clickCancelAndReturnToViewMode();
      });
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // TRACKING-TOOLS-004 — Test Connection button appears after Jira enabled
  // ────────────────────────────────────────────────────────────────────────────
  test(
    'TRACKING-TOOLS-004: "Test Connection" button appears next to Jira toggle after enabling',
    async ({ newProductPage, page }) => {
      await allure.suite('Products - Tracking Tools Configuration');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'TRACKING-TOOLS-004: After enabling the Jira toggle, a "Test Connection" ' +
        'button becomes visible next to the Jira section.',
      );

      await test.step('Navigate to product in edit mode → Product Configuration tab', async () => {
        await page.goto(PRODUCT_URL);
        await newProductPage.expectProductDetailLoaded();
        await newProductPage.clickEditProductAndWaitForForm();
        await newProductPage.clickProductConfigurationTab();
      });

      await test.step('Verify Test Connection button is NOT visible before enabling', async () => {
        await expect(newProductPage.testConnectionButton).not.toBeVisible();
      });

      await test.step('Enable Jira toggle', async () => {
        await newProductPage.enableJiraToggle();
      });

      await test.step('Verify Test Connection button is now visible', async () => {
        await expect(newProductPage.testConnectionButton).toBeVisible({ timeout: 10_000 });
      });

      await test.step('Cancel edit mode', async () => {
        await newProductPage.clickCancelAndReturnToViewMode();
      });
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // TRACKING-TOOLS-005 — Status Mapping Configuration link appears after Jira enabled
  // ────────────────────────────────────────────────────────────────────────────
  test(
    'TRACKING-TOOLS-005: "Status Mapping Configuration" link appears after enabling Jira toggle',
    async ({ newProductPage, page }) => {
      await allure.suite('Products - Tracking Tools Configuration');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'TRACKING-TOOLS-005: After enabling the Jira toggle, a "Status Mapping Configuration" ' +
        'link appears next to the Jira section in Product Configuration tab.',
      );

      await test.step('Navigate to product in edit mode → Product Configuration tab', async () => {
        await page.goto(PRODUCT_URL);
        await newProductPage.expectProductDetailLoaded();
        await newProductPage.clickEditProductAndWaitForForm();
        await newProductPage.clickProductConfigurationTab();
      });

      await test.step('Enable Jira toggle', async () => {
        await newProductPage.enableJiraToggle();
      });

      await test.step('Verify Status Mapping Configuration link is visible', async () => {
        await expect(newProductPage.statusMappingConfigLinks.first()).toBeVisible({ timeout: 10_000 });
      });

      await test.step('Cancel edit mode', async () => {
        await newProductPage.clickCancelAndReturnToViewMode();
      });
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // TRACKING-TOOLS-006 — Warning message appears after enabling Jira
  // ────────────────────────────────────────────────────────────────────────────
  test(
    'TRACKING-TOOLS-006: Warning message "Please update the mapping configuration..." appears after enabling Jira',
    async ({ newProductPage, page }) => {
      await allure.suite('Products - Tracking Tools Configuration');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'TRACKING-TOOLS-006: After enabling any tracking tool toggle, an informational warning message ' +
        'appears below the radio groups urging the user to update status mapping configuration.',
      );

      await test.step('Navigate to product in edit mode → Product Configuration tab', async () => {
        await page.goto(PRODUCT_URL);
        await newProductPage.expectProductDetailLoaded();
        await newProductPage.clickEditProductAndWaitForForm();
        await newProductPage.clickProductConfigurationTab();
      });

      await test.step('Enable Jira toggle', async () => {
        await newProductPage.enableJiraToggle();
      });

      await test.step('Verify warning message is visible', async () => {
        await newProductPage.expectTrackingToolsWarningVisible();
      });

      await test.step('Cancel edit mode', async () => {
        await newProductPage.clickCancelAndReturnToViewMode();
      });
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // TRACKING-TOOLS-007 — Jama toggle reveals Jama Project Id field
  // ────────────────────────────────────────────────────────────────────────────
  test(
    'TRACKING-TOOLS-007: Enabling Jama toggle reveals "Jama Project Id" input field',
    async ({ newProductPage, page }) => {
      await allure.suite('Products - Tracking Tools Configuration');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'TRACKING-TOOLS-007: After enabling the Jama toggle in Product Configuration, ' +
        'a "Jama Project Id" text input appears (placeholder: "Insert project id").',
      );

      await test.step('Navigate to product in edit mode → Product Configuration tab', async () => {
        await page.goto(PRODUCT_URL);
        await newProductPage.expectProductDetailLoaded();
        await newProductPage.clickEditProductAndWaitForForm();
        await newProductPage.clickProductConfigurationTab();
      });

      await test.step('Verify Jama Project Id field is NOT visible before enabling', async () => {
        await expect(newProductPage.jamaProjectIdInput).not.toBeVisible();
      });

      await test.step('Enable Jama toggle', async () => {
        await newProductPage.enableJamaToggle();
      });

      await test.step('Verify Jama Project Id field is revealed', async () => {
        await newProductPage.expectJamaFieldsVisible();
        await expect(newProductPage.jamaProjectIdInput).toHaveAttribute('placeholder', 'Insert project id');
      });

      await test.step('Cancel edit mode', async () => {
        await newProductPage.clickCancelAndReturnToViewMode();
      });
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // TRACKING-TOOLS-008 — Jama auto-selects Product reqs only; Process stays N/A
  // ────────────────────────────────────────────────────────────────────────────
  test(
    'TRACKING-TOOLS-008: Enabling Jama auto-selects "Jama" for Product requirements; Process requirements stays "Not Applicable"',
    async ({ newProductPage, page }) => {
      await allure.suite('Products - Tracking Tools Configuration');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'TRACKING-TOOLS-008: Enabling Jama toggle sets "Product requirements tracking tool" radio to Jama, ' +
        'but "Process requirements and issues tracking tool" stays at Not Applicable ' +
        '(Jama is not available for Process requirements).',
      );

      await test.step('Navigate to product in edit mode → Product Configuration tab', async () => {
        await page.goto(PRODUCT_URL);
        await newProductPage.expectProductDetailLoaded();
        await newProductPage.clickEditProductAndWaitForForm();
        await newProductPage.clickProductConfigurationTab();
      });

      await test.step('Enable Jama toggle', async () => {
        await newProductPage.enableJamaToggle();
      });

      await test.step('Verify Product requirements radio auto-switched to Jama', async () => {
        await expect(newProductPage.productReqJamaRadio).toBeChecked();
        await expect(newProductPage.productReqNotApplicableRadio).not.toBeChecked();
      });

      await test.step('Verify Process requirements stays at Not Applicable (Jama not available for Process)', async () => {
        await expect(newProductPage.processReqNotApplicableRadio).toBeChecked();
        // Process Jira radio is disabled since Jama doesn't drive process reqs
        await expect(newProductPage.processReqJiraRadio).toBeDisabled();
      });

      await test.step('Cancel edit mode', async () => {
        await newProductPage.clickCancelAndReturnToViewMode();
      });
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // TRACKING-TOOLS-009 — When Jama enabled, Jira radio for Product reqs is disabled
  // ────────────────────────────────────────────────────────────────────────────
  test(
    'TRACKING-TOOLS-009: When Jama is enabled, "Jira" radio for Product requirements is disabled',
    async ({ newProductPage, page }) => {
      await allure.suite('Products - Tracking Tools Configuration');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'TRACKING-TOOLS-009: Once Jama is enabled, the "Jira" option in the Product requirements ' +
        'radio group becomes disabled — user cannot assign both Jama and Jira to Product requirements simultaneously.',
      );

      await test.step('Navigate to product in edit mode → Product Configuration tab', async () => {
        await page.goto(PRODUCT_URL);
        await newProductPage.expectProductDetailLoaded();
        await newProductPage.clickEditProductAndWaitForForm();
        await newProductPage.clickProductConfigurationTab();
      });

      await test.step('Enable Jama toggle', async () => {
        await newProductPage.enableJamaToggle();
      });

      await test.step('Verify Product requirements Jira radio is disabled when Jama is active', async () => {
        await expect(newProductPage.productReqJiraRadio).toBeDisabled();
      });

      await test.step('Cancel edit mode', async () => {
        await newProductPage.clickCancelAndReturnToViewMode();
      });
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // TRACKING-TOOLS-010 — Saving with Jira enabled but empty fields shows validation error
  // ────────────────────────────────────────────────────────────────────────────
  test(
    'TRACKING-TOOLS-010: Saving with Jira enabled but empty Jira Source Link / Project Key shows validation error',
    async ({ newProductPage, page }) => {
      await allure.suite('Products - Tracking Tools Configuration');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'TRACKING-TOOLS-010: After enabling Jira and leaving both Jira Source Link and ' +
        'Jira Project Key empty, clicking Save shows a "Required field!" validation error.',
      );

      await test.step('Navigate to product in edit mode → Product Configuration tab', async () => {
        await page.goto(PRODUCT_URL);
        await newProductPage.expectProductDetailLoaded();
        await newProductPage.clickEditProductAndWaitForForm();
        await newProductPage.clickProductConfigurationTab();
      });

      await test.step('Enable Jira toggle (fields remain empty)', async () => {
        await newProductPage.enableJiraToggle();
        // Confirm fields are empty
        await expect(newProductPage.jiraSourceLinkInput).toHaveValue('');
        await expect(newProductPage.jiraProjectKeyInput).toHaveValue('');
      });

      await test.step('Click Save and observe validation error', async () => {
        await newProductPage.clickSave();
        // OutSystems shows a top-of-page alert when required fields are empty.
        // (Per-field "Required field!" spans exist in DOM permanently — hidden by default —
        // so we assert the visible alert banner instead.)
        const validationAlert = page.getByRole('alert').filter({ hasText: /review the necessary fields/i }).first();
        await expect(validationAlert).toBeVisible({ timeout: 15_000 });
      });

      await test.step('Cancel edit mode (validation blocked the save — no changes persisted)', async () => {
        await newProductPage.clickCancelAndReturnToViewMode();
      });
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // TRACKING-TOOLS-011 — Jira Test Connection (skipped — needs real Jira credentials)
  // ────────────────────────────────────────────────────────────────────────────
  test(
    'TRACKING-TOOLS-011: Jira Test Connection — success shows green confirmation',
    async ({ newProductPage, page }) => {
      await allure.suite('Products - Tracking Tools Configuration');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'TRACKING-TOOLS-011: With valid Jira Source Link and Project Key, clicking ' +
        '"Test Connection" shows a green confirmation message. ' +
        'Skipped: requires a valid Jira server and credentials configured on QA env.',
      );

      test.skip(true, 'TRACKING-TOOLS-011: Skipped — requires valid Jira server URL and credentials. ' +
        'Test Connection result depends on external Jira availability on QA env.');

      await page.goto(PRODUCT_URL);
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // TRACKING-TOOLS-012 — Deactivating toggle resets fields and radios (fixme — destructive)
  // ────────────────────────────────────────────────────────────────────────────
  test(
    'TRACKING-TOOLS-012: Deactivating a tracking tool resets related fields and radio to "Not Applicable"',
    async ({ newProductPage, page }) => {
      await allure.suite('Products - Tracking Tools Configuration');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'TRACKING-TOOLS-012: Deferred — requires saving a product with an active Jira/Jama config, ' +
        'then re-editing to disable it and verifying that the fields are cleared. ' +
        'Marked test.fixme as it modifies a shared test product configuration.',
      );

      test.fixme(true, 'TRACKING-TOOLS-012: Deferred — destructive test requiring a product with pre-configured Jira/Jama.');

      await page.goto(PRODUCT_URL);
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // TRACKING-TOOLS-013 — Jira Test Connection with invalid credentials shows red error
  // ────────────────────────────────────────────────────────────────────────────
  test(
    'TRACKING-TOOLS-013: Jira Test Connection — invalid credentials or URL shows a red error message',
    async ({ newProductPage, page }) => {
      await allure.suite('Products - Tracking Tools Configuration');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'TRACKING-TOOLS-013: After enabling Jira and entering an invalid URL + invalid Project Key, ' +
        'clicking Test Connection must surface a visible error indicator.',
      );

      await test.step('Navigate to product in edit mode → Product Configuration tab', async () => {
        await page.goto(PRODUCT_URL);
        await newProductPage.expectProductDetailLoaded();
        await newProductPage.clickEditProductAndWaitForForm();
        await newProductPage.clickProductConfigurationTab();
      });

      await test.step('Enable Jira toggle and enter invalid Source Link + Project Key', async () => {
        await newProductPage.enableJiraToggle();
        await newProductPage.jiraSourceLinkInput.fill('https://invalid-jira.example.invalid');
        await newProductPage.jiraProjectKeyInput.fill('INVALIDKEY-DOES-NOT-EXIST');
      });

      await test.step('Click Test Connection and verify an error indicator is visible', async () => {
        await newProductPage.testConnectionButton.click();
        // PICASso surfaces an error via an OutSystems alert/banner. Match the alert role and known wording.
        const errorAlert = page.getByRole('alert').filter({
          hasText: /unable to connect|connection (failed|error|could not|unsuccessful)|invalid (url|credentials|project key)/i,
        }).first();
        await expect(errorAlert).toBeVisible({ timeout: 30_000 });
      });

      await test.step('Cancel edit mode (validation/error state — no save attempted)', async () => {
        await newProductPage.clickCancelAndConfirmLeave();
      });
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // TRACKING-TOOLS-014 — Activating Jama reveals Email Notifications Recipients pre-filled with PO + SM
  // ────────────────────────────────────────────────────────────────────────────
  test(
    'TRACKING-TOOLS-014: Activating Jama toggle reveals Email Notifications Recipients with at least 2 default entries',
    async ({ newProductPage, page }) => {
      await allure.suite('Products - Tracking Tools Configuration');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'TRACKING-TOOLS-014: After enabling Jama, the Email Notifications Recipients section is visible ' +
        'and is pre-filled with at least the Product Owner and Security Manager entries.',
      );

      test.fixme(true, 'TRACKING-TOOLS-014: Knowledge gap — the "Email Notifications Recipients" section ' +
        'is not surfaced by the Jama toggle on the shared exploration product (ProductId=1133). ' +
        'Awaiting QA confirmation of the exact UI wording / location of the recipients section ' +
        'and whether it requires a saved Jama configuration to appear.');

      await page.goto(PRODUCT_URL);
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // TRACKING-TOOLS-016 — Jira Test Connection with valid credentials (skipped — needs real Jira)
  // ────────────────────────────────────────────────────────────────────────────
  test(
    'TRACKING-TOOLS-016: Jira Test Connection — valid credentials show success confirmation',
    async ({ newProductPage, page }) => {
      await allure.suite('Products - Tracking Tools Configuration');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'TRACKING-TOOLS-016: With valid Jira Source Link and Project Key, clicking ' +
        '"Test Connection" must show a success confirmation message. ' +
        'Skipped: requires valid Jira server URL and credentials configured on QA env.',
      );

      test.skip(true, 'TRACKING-TOOLS-016: Skipped — requires valid Jira server URL and credentials. ' +
        'Test Connection success depends on external Jira availability on QA env.');

      await page.goto(PRODUCT_URL);
    },
  );
});
