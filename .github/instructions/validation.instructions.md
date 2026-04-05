# Output Validation Instructions

Use this file after generating requirements, test cases, or Playwright code.

## Validate artifacts

- JSON files are syntactically valid and match the intended schema.
- HTML files reflect the same data as JSON.
- File names follow `.github/instructions/naming.instructions.md`.
- Traceability fields are present.

## Validate code outputs

When Playwright TypeScript files were created or changed:

- ensure new pages are exported from `src/pages/index.ts`
- ensure tests import from the correct fixture entrypoint for their area
- ensure no `waitForTimeout()` or `networkidle` was introduced
- ensure assertions stay in page objects when practical
- ensure locator choices match browser findings

## Validate run readiness

Generated tests should include enough information for a developer to run them manually from `projects/pw-autotest`, typically with:

- `npm run typecheck`
- `npm test`
- `npm run test:smoke`

If runtime validation was not performed, state that clearly in the automation summary HTML and JSON manifest.
