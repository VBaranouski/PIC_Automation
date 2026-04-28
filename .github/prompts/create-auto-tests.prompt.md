---
description: "Create, fix, extend, validate, and track PICASso Playwright automation from tracker scenarios."
argument-hint: "<scenario IDs, feature area, workflow, or next pending batch>"
agent: "agent"
---

# Create Auto Tests

Use the canonical workspace skill at `.agents/skills/create-auto-tests/SKILL.md`.

Task input: `$1`

## Required behavior

1. Read `.agents/skills/create-auto-tests/SKILL.md` before making automation changes.
2. Also read `.agents/skills/playwright-best-practices/SKILL.md` before writing or changing Playwright tests.
3. Follow the skill workflow for tracker query, test design, locator/POM/spec updates, headed browser validation, terminal test execution, and tracker updates.
4. Do not commit, push, or open a pull request unless the user explicitly asks for it.

## Final response

Summarize the scenarios handled, files changed, validation commands run, tracker updates made, and any blockers or product defects.