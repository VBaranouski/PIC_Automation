# Feature Areas — Tier 1 Catalog

> Always loaded. Keep compact. One row per area. Update only when a new `feature_area` is added to the tracker schema.

| Area ID | Title | Tracker `feature_area` | Registry | Knowledge Topics | Tests Dir | Page Objects |
|---|---|---|---|---|---|---|
| auth | Authentication & SSO | `auth` | [feature-registry/auth.md](feature-registry/auth.md) | authentication | `tests/auth/` | `src/pages/login.page.ts` |
| landing | Landing Page & My-* Tabs | `landing` | [feature-registry/landing.md](feature-registry/landing.md) | landing-page | `tests/landing/` | `src/pages/landing.page.ts` |
| products | Product Lifecycle | `products` | [feature-registry/products.md](feature-registry/products.md) | product-lifecycle | `tests/products/` | `src/pages/new-product.page.ts` |
| releases | Release Workflow (7-stage) | `releases` | [feature-registry/releases.md](feature-registry/releases.md) | release-workflow, questionnaire, process-requirements, product-requirements, csrr, fcsr-decision, actions-management, data-protection | `tests/releases/` | `src/pages/release-detail.page.ts` |
| doc | Digital Offer Certification | `doc` | [feature-registry/doc.md](feature-registry/doc.md) | doc-workflow | `tests/doc/` | `src/pages/doc-details.page.ts`, `src/pages/control-detail.page.ts` |
| reports | Reports & Dashboards | `reports` | [feature-registry/reports.md](feature-registry/reports.md) | reports-dashboards | — | — |
| backoffice | Backoffice Admin | `backoffice` | [feature-registry/backoffice.md](feature-registry/backoffice.md) | roles-permissions, roles-delegation | — | — |
| integrations | Jira / Jama / Azure DevOps | `integrations` | [feature-registry/integrations.md](feature-registry/integrations.md) | — | — | — |
| other | Cross-cutting / Uncategorized | `other` | [feature-registry/other.md](feature-registry/other.md) | — | — | — |

## Reserved keywords for keyword-match

- `login`, `sso`, `password`, `session`         → **auth**
- `landing`, `my tasks`, `my products`, `my releases`, `my docs`, `task list` → **landing**
- `product`, `registration`, `product detail`, `status mapping` → **products**
- `release`, `questionnaire`, `requirement`, `csrr`, `fcsr`, `sign off`, `action`, `data protection`, `privacy`, `sdl practice`, `process requirement`, `product requirement` → **releases**
- `doc`, `digital offer`, `certification`, `its control`, `control detail` → **doc**
- `report`, `dashboard`, `tableau`                 → **reports**
- `admin`, `backoffice`, `role`, `delegation`, `privilege` → **backoffice**
- `jira`, `jama`, `azure devops`, `integration`, `webhook` → **integrations**
