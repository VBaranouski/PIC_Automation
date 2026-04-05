# Automation Script Artifacts

This folder stores metadata and review outputs for generated Playwright automation.

Expected files per source input:

- `automation_manifest_<source_ref>_<date>.json` — canonical generation manifest
- `automation_summary_<source_ref>_<date>.html` — rendered review page based on the same JSON

The generated Playwright code itself lives in `projects/pw-autotest/`.
