# Automation Test Case Instructions

Use this file when generating automation-ready test cases from a normalized requirements bundle.

## Output goal

Produce:

- canonical JSON in `output/test_cases/test_cases_auto_<source_ref>_<date>.json`
- matching HTML review artifact in `output/test_cases/test_cases_auto_<source_ref>_<date>.html`

## Coverage rules

Generate at least:

- one positive case for each acceptance criterion
- negative cases for validation and permission failures when described
- edge cases for boundaries, empty states, optional branches, and unusual but valid values when described

Do not invent requirements beyond what the normalized bundle supports.

## Required test case structure

```json
{
  "id": "TC-001",
  "title": "short behavior-oriented title",
  "ac_reference": ["AC1"],
  "page": "target page or flow name",
  "preconditions": ["automatable state"],
  "test_steps": [
    "Navigate to Product Detail page for product PIC-TEST-001",
    "Click [Edit Product button]",
    "Fill [Product Name field] with 'Widget Pro'",
    "Click [Save Changes button]"
  ],
  "assertions": [
    {
      "element": "Success feedback message",
      "condition": "toBeVisible",
      "expected": "Product saved successfully"
    }
  ],
  "expected_result": "short summary of observable outcome",
  "priority": "High | Medium | Low",
  "test_type": "Positive | Negative | Edge Case",
  "test_tags": ["@smoke"],
  "automation_notes": ["Use waitForOSScreenLoad() after save"]
}
```

## Step-writing rules

Every step must be machine-friendly and explicit:

- `Action + [Visible element label] + exact value when applicable`
- Use visible labels or accessible names inside brackets.
- Always include exact data values; never say `valid data` or `some value`.
- For OutSystems search fields: `Type 'Ulad' in [Product Owner search field] using pressSequentially`.
- For dropdowns, indicate whether it is native select or custom widget when known.

## Assertions

- Use Playwright web-first assertion names only.
- Separate each verifiable outcome into its own assertion record.
- Assert user-visible outcomes, not implementation details.

## Automation notes

Add notes whenever interaction behavior matters, especially for:

- OutSystems custom dropdowns
- search or autocomplete fields
- tab switches
- save actions
- modal dialogs
- partial refreshes

## HTML rendering

The HTML review file should show:

- story/spec summary
- case counts by test type
- `@smoke` cases highlighted
- tables for steps and assertions
- assumptions and ambiguities
