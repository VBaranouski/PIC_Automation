# Current Automation Coverage Matrix

## Purpose

This file is the stricter companion to `docs/ai/current-automation-coverage.md`.
It maps current business coverage to the exact automation assets already present in `projects/pw-autotest`.

## Summary

Current automation covers these feature groups:

- environment availability
- authentication
- landing page navigation and grid behavior
- product search and product detail entry from `My Products`
- existing product editing from `My Products`
- new product creation
- new product creation with `Digital Offer`
- DOC initiation and post-initiation checks

Current suite inventory:

| Area | Test files | Main page objects | Main locator files | Coverage level |
| --- | --- | --- | --- | --- |
| Environment | 1 | none | none | Minimal smoke |
| Authentication | 1 | `LoginPage` | `auth.locators.ts` | Basic smoke + negative |
| Landing | 1 | `LandingPage` | `landing.locators.ts` | Broad UI regression |
| Products | 3 | `LandingPage`, `NewProductPage` | `landing.locators.ts`, `new-product.locators.ts` | Strong functional baseline |
| DOC | 2 | `NewProductPage`, `DocDetailsPage`, `LandingPage` | `new-product.locators.ts`, `doc-details.locators.ts`, `landing.locators.ts` | Strong workflow baseline |

## Feature-to-test matrix

| Feature / flow | Status | Automated in tests | Main assertions covered | Notes / gaps |
| --- | --- | --- | --- | --- |
| Base URL reachable | Automated | `tests/seed.spec.ts` | page loads, not blank | Only environment sanity |
| Login page rendering | Automated | `tests/auth/login.spec.ts` | username/password/button/SSO/checkbox/link visible | No deep UI copy validation |
| Valid login | Automated | `tests/auth/login.spec.ts` | redirect to landing, user visible, tabs visible | No alternate-role coverage |
| Invalid login | Partially automated | `tests/auth/login.spec.ts` | user remains on login page | No explicit error banner/message assertion |
| Empty login submission | Partially automated | `tests/auth/login.spec.ts` | user remains on login page | No field-level validation assertion |
| Landing tab visibility | Automated | `tests/landing/landing-page.spec.ts` | tab presence, default active tab | Good smoke baseline |
| Landing tab switching | Automated | `tests/landing/landing-page.spec.ts` | tab active state, tabpanel visible, headers visible | `My DOCs` and `Reports` only baseline verified |
| My Tasks columns and filters | Automated | `tests/landing/landing-page.spec.ts` | column headers, filters visible | No deep business filtering assertions |
| My Tasks show closed toggle | Automated | `tests/landing/landing-page.spec.ts` | grid still visible/data present after toggle | Does not validate exact changed record set |
| My Tasks page size and pagination | Automated | `tests/landing/landing-page.spec.ts` | row count/pagination navigation | Good UI behavior coverage |
| My Products default grid/filter state | Automated | `tests/landing/landing-page.spec.ts` | columns, show active only checked, reset visible | Broad baseline only |
| My Products name filter | Automated | `tests/products/my-products-tab.spec.ts` | record count shrinks, rows remain | Uses OutSystems combobox search pattern |
| My Products product ID filter | Automated | `tests/products/my-products-tab.spec.ts` | filtered result visible | Hardcoded sample ID currently used |
| My Products active-only toggle | Automated | `tests/products/my-products-tab.spec.ts` | checkbox changes, count changes, reset works | No exact dataset verification |
| My Products pagination | Automated | `tests/products/my-products-tab.spec.ts` | next/previous page works | Good exploratory coverage |
| Open product detail from grid (`PIC-110`) | Automated | `tests/products/my-products-tab.spec.ts` | detail page loads, name and product ID visible | Treated as already covered per current scope; reuses `NewProductPage` as detail POM |
| Edit existing product and save changes (`PIC-108`) | Automated | `tests/products/edit-product.spec.ts` | edit mode opens, changed name/commercial ref persist after save | Uses live product from `My Products`; serial flow restores original values |
| Cancel existing product edit (`PIC-109`) | Automated | `tests/products/edit-product.spec.ts` | unsaved name/commercial ref changes are discarded after cancel | Verifies persistence against the saved values from prior test before cleanup |
| Create new product | Automated | `tests/products/new-product-creation.spec.ts` | save succeeds, saved-state UI visible | Strong baseline |
| Required fields on create | Partially automated | `tests/products/new-product-creation.spec.ts` | page remains visible after invalid save | No exact validation text checks |
| Cancel new product | Automated | `tests/products/new-product-creation.spec.ts` | leave-page flow works, landing reloads | Good user-flow check |
| Cascading org dropdowns | Automated | `tests/products/new-product-creation.spec.ts` | level 2/3 become enabled after parent selection | Good OutSystems behavior coverage |
| Assign product team roles | Automated | `tests/products/new-product-creation.spec.ts` | user lookup flow exercised for required roles | No negative lookup scenarios |
| Create product with Digital Offer | Automated | `tests/doc/new-product-creation-digital-offer.spec.ts` | DOC details entered, save succeeds, certification tab visible | Strong bridge scenario |
| DOC owner/PM assignment | Automated | `tests/doc/new-product-creation-digital-offer.spec.ts` | search/select in DOC-specific fields | No invalid input scenarios |
| Find DOC-eligible product | Automated | `tests/doc/initiate-doc.spec.ts` | scans `My Products` and finds eligible item | Data-dependent but self-healing scan |
| Initiate DOC | Automated | `tests/doc/initiate-doc.spec.ts` | status and stage transition | Core workflow covered |
| DOC detail tabs after initiation | Automated | `tests/doc/initiate-doc.spec.ts` | tab visibility/clickability/panel visible | Strong post-initiation smoke/regression |
| DOC header data | Automated | `tests/doc/initiate-doc.spec.ts` | DOC ID format, VESTA/release/target date presentation | Good detail-page validation |
| Cancel DOC action | Partially automated | `tests/doc/initiate-doc.spec.ts` | cancel button visibility only | No end-to-end cancellation flow |
| Role/permission matrix | Not clearly automated | none | none | Fixture supports credential lookup, but tests stay on one main role |
| Reports & Dashboards business checks | Not clearly automated | none beyond landing baseline | none | Only tab-load baseline coverage |
| My DOCs business checks | Not clearly automated | none beyond landing baseline | none | Only tab-load baseline coverage |

## Test-to-implementation matrix

| Test file | Primary business area | Uses page objects | Depends on helper patterns | Notes |
| --- | --- | --- | --- | --- |
| `tests/seed.spec.ts` | Environment | direct `page` only | none | Minimal smoke test |
| `tests/auth/login.spec.ts` | Authentication | `LoginPage`, `LandingPage` | base page load methods | Good entry smoke suite |
| `tests/landing/landing-page.spec.ts` | Landing grids/tabs | `LoginPage`, `LandingPage` | `waitForOSLoad()` via POM | Main home-page regression suite |
| `tests/products/my-products-tab.spec.ts` | Product search/detail access | `LoginPage`, `LandingPage`, `NewProductPage` | OutSystems combobox search, grid waits | Exploratory but valuable |
| `tests/products/edit-product.spec.ts` | Existing product edit lifecycle | `LoginPage`, `LandingPage`, `NewProductPage` | grid-to-detail reuse, edit-mode assertions, cancel modal handling | Serial flow with cleanup restore to avoid polluting product data |
| `tests/products/new-product-creation.spec.ts` | Product creation | `LoginPage`, `LandingPage`, `NewProductPage` | user lookup, partial refresh mitigation | Strong create-flow baseline |
| `tests/doc/new-product-creation-digital-offer.spec.ts` | Product + Digital Offer setup | `LoginPage`, `LandingPage`, `NewProductPage` | DOC-specific search fields, partial refresh mitigation | Bridge to DOC flows |
| `tests/doc/initiate-doc.spec.ts` | DOC initiation | `LandingPage`, `NewProductPage`, `DocDetailsPage` | serial flow, eligibility scan, OutSystems waits | Deepest current workflow suite |

## Page object matrix

| Page object | Used by tests | What it currently owns | Reuse potential |
| --- | --- | --- | --- |
| `src/pages/base.page.ts` | all page objects indirectly | `goto`, `waitForPageLoad`, `waitForOSLoad`, URL assertions | Shared base only |
| `src/pages/login.page.ts` | auth, landing, product, DOC suites | login form actions, page visibility assertions | Reuse for any authenticated flow |
| `src/pages/landing.page.ts` | auth, landing, product, DOC suites | tabs, grids, filters, pagination, new product entry, product search helpers | Highest reuse for home-page stories |
| `src/pages/new-product.page.ts` | product and DOC suites | product info, org section, team assignment, Digital Offer fields, save/cancel/detail checks | Highest reuse for product/detail stories |
| `src/pages/doc-details.page.ts` | DOC suites | initiate DOC modal, tab checks, DOC header/status/stage checks | Main reuse point for DOC lifecycle stories |

## Locator factory matrix

| Locator file | Backing page object | Main UI areas covered |
| --- | --- | --- |
| `src/locators/auth.locators.ts` | `LoginPage` | login form, SSO, remember-me, forgot password |
| `src/locators/landing.locators.ts` | `LandingPage` | landing tabs, grids, filters, pagination, new product button |
| `src/locators/new-product.locators.ts` | `NewProductPage` | product detail/create form, org/team tabs, Digital Offer fields, save/cancel |
| `src/locators/doc-details.locators.ts` | `DocDetailsPage` | DOC initiate modal, DOC tabs, status/stage/header fields |

## Fixture and helper matrix

| Asset | What exists today | Practical implication |
| --- | --- | --- |
| `src/fixtures/base.fixture.ts` | shared credentials and page object setup | New generated tests should plug into existing fixture surface first |
| `src/fixtures/index.ts` | simple export of `test` and `expect` | Existing tests already use this entrypoint style |
| `src/helpers/wait.helper.ts` | readiness helpers including `waitForOSScreenLoad()` | Should be reused instead of raw sleeps |
| `src/helpers/data.helper.ts` | Faker-based helper functions | Light data generation exists but is not a full test-data layer |
| `src/helpers/api.helper.ts` | helper file exists | Not obviously central to current functional coverage |

## Coverage quality notes

### Strongest covered areas

- login smoke flow
- landing page navigation/grid baseline
- existing product edit lifecycle from `My Products`
- new product creation main happy path
- Digital Offer setup path
- DOC initiation happy path and post-initiation checks

### Medium-confidence areas

- negative behavior where the suite only verifies that the user stays on the same page
- exploratory product search flows using current environment data
- data-dependent DOC eligibility scan

### Weak or missing areas

- exact validation text checks
- permission-based branching across multiple roles
- destructive DOC actions
- reports analytics flows
- `My DOCs` business actions
- broader delete/archive product lifecycle

## Best extension points for future generated automation

| New story type | First thing to reuse |
| --- | --- |
| Login/auth story | `LoginPage` + auth suite patterns |
| Landing/home page story | `LandingPage` + landing locators |
| Product create/edit/detail story | `NewProductPage` + `new-product.locators.ts` |
| Product search/list story | `LandingPage` My Products helpers |
| DOC initiation/detail story | `DocDetailsPage` + `initiate-doc.spec.ts` patterns |

## Suggested next follow-up docs if needed

Good next reference files would be:

- a role coverage matrix
- a page-to-locator ownership matrix with missing locator candidates
- a smoke vs regression classification sheet
- a story intake checklist for deciding whether to extend an existing POM or create a new one
