---
name: create-test-cases
description: Use when the user provides a Jira user story ID and wants test cases generated from it, or when manually creating test cases from acceptance criteria text
---

# Create Test Cases for User Story

Generate comprehensive test cases from a Jira user story using the SE-DevTools CLI and Claude AI.

### Identify the story

- Get the story ID(s) from the user (e.g., `PROJ-452`)
- If the project key isn't clear, ask for confirmation
- Multiple stories: pass each with `--story`

### Run the CLI (Jira accessible)

```bash
cd packages/docs-generator
python main.py test-cases --story PROJ-452
# Multiple stories:
python main.py test-cases --story PROJ-452 --story PROJ-453
```

Output: `../../output/test_cases/test_cases_PROJ-XXX.html`

### Manual creation (no Jira access)

If the user provides story text / acceptance criteria directly:

1. Load the methodology: read `.claude/conventions/manual-testing-methodology.md`
2. Apply it: requirement analysis, scenario design, test case writing
3. Present test cases in the structured format from the methodology

### Report

- Confirm the output file path
- Summarize: number of test cases generated, scenarios covered
- Flag any ambiguous acceptance criteria discovered

## Output Format

CLI output: `output/test_cases/test_cases_PROJ-XXX.html`

For manual cases, use the format from the methodology skill:
```text
Test Case ID: TC-[Feature]-[Number]
Title:        ...
Priority:     Critical / High / Medium / Low
Steps:        ...
Expected Result: ...
```
