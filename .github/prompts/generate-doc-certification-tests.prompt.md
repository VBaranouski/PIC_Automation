# Generate DOC Certification Tests (WF 11.14)

Generate Playwright TypeScript automation tests for the **DOC Certification Decision** workflow within the Digital Offer Certification (DOC) module.

---

## Context

The `doc-detail-certification.spec.ts` spec file already exists and contains the initial suite (`TC-11.11.1`–`TC-11.11.6`). These test cases have been **implemented but not yet run**. The task is to:

1. Run the existing suite against QA and fix any locator/runtime issues found.
2. Expand coverage with the missing P1/P2 scenarios listed below.

**Spec file:** `tests/doc/doc-detail-certification.spec.ts`
**Page object:** `src/pages/doc-details.page.ts`
**Locators:** `src/locators/doc-details.locators.ts`

---

## Roles & Privileges Required

From `picasso-roles-and-access.md`:

| Action | Required Privilege / Role |
|--------|--------------------------|
| Propose certification decision | `SPECIFY_UPDATE_DOC_DECISION` |
| Submit for approval | `SUBMIT_FOR_APPROVAL` |
| Send for rework | `SEND_FOR_REWORK` |
| Provide signature (BU SO) | `PROVIDE_SIGNATURE` + `BUSECURITYOFFICER` role |
| Provide signature (BVP) | `PROVIDE_SIGNATURE` + `BUSINESSVP` role |
| Provide signature (CISO/Senior BVP) | `PROVIDE_SIGNATURE` + respective role |

The test user configured in `config/users/` must have `SPECIFY_UPDATE_DOC_DECISION` and `SUBMIT_FOR_APPROVAL` at minimum for the smoke scenarios. Multi-approver scenarios may require separate user credentials.

---

## Discovery Pattern

The suite discovers an eligible DOC (in **Decision Proposal** or **Certification Approval** status) at runtime from the My DOCs tab — do NOT hardcode a DOC URL:

```typescript
// Navigate to My DOCs tab and find a DOC in the right status
const docLink = landingPage.findDocByStatus(['Decision Proposal', 'Certification Approval']);
```

If no such DOC is found, skip the test with a descriptive message rather than failing.

---

## Scenarios to Implement (in priority order)

### P1 — Smoke / Critical

| TC ID | Title | Notes |
|-------|-------|-------|
| `ATC-11.14.1` | Certification Decision tab is present and navigable | Discovers DOC in Decision Proposal status; asserts tab label and panel visible |
| `ATC-11.14.2` | Warning icon visible until Proposed Decision is set | Orange icon with tooltip "Proposed certification decision is not specified." |
| `ATC-11.14.3` | "Propose Decision" button visible for privileged user | Asserts button is visible; does NOT click (interaction tested separately) |
| `ATC-11.14.4` | "Submit for Approval" button disabled until decision is set | Assert disabled state + tooltip "Provide all required data..." |
| `ATC-11.14.5` | Submit for Approval opens confirmation popup | Click Submit → popup appears → Cancel (cleanup); DOC stays at Decision Proposal |

### P2 — Functional

| TC ID | Title | Notes |
|-------|-------|-------|
| `ATC-11.14.6` | Propose Decision popup opens with required fields | Click Propose Decision → popup has Proposed Decision dropdown, Comment field |
| `ATC-11.14.7` | Selecting "Certified" decision shows Validity End Date field | Assert datepicker appears; mandatory |
| `ATC-11.14.8` | Selecting "Certified with Exception" shows Validity End Date field | Same Validity End Date field requirement |
| `ATC-11.14.9` | Selecting "Waiver" shows Due Date for Actions Closure field | Assert mandatory Due Date datepicker |
| `ATC-11.14.10` | Risk Summary cards (ITS, SDL, Privacy) visible on Certification Decision tab | Discover DOC at Issue Certification stage; assert card labels |
| `ATC-11.14.11` | Unresolved Findings section visible (or empty state) | Assert section label; assert either rows or "No results found" |
| `ATC-11.14.12` | DOC Approvals section visible in Certification Approval status | Discover DOC in Cert Approval status; assert DOC Signatures columns |
| `ATC-11.14.13` | "Provide Signature" button available for approver | Assert button visible for BU SO role user |

---

## Pre-flight Checks (Before Writing Code)

1. **MCP snapshot required:** Walk the Certification Decision tab in-browser for a DOC in Decision Proposal status. Record exact text of: tab label, warning icon tooltip, button labels, popup field labels, dropdown option labels.
2. **Locate Decision Proposal DOCs:** Open My DOCs tab → identify DOC IDs currently at `Decision Proposal` or `Certification Approval` status. Update `.doc-state.json` with a `certDecisionDocId` key if not present.
3. **Record locator decisions:** Note whether the Propose Decision popup is a `dialog` role or a custom OSUI popup that requires `locator('.osui-popup')` fallback.

---

## Code Generation Rules

- Match the style of `tests/doc/doc-detail.spec.ts` and `tests/doc/doc-detail-offer.spec.ts`.
- Use `test.setTimeout(90_000)` for read-only assertions.
- Use `allure.suite('DOC - Certification Decision')` and `allure.severity('critical')` for P1 tests.
- Discovery of eligible DOC should be extracted into a helper in `src/helpers/` if not already present.
- New locators go into `src/locators/doc-details.locators.ts` (extend existing factory, do not create a new file).
- New page object methods go into `src/pages/doc-details.page.ts`.
- After code generation, run: `npx playwright test tests/doc/doc-detail-certification.spec.ts --project=pw-autotest`

---

## After Running

- Update the runtime status rows in `docs/ai/automation-testing-plan.md` section **11.11** with `PASS`, `DEFECT`, or `BLOCKED` per TC.
- If a failure is caused by expected-vs-actual product behavior, do NOT weaken the assertion — record as **likely defect**.
- Update `docs/ai/current-automation-coverage-matrix.md` with any new assertions added.
