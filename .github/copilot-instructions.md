# Repository Copilot Instructions

PICASso Automation is a dedicated Playwright + TypeScript test automation repository for the PICASso OutSystems application.

## Project structure

```
├── src/           → fixtures, page objects, locators, helpers, types
├── tests/         → Playwright spec files (auth, doc, landing, products, releases)
├── config/        → environments, users, ESLint, Prettier, Allure
├── specs/         → human-readable test specifications (Markdown)
├── docs/ai/       → automation testing plans, coverage matrices, application maps
├── .github/       → CI workflows, Copilot instructions, prompts
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## Default workflow — 7-Step Canonical Process

> Full rules in `.github/instructions/automation-workflow.instructions.md`
> Entry prompt: `.github/prompts/run-full-automation-workflow.prompt.md`

1. **PLAN** — Identify the next `[ ]` scenario from `docs/ai/automation-testing-plan.md`; record TC ID, WF, spec file, POM.
2. **STEPS** — Write numbered test steps + expected results; update plan marker to `[~]`; apply role codes from `picasso-roles-and-access.md`.
3. **CODE** — Draft TypeScript test using four-layer rule: locator factory → page object method → test with Allure metadata + `test.step()`.
4. **CLI VALIDATE** — Open a headed Playwright CLI browser or codegen session; inspect each page section; verify all locators against live DOM; walk the full user journey; fix locators and POM methods.
5. **TERMINAL RUN** — `npx playwright test <spec> --project=pw-autotest`; fix all failures; run `npx tsc --noEmit`; use `test.fail()` for product defects — never weaken assertions.
6. **UPDATE PLAN** — Change `[ ]` to `[x]`/`[~]`; update runtime status table; update coverage matrix; sync `.html` version.
7. **PROPOSE NEXT** — Output a structured Next Scope Proposal with TC IDs, priorities, effort, and a parallel agent plan if batch ≥ 3.

**Multi-agent rule:** spawn one agent per spec file for batches of 3+ scenarios; agents share plan reads, never share write access to the same file.

## Read before generating automation assets

- `.github/instructions/automation-workflow.instructions.md` ← **MASTER WORKFLOW — read first for any test creation task**
- `.github/instructions/pw-autotest.instructions.md`
- `.github/instructions/automation-scripts.instructions.md`
- `.github/instructions/system-design-automation.instructions.md` ← UI system design reference for tracker screens, new frontend functionality, and requested documentation pages
- `.github/instructions/browser-cli.instructions.md`
- `.github/instructions/naming.instructions.md`
- `.github/instructions/outsystems-picasso.instructions.md` ← PICASso/OutSystems-specific patterns (select vs OSUI, user lookup, partial refresh, timeouts)
- `.github/instructions/typescript.instructions.md` ← TypeScript conventions, class order, type safety, import aliases
- `.github/instructions/testing-patterns.instructions.md` ← Four-layer architecture, locator priority, web-first assertions, fixtures, Allure metadata
- `.github/instructions/test-case-design.instructions.md` ← Agent-compatible test case language, measurable assertions, exploratory testing, zero-regression coverage strategy
- `.github/instructions/quality-checklist.instructions.md` ← Pre-commit checklist, common pitfalls, flaky-test prevention
- `.github/instructions/picasso-roles-and-access.md` ← Role codes, privilege names, and access-based test scenarios (78 roles, 157 privileges)

## Prompt entry points

- `.github/prompts/run-full-automation-workflow.prompt.md` ← **PRIMARY ENTRY POINT — use for all new test creation sessions**
- `.github/prompts/run-automation-pipeline.prompt.md`
- `.github/prompts/generate-automation-test-cases.prompt.md`
- `.github/prompts/generate-playwright-tests.prompt.md`
- `.github/prompts/validate-browser-locators.prompt.md`
- `.github/prompts/generate-tests.prompt.md`
- `.github/prompts/generate-doc-certification-tests.prompt.md` ← WF 11.14 DOC Certification Decision
- `.github/prompts/generate-doc-release-linkage-tests.prompt.md` ← WF 11.16 DOC–Release Linkage

## Core rules

- Prefer semantic locators and verify them in-browser with Playwright CLI when available.
- Use `.github/instructions/system-design-automation.instructions.md` when creating tracker UI, internal dashboards, generated HTML summaries, or requested documentation with visual structure.
- Before creating a new branch from `main`, pull the latest `main` changes first; after implementation, create a pull request.
- Never use `waitForTimeout()` or `networkidle` for the OutSystems app.
- Use web-first assertions (`expect(locator)`) instead of snapshot reads.
- For new or changed test scripts, validate the full UI path in a headed Playwright CLI session before treating the code as done.
- After CLI validation, run the smallest relevant `npx playwright test ...` command.
- Do not "fix" expectation-vs-actual product mismatches by weakening assertions; classify those as likely defects.
- Keep Markdown and HTML application plans in sync with the latest validated automation coverage.
- Keep tests isolated; avoid test-order dependencies unless explicitly implemented as a setup project.
- Do not reach into private page-object internals from tests.
- Prefer setup projects, fixtures, and persisted state files over serial test suites.
- Match the existing style of nearby tests, fixtures, locators, and page objects.
