# Story to Test Mapping

## Last updated

2026-03-27

## Product stories

| Story | Status | Automated test file | Test title | Notes |
| --- | --- | --- | --- | --- |
| PIC-108 | Automated | `projects/pw-autotest/tests/products/edit-product.spec.ts` | `should edit an existing product from My Products and save changes` | Creates a valid product, reopens it from Home Page > My Products, edits and saves core fields. |
| PIC-109 | Automated | `projects/pw-autotest/tests/products/edit-product.spec.ts` | `should discard unsaved existing-product changes when canceling edit mode` | Reopens the edited product from Home Page > My Products, makes temporary changes, cancels, and verifies discard behavior. |
| PIC-110 | Already covered | `projects/pw-autotest/tests/products/my-products-tab.spec.ts` | `should open Product Detail page when clicking a product name` | Covers Home Page > My Products > Product Detail navigation and core detail visibility. |

## Supporting coverage

| Area | Automated test file | Relevant test title(s) |
| --- | --- | --- |
| My Products filtering | `projects/pw-autotest/tests/products/my-products-tab.spec.ts` | `should search products by name using combobox filter`, `should search products by Product ID using combobox filter`, `should reset all filters and restore default state` |
| My Products grid behavior | `projects/pw-autotest/tests/products/my-products-tab.spec.ts` | `should toggle Show Active Only checkbox to include inactive products`, `should navigate through pages using pagination` |
| DOC product entry | `projects/pw-autotest/tests/doc/initiate-doc.spec.ts` | `should update DOC status to Controls Scoping and stage to Scope ITS Controls after initiation @smoke` |

## Notes

- PIC-108 and PIC-109 intentionally stay in one spec file to keep a single owner for existing-product edit coverage.
- PIC-110 is treated as already covered and is not duplicated in a second product-detail spec.
- Current DOC setup coverage remains in `projects/pw-autotest/tests/doc/new-product-creation-digital-offer.spec.ts`.
