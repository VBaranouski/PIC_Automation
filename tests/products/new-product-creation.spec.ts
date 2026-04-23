import { test, expect } from '../../src/fixtures';
import * as allure from 'allure-js-commons';

test.describe('Products - New Product Creation @regression', () => {
  // Extended timeout: filling all 4 team roles requires OutSystems search API calls,
  // each with up to 240s wait for the edit link widget to appear.
  test.setTimeout(360_000);

  test.beforeEach(async ({ newProductPage }) => {
    await newProductPage.goto();
    await newProductPage.expectNewProductFormLoaded();
  });

  test('PRODUCT-CREATION-001 — should create a new product with all required fields filled', async ({ newProductPage }) => {
    await allure.suite('Products');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.description(
      'PRODUCT-CREATION-001: Verify that a Process Quality Leader can create a new product by filling product information, ' +
      'organization details, and assigning team members for all four required roles.',
    );

    const productName = `Power Switch - Life is On ${Math.floor(Math.random() * 10000) + 1}`;

    await test.step('Fill Product Information', async () => {
      await newProductPage.fillProductInformation({
        name: productName,
        state: 'Under development (not yet released)',
        definition: 'System',
        type: 'Embedded Device',
        description: 'Automated test product for Power Switch - Life is On series. This product covers embedded device security compliance.',
      });
    });

    await test.step('Fill Product Organization', async () => {
      await newProductPage.fillProductOrganization({
        level1: 'Energy Management',
        level2: 'Home & Distribution',
        level3: 'Connected Offers',
      });
    });

    await test.step('Fill Product Team', async () => {
      await newProductPage.fillProductTeam({
        searchQuery: 'Ulad',
        fullName: 'Uladzislau Baranouski',
      });
    });

    await test.step('Re-apply core product information before save', async () => {
      // OutSystems partial refreshes during Org/Team tab operations can reset
      // not only dropdowns but also Product Name / Description on the dirty form.
      await newProductPage.fillProductInformation({
        name: productName,
        state: 'Under development (not yet released)',
        definition: 'System',
        type: 'Embedded Device',
        description: 'Automated test product for Power Switch - Life is On series. This product covers embedded device security compliance.',
      });
    });

    await test.step('Save Product and verify creation', async () => {
      await newProductPage.clickSave();
      await newProductPage.expectProductSaved();
    });
  });

  test('PRODUCT-CREATION-002-b — should display validation when saving without required fields', async ({ newProductPage }) => {
    await allure.suite('Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'PRODUCT-CREATION-002-b: Verify that the form prevents saving when required fields are empty and shows appropriate indicators.',
    );

    await test.step('Attempt to save without filling required fields', async () => {
      await newProductPage.clickSave();
    });

    await test.step('Verify inline validation errors are shown and the form stays open', async () => {
      await newProductPage.expectValidationAlertVisible();
      await newProductPage.expectRequiredFieldErrorsVisible(4);
      await newProductPage.expectFormVisible();
    });
  });

  test('PRODUCT-CREATION-003 — should cancel product creation and return to landing page', async ({ newProductPage, landingPage }) => {
    await allure.suite('Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'PRODUCT-CREATION-003: Verify that clicking Cancel on the new product form returns to the landing page without saving.',
    );

    await test.step('Fill some product information', async () => {
      await newProductPage.fillProductName('Temporary Product - Should Not Be Saved');
    });

    await test.step('Click Cancel and confirm leaving the page', async () => {
      // POM handles both the Cancel click and the OutSystems "Leave Page" modal
      await newProductPage.clickCancelAndConfirmLeave();
    });

    await test.step('Verify landing page loads after cancel', async () => {
      await landingPage.expectPageLoaded({ timeout: 60_000 });
    });
  });

  test('PRODUCT-CREATION-004 — should show cascading org level dropdowns', async ({ newProductPage }) => {
    await allure.suite('Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'PRODUCT-CREATION-004: Verify that Org Level 2 and Org Level 3 dropdowns are disabled until their parent level is selected, ' +
      'and they become enabled with correct options after parent selection.',
    );

    await test.step('Verify all Org Levels are initially disabled', async () => {
      await newProductPage.expectOrgLevelsDisabled();
    });

    await test.step('Select Org Level 1 and verify Org Level 2 becomes enabled', async () => {
      await newProductPage.selectOrgLevel1('Energy Management');
      await newProductPage.expectOrgLevel2Enabled();
    });

    await test.step('Select Org Level 2 and verify Org Level 3 becomes enabled', async () => {
      await newProductPage.selectOrgLevel2('Home & Distribution');
      await newProductPage.expectOrgLevel3Enabled();
    });
  });

  test('PRODUCT-CREATION-005A — should show the expected Product State, Product Definition, and Product Type options', async ({ newProductPage }) => {
    await allure.suite('Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'PRODUCT-CREATION-005A: Verify the New Product form exposes the expected Product State and Product Definition options, ' +
      'and that the Product Type dropdown contains the known type values for a System product.',
    );

    await test.step('Verify Product State options', async () => {
      await expect(await newProductPage.getProductStateOptions()).toEqual([
        '- Select -',
        'Under development (not yet released)',
        'Continuous Development (Released)',
        'Released (no Development)',
        'End of Life',
      ]);
    });

    await test.step('Verify Product Definition options', async () => {
      await expect(await newProductPage.getProductDefinitionOptions()).toEqual([
        '- Select -',
        'Component as a Whole',
        'None',
        'System',
      ]);
    });

    await test.step('Verify Product Type options for System definition', async () => {
      await newProductPage.selectProductDefinition('System');
      await expect(await newProductPage.getProductTypeOptions()).toEqual([
        '- Select -',
        'Brick / Library / Platform',
        'Cloud',
        'Embedded Device',
        'Host Device',
        'Hosted Application',
        'Hosted Component',
        'Mobile Application',
        'Native Software Application',
        'Network Device',
        'System',
        'Web Application',
      ]);
    });
  });

  test('PRODUCT-CREATION-006A — should reveal Digital Offer detail fields when Digital Offer is enabled', async ({ newProductPage }) => {
    await allure.suite('Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'PRODUCT-CREATION-006A: Verify enabling the Digital Offer checkbox reveals the VESTA ID, IT Owner, and Project Manager fields.',
    );

    await test.step('Enable Digital Offer', async () => {
      await newProductPage.toggleDigitalOffer();
    });

    await test.step('Verify Digital Offer details are visible', async () => {
      await newProductPage.expectDigitalOfferDetailsVisible();
    });
  });

  test('PRODUCT-CREATION-006B — should validate the required Digital Offer details before save', async ({ newProductPage }) => {
    await allure.suite('Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'PRODUCT-CREATION-006B: Verify enabling Digital Offer makes VESTA ID, IT Owner, and Project Manager required, and saving without those values shows the inline validation errors.',
    );

    const productName = `Power Switch - DOC ${Date.now()}`;

    await test.step('Fill all non-Digital-Offer required fields', async () => {
      await newProductPage.fillProductInformation({
        name: productName,
        state: 'Under development (not yet released)',
        definition: 'System',
        type: 'Embedded Device',
        description: 'Automation-created product for Digital Offer validation coverage.',
      });

      await newProductPage.toggleDigitalOffer();
      await newProductPage.expectDigitalOfferDetailsVisible();

      await newProductPage.fillProductOrganization({
        level1: 'Energy Management',
        level2: 'Home & Distribution',
        level3: 'Connected Offers',
      });

      await newProductPage.fillProductTeam({
        searchQuery: 'Ulad',
        fullName: 'Uladzislau Baranouski',
      });
    });

    await test.step('Re-apply base product information before save', async () => {
      await newProductPage.fillProductInformation({
        name: productName,
        state: 'Under development (not yet released)',
        definition: 'System',
        type: 'Embedded Device',
        description: 'Automation-created product for Digital Offer validation coverage.',
      });
    });

    await test.step('Attempt to save without VESTA ID, IT Owner, and Project Manager', async () => {
      await newProductPage.clickSaveWithOrgLevelRecovery();
      await newProductPage.expectEditModeVisible();
      await newProductPage.expectValidationAlertVisible();
      await newProductPage.expectRequiredFieldErrorsVisible(3);
    });
  });

  test('PRODUCT-CREATION-006C — should support the + Add VESTA ID row and user lookup selection in Digital Offer details', async ({ newProductPage }) => {
    await allure.suite('Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'PRODUCT-CREATION-006C: Verify the Digital Offer details section shows the + Add VESTA ID row and that the IT Owner and Project Manager lookup fields accept selection from search results.',
    );

    const vestaId = `${Math.floor(Math.random() * 90000) + 10000}`;

    await test.step('Enable Digital Offer and reveal its details', async () => {
      await newProductPage.toggleDigitalOffer();
      await newProductPage.expectDigitalOfferDetailsVisible();
    });

    await test.step('Fill VESTA ID and assign IT Owner and Project Manager', async () => {
      await newProductPage.fillDigitalOfferDetails({
        vestaId,
        searchQuery: 'Ulad',
        itOwnerFullName: 'Uladzislau Baranouski',
        projectManagerFullName: 'Uladzislau Baranouski',
      });
    });

    await test.step('Verify the row, VESTA value, and selected users are shown', async () => {
      await newProductPage.expectDigitalOfferDetailsFunctional('Uladzislau Baranouski', vestaId);
    });
  });

  test('PRODUCT-CREATION-007A — should show the DPP confirmation dialog and create the product only after save is confirmed', async ({ newProductPage }) => {
    await allure.suite('Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'PRODUCT-CREATION-007A: Verify enabling Data Protection & Privacy on a new product triggers the Save Product confirmation dialog, ' +
      'that Cancel keeps the user on the form, and that confirming Save completes product creation with DPP enabled.',
    );

    const productName = `Power Switch - DPP ${Date.now()}`;

    await test.step('Fill required product fields and enable DPP', async () => {
      await newProductPage.fillProductInformation({
        name: productName,
        state: 'Under development (not yet released)',
        definition: 'System',
        type: 'Embedded Device',
        description: 'Automation-created product for DPP confirmation coverage.',
      });
      await newProductPage.toggleDataProtection();
    });

    await test.step('Fill Product Organization and Product Team', async () => {
      await newProductPage.fillProductOrganization({
        level1: 'Energy Management',
        level2: 'Home & Distribution',
        level3: 'Connected Offers',
      });
      await newProductPage.fillProductTeam({
        searchQuery: 'Ulad',
        fullName: 'Uladzislau Baranouski',
      });
    });

    await test.step('Re-apply core product information before save', async () => {
      await newProductPage.fillProductInformation({
        name: productName,
        state: 'Under development (not yet released)',
        definition: 'System',
        type: 'Embedded Device',
        description: 'Automation-created product for DPP confirmation coverage.',
      });
    });

    await test.step('Click Save and cancel the DPP confirmation dialog', async () => {
      await newProductPage.clickSave();
      await newProductPage.expectSaveConfirmDialogVisible();
      await newProductPage.cancelSaveConfirmDialog();
      await newProductPage.expectEditModeVisible();
      await expect(newProductPage.dataProtectionCheckbox).toBeChecked();
    });

    await test.step('Click Save again, confirm, and verify product creation completes', async () => {
      await newProductPage.clickSave();
      await newProductPage.expectSaveConfirmDialogVisible();
      await newProductPage.confirmSaveConfirmDialog();
      await newProductPage.expectProductSaved();
      await newProductPage.expectDataProtectionValue('Yes');
    });
  });

  test('PRODUCT-CREATION-008A — should restore default values when Reset Form is clicked on the New Product form', async ({ newProductPage }) => {
    await allure.suite('Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'PRODUCT-CREATION-008A: Verify Reset Form clears the dirty New Product form back to its default values without leaving the screen.',
    );

    await test.step('Fill several fields to make the form dirty', async () => {
      await newProductPage.fillProductName(`Reset Candidate ${Date.now()}`);
      await newProductPage.selectProductState('Under development (not yet released)');
      await newProductPage.selectProductDefinition('System');
      await newProductPage.selectProductType('Embedded Device');
      await newProductPage.toggleDigitalOffer();
    });

    await test.step('Click Reset Form', async () => {
      await newProductPage.clickResetForm();
    });

    await test.step('Verify default values are restored and the form stays open', async () => {
      await newProductPage.expectFormVisible();
      await expect(newProductPage.productNameInput).toHaveValue('');
      await expect(newProductPage.productStateSelect).toHaveValue('-1');
      await expect(newProductPage.productDefinitionSelect).toHaveValue('-1');
      await expect(newProductPage.productTypeSelect).toHaveValue('-1');
      await expect(newProductPage.digitalOfferCheckbox).not.toBeChecked();
    });
  });

  test('PRODUCT-CREATION-009A — should refresh Product Type options when Product Definition changes', async ({ newProductPage }) => {
    await allure.suite('Products');
    await allure.severity('normal');
    await allure.tag('regression');
    test.fail(true, 'QA currently returns the same Product Type option list for every Product Definition value; the expected cascade is not observed.');
    await allure.description(
      'PRODUCT-CREATION-009A: Verify changing Product Definition refreshes the Product Type option list instead of keeping the same values for every definition.',
    );

    await test.step('Capture Product Type options for System definition', async () => {
      await newProductPage.selectProductDefinition('System');
      const systemTypeOptions = await newProductPage.getProductTypeOptions();

      await newProductPage.selectProductDefinition('None');
      const noneTypeOptions = await newProductPage.getProductTypeOptions();

      expect(noneTypeOptions).not.toEqual(systemTypeOptions);
    });
  });

  test('PRODUCT-CREATION-010A — should reveal Development Org Level fields when Cross-Organizational Development is enabled', async ({ newProductPage }) => {
    await allure.suite('Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'PRODUCT-CREATION-010A: Verify enabling Cross-Organizational Development reveals Development Org Level 1, 2, and 3 fields on the Product Organization tab.',
    );

    await test.step('Open Product Organization tab', async () => {
      await newProductPage.clickProductOrganizationTab();
    });

    await test.step('Enable Cross-Organizational Development', async () => {
      await newProductPage.toggleCrossOrgDevelopment();
    });

    await test.step('Verify Development Org Level fields are visible', async () => {
      await newProductPage.expectCrossOrgDevelopmentFieldsVisible();
    });
  });

  test('PRODUCT-CREATION-011A — should require Vendor when Brand Label is enabled', async ({ newProductPage }) => {
    await allure.suite('Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'PRODUCT-CREATION-011A: Verify enabling Brand Label makes the Vendor field active and that leaving Vendor empty blocks saving a fully completed new product form.',
    );

    const productName = `Power Switch - Brand ${Date.now()}`;

    await test.step('Fill the required new product data except Vendor', async () => {
      await newProductPage.fillProductInformation({
        name: productName,
        state: 'Under development (not yet released)',
        definition: 'System',
        type: 'Embedded Device',
        description: 'Automation-created product for Brand Label vendor validation coverage.',
      });

      await newProductPage.fillProductOrganization({
        level1: 'Energy Management',
        level2: 'Home & Distribution',
        level3: 'Connected Offers',
      });

      await newProductPage.fillProductTeam({
        searchQuery: 'Ulad',
        fullName: 'Uladzislau Baranouski',
      });
    });

    await test.step('Enable Brand Label and verify Vendor becomes editable', async () => {
      await newProductPage.toggleBrandLabel();
      await newProductPage.expectVendorEnabled();
      await expect(newProductPage.vendorInput).toHaveValue('');
    });

    await test.step('Re-apply product information before save', async () => {
      await newProductPage.fillProductInformation({
        name: productName,
        state: 'Under development (not yet released)',
        definition: 'System',
        type: 'Embedded Device',
        description: 'Automation-created product for Brand Label vendor validation coverage.',
      });
    });

    await test.step('Attempt to save without Vendor and verify validation blocks creation', async () => {
      await newProductPage.clickSaveWithOrgLevelRecovery();
      await newProductPage.expectEditModeVisible();
      await newProductPage.expectVendorRequiredValidationVisible();
    });
  });

  test('PRODUCT-CREATION-012A — should show Vendor as mandatory immediately when Brand Label is enabled', async ({ newProductPage, page }) => {
    await allure.suite('Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'PRODUCT-CREATION-012A: Verify enabling Brand Label immediately marks Vendor as mandatory through required semantics and mandatory styling on the form.',
    );

    await test.step('Enable Brand Label', async () => {
      await newProductPage.toggleBrandLabel();
    });

    await test.step('Verify Vendor label becomes mandatory immediately', async () => {
      await newProductPage.expectVendorMarkedRequired();
    });
  });
});
