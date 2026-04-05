# Requirements Artifacts

This folder stores normalized requirement bundles for QA automation.

Expected files per source input:

- `requirements_<source_ref>_<date>.json` — canonical normalized requirements bundle
- `requirements_<source_ref>_<date>.html` — rendered review page based on the same JSON

Supported source types:

- Jira story
- Confluence page
- free-text user story

JSON is the source of truth. HTML is review-only.
