---
name: push
description: Use when user says "push", "commit and push", or wants to stage, commit, and push all recent changes to the remote git repository
---

# Push

Stage all changes, commit with a meaningful message, and push to the remote.

## Assess changes

Run in parallel:

- `git status` (never use `-uall`)
- `git diff` and `git diff --cached` to see all changes
- `git log --oneline -5` to match the repo's commit message style

## Safety check

**STOP and warn the user** if any staged/untracked files look sensitive:

- `.env`, `.env.*` (except `.env.example`)
- credentials, secrets, tokens, API keys
- `storage/`, `auth.json`, private keys

## Stage files

- Prefer `git add <specific files>` over `git add -A`
- Group related files logically

## Commit

Draft a concise commit message (1-2 sentences) that:

- Summarizes the **why**, not just the **what**
- Matches the style from `git log`
- Uses conventional prefix if the repo does (fix:, feat:, chore:, etc.)

Always end with:

```text
Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

Use a HEREDOC:

```bash
git commit -m "$(cat <<'EOF'
Message here

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

## Push

- Push to current branch's upstream: `git push`
- If no upstream: `git push -u origin <branch>`
- **Never force-push** unless explicitly asked

## Report

Show the user: commit hash + message, branch pushed to, number of files changed.
