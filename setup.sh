#!/usr/bin/env bash
# =============================================================================
#  PICASso Automation — First-Run Setup
#
#  Run this ONCE right after cloning the repository.
#  It installs all dependencies and scaffolds required local config files.
#
#  Usage:
#    bash setup.sh
#    # or make it executable once and run directly:
#    chmod +x setup.sh && ./setup.sh
# =============================================================================

set -euo pipefail

# ── Helpers ──────────────────────────────────────────────────────────────────

BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
CYAN="\033[0;36m"
RESET="\033[0m"

step()    { echo -e "\n${BOLD}${CYAN}▶  $1${RESET}"; }
ok()      { echo -e "   ${GREEN}✓  $1${RESET}"; }
warn()    { echo -e "   ${YELLOW}⚠  $1${RESET}"; }
fail()    { echo -e "   ${RED}✗  $1${RESET}"; }
divider() { echo -e "\n${BOLD}──────────────────────────────────────────${RESET}"; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

divider
echo -e "${BOLD}  PICASso Automation — Project Setup${RESET}"
divider

# ── 1. Node.js version check ─────────────────────────────────────────────────

step "Checking prerequisites"

if ! command -v node &>/dev/null; then
  fail "Node.js is not installed. Install it from https://nodejs.org (v18+) and re-run."
  exit 1
fi

NODE_VERSION=$(node -e "process.stdout.write(process.versions.node)")
NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)

if [[ "$NODE_MAJOR" -lt 18 ]]; then
  fail "Node.js v18+ is required. Found: v${NODE_VERSION}"
  exit 1
fi
ok "Node.js v${NODE_VERSION}"

if ! command -v npm &>/dev/null; then
  fail "npm is not installed."
  exit 1
fi
ok "npm $(npm --version)"

# ── 2. Install npm dependencies ───────────────────────────────────────────────

step "Installing npm dependencies"
npm install
ok "node_modules installed"

# ── 3. Install Playwright browsers ────────────────────────────────────────────

step "Installing Playwright browsers (this may take a few minutes)"
npx playwright install --with-deps
ok "Playwright browsers installed"

# ── 4. Create .env ────────────────────────────────────────────────────────────

step "Setting up .env"

if [[ -f ".env" ]]; then
  warn ".env already exists — skipping copy"
else
  cp .env.example .env
  ok "Created .env from .env.example"

  # Auto-generate SESSION_SECRET if node crypto is available
  if node -e "require('crypto')" &>/dev/null 2>&1; then
    GENERATED_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    # Replace the placeholder value inline (macOS + Linux compatible)
    sed -i.bak "s|SESSION_SECRET=replace-with-a-long-random-string|SESSION_SECRET=${GENERATED_SECRET}|" .env
    rm -f .env.bak
    ok "SESSION_SECRET auto-generated in .env"
  else
    warn "Could not auto-generate SESSION_SECRET — update it manually in .env"
  fi
fi

# ── 5. Scaffold user credential stubs ─────────────────────────────────────────
#
#  config/users/*.users.ts are gitignored (contain real passwords).
#  We create empty stubs with TODO markers so imports don't break and
#  TypeScript compilation succeeds.  Fill in real credentials before running tests.

step "Scaffolding user credential stubs"

USERS_DIR="config/users"

scaffold_users() {
  local ENV_NAME="$1"   # qa | dev | ppr
  local FILE="${USERS_DIR}/${ENV_NAME}.users.ts"

  if [[ -f "$FILE" ]]; then
    warn "${FILE} already exists — skipping"
    return
  fi

  cat > "$FILE" <<TSEOF
/**
 * ${ENV_NAME^^} environment user credentials.
 *
 * TODO: Fill in real login/password values before running tests.
 *       Never commit this file — it is listed in .gitignore.
 */
import type { UsersByRole } from './user.types';

export const ${ENV_NAME}Users: UsersByRole = {
  product_owner:                        { role: 'product_owner',                        name: 'TODO', login: 'TODO', password: 'TODO' },
  security_manager:                     { role: 'security_manager',                     name: 'TODO', login: 'TODO', password: 'TODO' },
  security_and_data_protection_advisor: { role: 'security_and_data_protection_advisor', name: 'TODO', login: 'TODO', password: 'TODO' },
  process_quality_leader:               { role: 'process_quality_leader',               name: 'TODO', login: 'TODO', password: 'TODO' },
  it_owner:                             { role: 'it_owner',                             name: 'TODO', login: 'TODO', password: 'TODO' },
  project_manager:                      { role: 'project_manager',                      name: 'TODO', login: 'TODO', password: 'TODO' },
  docl:                                 { role: 'docl',                                 name: 'TODO', login: 'TODO', password: 'TODO' },
  drl:                                  { role: 'drl',                                  name: 'TODO', login: 'TODO', password: 'TODO' },
  dedicated_privacy_advisor:            { role: 'dedicated_privacy_advisor',            name: 'TODO', login: 'TODO', password: 'TODO' },
  invalid_user:                         { role: 'invalid_user',                         name: 'TODO', login: 'TODO', password: 'TODO' },
  super_user:                           { role: 'super_user',                           name: 'TODO', login: 'TODO', password: 'TODO' },
};
TSEOF

  ok "Created ${FILE}"
}

scaffold_users "qa"
scaffold_users "dev"
scaffold_users "ppr"

# ── 6. Ensure tmp/ exists ──────────────────────────────────────────────────────

step "Ensuring runtime directories exist"

if [[ ! -d "tmp" ]]; then
  mkdir -p tmp
  touch tmp/.gitkeep
  ok "Created tmp/"
else
  ok "tmp/ already exists"
fi

# ── 7. Verify TypeScript compiles ─────────────────────────────────────────────

step "Verifying TypeScript compilation"

if npx tsc --noEmit 2>/dev/null; then
  ok "TypeScript check passed"
else
  warn "TypeScript reported errors (likely TODOs in user stubs — expected until credentials are filled in)"
fi

# ── 8. Verify Playwright config loads ─────────────────────────────────────────

step "Verifying Playwright configuration"

if npx playwright test --list --config playwright.config.ts &>/dev/null 2>&1; then
  ok "Playwright config loaded successfully"
else
  warn "Playwright config check had warnings — run 'npx playwright test --list' to inspect"
fi

# ── Done ──────────────────────────────────────────────────────────────────────

divider
echo -e "${BOLD}${GREEN}  Setup complete!${RESET}"
divider
echo ""
echo -e "  ${BOLD}Required before running tests:${RESET}"
echo -e "  1. Edit ${CYAN}.env${RESET} — set TEST_ENV and BASE_URL (or leave BASE_URL to use config/environments/)"
echo -e "  2. Fill credentials in ${CYAN}config/users/qa.users.ts${RESET} (and dev/ppr if needed)"
echo -e "     Replace all ${YELLOW}TODO${RESET} values with real login/password pairs."
echo ""
echo -e "  ${BOLD}Then you can run:${RESET}"
echo -e "  ${CYAN}npm run tracker:ui${RESET}          — Tracker web UI  (http://localhost:3005)"
echo -e "  ${CYAN}npm test${RESET}                    — Full E2E test suite"
echo -e "  ${CYAN}npm run test:smoke${RESET}           — Smoke suite only"
echo ""
