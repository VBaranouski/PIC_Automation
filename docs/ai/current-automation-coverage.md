# Current Automation Coverage

## Last updated

2026-04-03

This note is a practical reference for what is already automated in `projects/pw-autotest` today.
It is intentionally free-form and written for future prompt and test-generation work.

## High-level snapshot

Current Playwright automation is centered around five business areas:

1. authentication
2. landing page tab and grid behavior
3. product creation and product detail navigation
4. existing product editing from `My Products`
5. DOC initiation and post-initiation verification

There are currently **8 test files** in `projects/pw-autotest/tests`.
The framework already has page objects, locator factories, shared fixtures, and wait helpers for the flows above.

## What is automated now

### 1. Environment smoke

File:

- `projects/pw-autotest/tests/seed.spec.ts`

Coverage:

- base URL is reachable
- page does not stay on `about:blank`

Purpose:

- lightweight environment sanity check

---

### 2. Authentication

File:

- `projects/pw-autotest/tests/auth/login.spec.ts`

Coverage:

- `AUTH-LOGIN-001` — login page loads with expected UI elements (heading, username, password, Login, Login SSO, Remember Me, Forgot Password)
- `AUTH-LOGIN-002` — valid login redirects to landing page; logged-in username visible in header; navigation menu visible; landing tabs visible
- `AUTH-LOGIN-003` — invalid credentials keep user on login page
- `AUTH-LOGIN-004` — empty form submission keeps user on login page
- `AUTH-SSO-002` — clicking Login SSO button redirects to Ping SSO identity provider ✅
- `AUTH-FPW-001` — "Forgot password?" link test is automated but **marked `test.fail()`** (known bug: `href="#"`, no redirect occurs) ❌ expected failure
- `AUTH-SSO-001` — valid SSO full login flow: **out of E2E scope** (redirects to external Ping IdP, requires live Ping credentials) ⏭️ skipped
- `AUTH-SSO-003` — invalid/unauthorized SSO identity: **out of E2E scope** (requires Ping IdP interaction) ⏭️ skipped

Supporting source files:

- `projects/pw-autotest/src/pages/login.page.ts`
- `projects/pw-autotest/src/locators/auth.locators.ts`

Notes:

- current negative checks mostly verify that the user remains on the login page
- explicit error-message assertions are not implemented yet
- SSO button and remember-me checkbox are modeled, but not deeply tested

---

### 3. Landing page

File:

- `projects/pw-autotest/tests/landing/landing-page.spec.ts`
- `projects/pw-autotest/tests/landing/my-docs-tab.spec.ts`

Coverage (updated 2026-04-03):

- `LANDING-HOME-001` — all 5 tabs visible after login
- `LANDING-TAB-DEFAULT-001` — My Tasks tab is selected by default after login ✅
- `LANDING-HOME-002` — each tab loads content (tabpanel + column headers)
- `LANDING-TASKS-COLS-001` — all required My Tasks columns present (Name, Description, Status, Product, Release, VESTA Id, PROCESS TYPE, Assignee, DOC Lead, Product Owner, Security Manager) ✅
- `LANDING-TASKS-TOGGLE-001` — Show Closed Tasks is OFF by default ✅
- `LANDING-HOME-005/006/007` — Show Closed Tasks toggle, per-page, pagination on My Tasks
- `LANDING-HOME-008-011` — My Products: columns, Show Active Only default, toggle, per-page
- Products: search by name, by Product ID, Reset, navigate to Product Detail
- `LANDING-HOME-012-015` — My Releases: columns, Show Active Only, toggle, pagination
- `LANDING-HOME-016-018` — My DOCs: columns, filters, data
- `LANDING-HOME-019-023` — Reports & Dashboards: columns, Tableau link, More Filters, per-page
- `LANDING-HEADER-001` — New Product button visible ✅
- `LANDING-HEADER-002` — New Product button navigates to ProductDetail (new product form) ✅
- `LANDING-HEADER-003` — Roles Delegation link visible ✅
- `LANDING-HEADER-004` — Roles Delegation link opens page in new tab ✅
- `LANDING-HEADER-005` — Header logo navigates back to Landing Page ✅

My Tasks Filters & Navigation (added 2026-04-28):

- `LANDING-TASKS-SEARCH-001` — Search input narrows My Tasks grid by task name ✅
- `LANDING-TASKS-RESET-001` — Reset clears all My Tasks filters and restores default state ✅
- `LANDING-TASKS-REVIEW-001` — Review button navigates to Release Detail or DOC Detail page ✅

My Products Advanced Navigation (added 2026-04-28):

- `LANDING-PRODS-LATEST-001` — Latest Release link navigates to Release Detail page ✅
- `LANDING-PRODS-ORG1-001` — Org Level 1 filter narrows My Products results ✅
- `LANDING-PRODS-ACTIONS-001` — Three-dot Actions menu shows Inactivate option ✅

My Releases Filters & Navigation (added 2026-04-28):

- `LANDING-RELS-NAV-001` — Clicking a release name navigates to Release Detail page ✅
- `LANDING-RELS-SEARCH-001` — Release name search combobox filter ✅
- `LANDING-RELS-STATUS-001` — Status dropdown filter narrows My Releases results ✅
- `LANDING-RELS-RESET-001` — Reset clears My Releases filters and restores Show Active Only ✅

Supporting source files:

- `projects/pw-autotest/src/pages/landing.page.ts`
- `projects/pw-autotest/src/locators/landing.locators.ts`

Notes:

- landing page POM is the most reusable navigation hub in the current suite
- it contains helpers for tabs, pagination, filter reset, product navigation, and header actions
- `My DOCs` and `Reports & Dashboards` get baseline tab-load coverage, but not deep business assertions yet

---

### 4. My Products tab exploratory coverage

File:

- `projects/pw-autotest/tests/products/my-products-tab.spec.ts`

Coverage:

- search by product name through combobox filter
- search by product ID through combobox filter
- `Show Active Only` toggle and reset behavior
- pagination forward and backward behavior
- navigation from product grid row into product detail page
- product name and product ID visibility on the target product detail screen

Supporting source files:

- `projects/pw-autotest/src/pages/landing.page.ts`
- `projects/pw-autotest/src/pages/new-product.page.ts`
- `projects/pw-autotest/src/locators/landing.locators.ts`
- `projects/pw-autotest/src/locators/new-product.locators.ts`

Notes:

- this suite is closer to real exploratory regression coverage than simple smoke checks
- it already includes OutSystems-specific combobox handling for product filters

---

### 5. New product creation

File:

- `projects/pw-autotest/tests/products/new-product-creation.spec.ts`

Coverage:

- create a new product with required fields
- fill product information
- fill cascading organization dropdowns
- assign all four required team roles
- re-apply dropdown values before save because of OutSystems partial refresh behavior
- save and verify product is created
- validation-oriented save attempt with missing required fields
- cancel flow with leave-page confirmation
- cascading `Org Level 1 -> Org Level 2 -> Org Level 3` enablement behavior

Supporting source files:

- `projects/pw-autotest/src/pages/new-product.page.ts`
- `projects/pw-autotest/src/locators/new-product.locators.ts`

Important implementation knowledge already captured:

- user lookup widgets require `pressSequentially()`
- organization dropdowns are native `<select>` elements
- tab switches and partial refreshes can reset previously selected values
- save completion is verified by `Edit Product` button and saved-state UI, not by complex URL assertions

---

### 6. Existing product editing from My Products

File:

- `projects/pw-autotest/tests/products/edit-product.spec.ts`

Coverage:

- find an editable product by starting from `Home Page > My Products`
- navigate from the grid into an existing product detail page
- enter edit mode on an existing product
- update product name and commercial reference number
- save changes and verify edited values persist after re-opening edit mode
- make temporary edits and cancel with the leave-page confirmation modal
- verify canceled changes are discarded
- restore original product values as suite cleanup

Supporting source files:

- `projects/pw-autotest/src/pages/landing.page.ts`
- `projects/pw-autotest/src/pages/new-product.page.ts`
- `projects/pw-autotest/src/locators/landing.locators.ts`
- `projects/pw-autotest/src/locators/new-product.locators.ts`

Notes:

- the suite reuses the real `My Products` grid navigation pattern already proven in the existing exploratory and DOC suites
- tests are serial because they intentionally save changes first, then verify cancel behavior against the same product, and finally restore the original values
- Jira issue bodies could not be fetched automatically because the provided Jira URLs redirect to Schneider Electric SSO; implementation is based on the user-provided scope for PIC-108 and PIC-109

Story mapping:

- `PIC-108` → `tests/products/edit-product.spec.ts` → `should edit an existing product from My Products and save changes`
- `PIC-109` → `tests/products/edit-product.spec.ts` → `should discard unsaved existing-product changes when canceling edit mode`
- `PIC-110` → `tests/products/my-products-tab.spec.ts` → `should open Product Detail page when clicking a product name`

---

### 7. New product creation with Digital Offer

File:

- `projects/pw-autotest/tests/doc/new-product-creation-digital-offer.spec.ts`

Coverage:

- create a product with `Digital Offer` enabled
- fill DOC-specific details such as VESTA ID
- assign DOC IT Owner and Project Manager
- save the product
- verify `Digital Offer Certification` tab appears

Supporting source files:

- `projects/pw-autotest/src/pages/new-product.page.ts`
- `projects/pw-autotest/src/locators/new-product.locators.ts`

Notes:

- this is the bridge between product creation and later DOC automation
- DOC owner fields are already handled as special search flows in the page object

---

### 8. DOC initiation flow

File:

- `projects/pw-autotest/tests/doc/initiate-doc.spec.ts`

Coverage:

- scan `My Products` for an eligible product with DOC initiation available
- initiate DOC from a product that already satisfies prerequisites
- verify status transitions to `Controls Scoping`
- verify stage transitions to `Scope ITS Controls`
- navigate to DOC detail page and reuse captured URL across serial tests
- verify `Digital Offer Details`, `Roles & Responsibilities`, and `ITS Checklist` tabs become available
- verify initiator username and initiation year are shown in the DOC flow
- verify privileged visibility of `Cancel DOC`
- verify DOC header information such as VESTA ID, DOC ID, target release date, and release presentation

Supporting source files:

- `projects/pw-autotest/src/pages/doc-details.page.ts`
- `projects/pw-autotest/src/locators/doc-details.locators.ts`
- `projects/pw-autotest/src/pages/landing.page.ts`
- `projects/pw-autotest/src/pages/new-product.page.ts`

Notes:

- this is the most workflow-heavy suite in the repo
- it uses a real precondition search instead of assuming a dedicated seeded product
- the suite is serial and shares a captured DOC detail URL across tests
- current design favors pragmatic reuse of a created DOC session over strict test isolation

## Current automation architecture in `src`

### Pages currently implemented

- `login.page.ts`
- `landing.page.ts`
- `new-product.page.ts`
- `doc-details.page.ts`
- `base.page.ts`

### Locator factories currently implemented

- `auth.locators.ts`
- `landing.locators.ts`
- `new-product.locators.ts`
- `doc-details.locators.ts`

### Fixtures currently implemented

- `src/fixtures/base.fixture.ts`
- `src/fixtures/index.ts`

Current fixture surface provides:

- user credentials from config
- role-based credential lookup
- initialized `LoginPage`
- initialized `LandingPage`
- initialized `NewProductPage`
- initialized `DocDetailsPage`

### Helpers currently implemented

- `wait.helper.ts`
- `api.helper.ts`
- `data.helper.ts`

Most practically useful helper today:

- `waitForOSScreenLoad()` from `wait.helper.ts`

## Patterns already encoded in the framework

The repo already knows about several OutSystems-specific behaviors:

- no `networkidle` usage for page readiness
- user lookup and autocomplete requires `pressSequentially()`
- custom dropdowns and root-level rendered combobox options need special handling
- grids must often be scoped to active tab panels
- tab switches require explicit wait for visible grid headers
- partial refreshes can replace DOM nodes and wipe previously entered values
- post-save assertions should rely on stable UI signals rather than brittle URL internals

## Things that are partially automated but not deeply covered yet

These areas have some baseline support, but not broad scenario depth:

- login negative validation messaging
- `My DOCs` tab business behavior
- `Reports & Dashboards` business behavior
- release-specific filtering and deep assertions on landing grids
- edit-existing-product workflows after creation
- DOC cancellation flow end-to-end
- permissions and role matrix scenarios across different user roles
- error-message text verification for product form validation
- reset and unsaved-change coverage beyond the current cancel flow

## Things not clearly automated yet

Based on current `tests/` and `src/` contents, there is no clear automation coverage yet for:

- a reusable component layer under `src/components/`
- storage-state based auth bootstrap
- API-backed test data provisioning for products and DOC records
- bulk story-to-test generated artifacts stored alongside test runs
- HTML and JSON review artifacts for generated automation outputs
- broad CRUD coverage outside product creation and DOC initiation

## Practical reuse guidance for future generated tests

If a new story touches one of these areas, prefer reusing what already exists:

- authentication or post-login navigation -> `LoginPage`, `LandingPage`
- landing grids, tabs, search, pagination -> `LandingPage`
- product detail, product creation, organization, and team assignment -> `NewProductPage`
- digital offer initiation and DOC detail validations -> `DocDetailsPage`

If a new story starts in one of these areas but extends beyond it, the most likely next step is to:

1. extend the existing page object for the same page
2. add locators to the matching locator factory
3. create a new spec under the closest existing feature folder

## Recommended future note updates

Update this file whenever one of these changes happens:

- a new test suite is added
- a new page object or locator factory is introduced
- an existing exploratory suite becomes stable smoke coverage
- a major gap listed above becomes automated
