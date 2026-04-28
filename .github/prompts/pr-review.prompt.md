---
description: "Review the current branch, active pull request, PR URL, diff, or files for merge risks."
argument-hint: "<optional PR URL, file path, diff, or focus area>"
agent: "agent"
---

# PR Review

Use the canonical workspace skill at `.agents/skills/pr-review/SKILL.md`.

Review target: `$1`

## Required behavior

1. Read `.agents/skills/pr-review/SKILL.md` before reviewing.
2. If no target is provided, review the active branch or active pull request when available.
3. Prioritize bugs, behavioral regressions, test gaps, security concerns, performance issues, and maintainability risks.
4. Lead with findings ordered by severity and include clickable file references for local code.

## Final response

Report findings first. If there are no blocking findings, say that clearly and note any residual test or review risk.