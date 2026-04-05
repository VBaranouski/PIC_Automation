# Automation Test Case Artifacts

This folder stores automation-ready test cases.

Expected files per source input:

- `test_cases_auto_<source_ref>_<date>.json` — canonical automation test cases
- `test_cases_auto_<source_ref>_<date>.html` — rendered review page based on the same JSON

Each test case should remain traceable back to the normalized requirements bundle and later to generated Playwright files.

Current combined DOC bundle is now published in `docs/ai/` as the automation testing plan outputs:

- `../docs/ai/automation-testing-plan.html` — consolidated plan page with embedded DOC automated case details
- `../docs/ai/automation-testing-plan.md` — Markdown source for the same feature checklist

The DOC automated case detail data is embedded directly inside the HTML plan page, so there is no separate JSON or standalone case-catalog artifact for this bundle.
