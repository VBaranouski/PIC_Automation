# Branching Strategy

> Adopted: 2026-04-17

## Branch Model

| Branch | Purpose | Protected | Merge via PR |
|--------|---------|-----------|-------------|
| `main` | Stable, deployable automation suite | Yes | Yes |
| `feature/<scope>` | New tests, refactoring, page objects | No | → `main` |
| `fix/<scope>` | Bug fixes, flaky test fixes, locator patches | No | → `main` |
| `chore/<scope>` | Config, CI, tooling, dependency updates | No | → `main` |

## Rules

1. **Never push directly to `main`.** All changes go through a feature/fix/chore branch and a pull request.
2. **Branch naming**: `<type>/<short-description>` — e.g. `feature/auth-storage-state`, `fix/doc-tab-locator`, `chore/update-deps`.
3. **One logical change per PR.** Keep PRs small and focused.
4. **Typecheck before merging**: `npx tsc --noEmit` must pass.
5. **Squash-merge** into `main` to keep history linear and clean.

## Workflow

```
main ─────────────────────────────────────────────► (stable)
  │                                        ▲
  └─ feature/auth-storage-state ──────────┘ (PR + squash merge)
```

### Creating a branch

```bash
git checkout main
git pull origin main
git checkout -b feature/<scope>
```

### Submitting changes

```bash
git add <files>
git commit -m "feat: description of change"
git push origin feature/<scope>
# Open PR on GitHub → squash merge into main
```

### Commit message format

```
<type>: <short summary>

Types: feat, fix, chore, refactor, test, docs
```

## Rollback

If a merged PR breaks the test suite:

```bash
git revert <merge-commit-sha>
git push origin main
```

This keeps `main` deployable at all times. The original branch can be re-opened and fixed.
