# PICASso Automation Testing — Claude Code Guidelines

This document guides Claude Code usage for the **PICASso Automation** Playwright + TypeScript E2E test suite. It covers architecture, patterns, conventions, and best practices for test development.

## Overview

**PICASso Automation** is a comprehensive E2E test suite for the PICASso OutSystems application using:
- **Playwright** v1.58+ for browser automation
- **TypeScript** for type-safe test code
- **Page Object Models** for maintainability
- **Test Scenario Tracker** (SQLite + Express) for test planning and status tracking
- **Allure Reports** for detailed test reporting
- **Multiple test projects** with dependency chains for complex workflows

**Key Focus Areas**: Authentication, Product Management, Document Lifecycle (DOC), Risk Assessment, Reporting, and Release Management.

---

## Project Structure & Architecture

### Directory Layout

```
PIC_Automation/
├── src/
│   ├── fixtures/
│   │   ├── base.fixture.ts        # Extended test object with custom fixtures
│   │   └── index.ts               # Fixture exports
│   ├── pages/
│   │   ├── base.page.ts           # BasePage with common POM methods
│   │   ├── login.page.ts
│   │   ├── landing.page.ts
│   │   ├── doc-details.page.ts
│   │   ├── control-detail.page.ts
│   │   ├── release-detail.page.ts
│   │   ├── new-product.page.ts
│   │   └── index.ts               # Page exports
│   ├── locators/
│   │   └── auth.locators.ts       # Locator factory functions
│   ├── helpers/
│   │   ├── wait.helper.ts         # Custom wait utilities
│   │   ├── data.helper.ts         # Test data generation
│   │   ├── api.helper.ts          # API request helpers
│   │   └── doc.helper.ts          # DOC-specific helpers
│   ├── reporters/
│   │   └── custom-reporter.ts     # Custom Allure reporter
│   └── types/
│       ├── env.d.ts               # Environment type definitions
│       ├── pages.types.ts         # Page-specific types
│       └── test-data.types.ts     # Test data types
├── tests/
│   ├── auth/                      # Authentication tests
│   │   └── login.spec.ts
│   ├── landing/                   # Landing page tests
│   ├── products/                  # Product feature tests
│   ├── releases/                  # Release management tests
│   ├── doc/                       # Document lifecycle & detail tests
│   │   ├── doc-state.setup.ts     # Shared state setup
│   │   ├── new-product-creation-digital-offer.spec.ts
│   │   ├── doc-detail-*.spec.ts   # Specific detail features
│   │   └── doc-lifecycle.spec.ts
│   └── seed.spec.ts               # Data seeding for tests
├── config/
│   ├── environments/
│   │   ├── environment.types.ts
│   │   ├── qa.ts
│   │   ├── dev.ts
│   │   ├── ppr.ts
│   │   └── index.ts
│   └── users/
│       ├── user.types.ts
│       ├── qa.users.ts            # Gitignored user credentials
│       ├── dev.users.ts
│       ├── ppr.users.ts
│       └── index.ts
├── specs/                         # Human-readable test specifications
├── docs/ai/
│   ├── automation-testing-plan.html    # Interactive test plan
│   ├── coverage-matrix.md
│   └── application-map.html
├── playwright.config.ts           # Playwright configuration (15+ test projects)
├── tsconfig.json
├── package.json
└── .env.example
```

### Page Object Model (POM) Architecture

All page classes extend `BasePage` and follow a strict pattern:

```typescript
// src/pages/example.page.ts
import { BasePage } from './base.page';
import { Page, Locator } from '@playwright/test';

export class ExamplePage extends BasePage {
  // ── Private locators (encapsulated within the page) ──────────────
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.submitButton = page.locator('[data-testid="submit"]');
  }

  // ── Public methods (navigation, action, expectation) ────────────
  async goto(url?: string): Promise<void> {
    await this.page.goto(url || '/path/to/page');
  }

  async fillForm(data: FormData): Promise<void> {
    // Implementation
  }

  async expectFormDisplayed(): Promise<void> {
    await this.expect(this.submitButton).toBeVisible();
  }
}
```

**Key POM Principles**:
1. **Private locators**: All selectors are private properties
2. **Public actions**: Methods that interact with the UI
3. **Expect methods**: Assertions prefixed with `expect*` for readability
4. **No test logic in pages**: Pages contain only UI interaction code
5. **Single responsibility**: Each page represents one feature/screen

---

## Test Writing Standards

### Test Structure & Organization

Tests must follow a consistent structure with Allure metadata and explicit step definitions:

```typescript
import { test, expect } from '../../src/fixtures';
import * as allure from 'allure-js-commons';

test.describe('Feature Name @smoke', () => {
  test.beforeEach(async ({ loginPage, userCredentials }) => {
    // Setup: Login and navigate to feature
    await loginPage.goto();
    await loginPage.login(userCredentials);
  });

  test('scenario ID — human-readable description', async ({ page, docDetailsPage }) => {
    // Allure metadata (always include)
    await allure.suite('Feature Area');
    await allure.severity('critical'); // critical | major | minor | trivial
    await allure.tag('smoke');
    await allure.description('SCENARIO-ID-001: Clear description of what is tested');

    // Steps with descriptive names
    await test.step('Verify initial state', async () => {
      await docDetailsPage.expectPageLoaded();
    });

    await test.step('Perform action', async () => {
      await docDetailsPage.fillForm(testData);
    });

    await test.step('Verify result', async () => {
      await expect(page.locator('.success-message')).toBeVisible();
    });
  });
});
```

### Test Naming Conventions

1. **Describe block**: Feature name + tag
   - `test.describe('Authentication - Login @smoke', () => {...})`
   
2. **Test ID format**: `AREA-ACTION-###` (e.g., `AUTH-LOGIN-001`)
   - Matches tracker scenario IDs

3. **Test title**: `SCENARIO-ID — Human-readable description`
   - Example: `AUTH-LOGIN-001 — User can login with valid credentials`

### Allure Metadata Requirements

Every test must include:

```typescript
await allure.suite('Feature Area');           // Organizational grouping
await allure.severity('critical');            // Priority: critical | major | minor | trivial
await allure.tag('smoke');                    // Categories: smoke | regression | integration | edge-case
await allure.description('SCENARIO-ID: ...');
```

**Severity Levels**:
- `critical`: Core workflow, blocker if broken
- `major`: Important feature, affects users
- `minor`: Edge case or secondary feature
- `trivial`: UI polish, non-blocking

---

## Fixtures & Dependency Injection

The custom fixture system provides shared dependencies and manages test context:

### Available Fixtures

```typescript
import { test, expect } from '../../src/fixtures';

test('example', async ({
  page,                    // Playwright Page (injected by default)
  userCredentials,         // Current test role credentials
  getUserByRole,           // Function to get credentials for specific role
  loginPage,               // LoginPage instance
  landingPage,             // LandingPage instance
  newProductPage,          // NewProductPage instance
  docDetailsPage,          // DocDetailsPage instance
  controlDetailPage,       // ControlDetailPage instance
  releaseDetailPage,       // ReleaseDetailPage instance
}) => {
  // Test code
});
```

### Custom Fixture Pattern

To add a new fixture:

```typescript
// src/fixtures/base.fixture.ts
type CustomFixtures = {
  myNewFixture: MyFixtureType;
};

export const test = base.extend<CustomFixtures>({
  myNewFixture: async ({ page }, use) => {
    // Setup
    const instance = new MyClass(page);
    
    // Use (test runs here)
    await use(instance);
    
    // Cleanup
    await instance.close();
  },
});
```

---

## Environment Configuration

### Environment Files

Environments are defined in `config/environments/`:

```typescript
// config/environments/qa.ts
export const qa: Environment = {
  name: 'qa',
  baseUrl: 'https://qa.picasso.app',
  apiUrl: 'https://api.qa.picasso.app',
  timeout: 30000,
};
```

### Set Test Environment

```bash
# Via environment variable
TEST_ENV=qa npm test

# Default: qa (if not specified)
npm test
```

Available environments: `qa` | `dev` | `ppr`

### User Credentials

User credentials are **gitignored** per environment:

```typescript
// config/users/qa.users.ts (GITIGNORED)
export const users: Record<UserRole, UserCredentials> = {
  admin: { login: 'admin@test.com', password: '...' },
  reviewer: { login: 'reviewer@test.com', password: '...' },
  viewer: { login: 'viewer@test.com', password: '...' },
};
```

Use in tests via the fixture:

```typescript
test('login with specific role', async ({ getUserByRole }) => {
  const reviewerCreds = getUserByRole('reviewer');
  // Use credentials
});
```

---

## Test Projects & Dependency Chains

The Playwright config defines **15+ test projects** with dependencies for complex workflows:

### DOC Lifecycle Chain

```
setup
  ↓
doc-product-setup (new product creation)
  ↓
doc-initiation (initiate DOC)
  ↓
doc-state-setup (persist DOC state for details tests)
  ├→ doc-my-docs-tab
  ├→ doc-detail-header
  ├→ doc-detail-offer
  ├→ doc-detail-roles
  └→ doc-detail-certification
```

### Running Specific Projects

```bash
# Run only smoke tests
npm run test:smoke

# Run only chromium
npm run test:chromium

# Run with grep pattern
npx playwright test --grep @critical

# Run specific project
npx playwright test --project=doc-detail-offer
```

### Project Configuration

Projects are defined in `playwright.config.ts`. To add a new project:

```typescript
{
  name: 'my-feature',
  testMatch: /my-feature\.spec\.ts/,
  use: { ...devices['Desktop Chrome'] },
  dependencies: ['setup'],  // Wait for setup to complete first
},
```

---

## Helpers & Utilities

### Wait Helper (`src/helpers/wait.helper.ts`)

```typescript
import { waitFor, waitForNavigation, waitForTimeout } from '../helpers/wait.helper';

// Wait for condition to be true
await waitFor(() => page.locator('.loaded').isVisible(), 5000);

// Wait for navigation
await waitForNavigation(page, () => page.click('button'));

// Simple delay
await waitForTimeout(1000);
```

### Data Helper (`src/helpers/data.helper.ts`)

```typescript
import { generateTestData, faker } from '../helpers/data.helper';

const testData = generateTestData({
  productName: faker.commerce.productName(),
  quantity: faker.number.int({ min: 1, max: 100 }),
});
```

### API Helper (`src/helpers/api.helper.ts`)

```typescript
import { apiRequest, getAuthToken } from '../helpers/api.helper';

const token = await getAuthToken(credentials);
const response = await apiRequest('/api/documents', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: JSON.stringify(data),
});
```

### DOC Helper (`src/helpers/doc.helper.ts`)

```typescript
import { persistDocState, getPersistedDocState } from '../helpers/doc.helper';

// Save DOC URL to .doc-state.json after creation
await persistDocState(page, 'Controls Scoping');

// Retrieve persisted state in subsequent tests
const docState = getPersistedDocState();
```

---

## Test Scenario Tracker

The tracker (SQLite database + Express UI) manages test planning and automation status.

### Available Commands

```bash
# List scenarios with filters
npm run tracker:list
npm run tracker:list -- --status=pending
npm run tracker:list -- --feature-area=doc

# View detailed report
npm run tracker:report

# Sync database with spec files
npm run tracker:sync

# Export/import scenarios
npm run tracker:export
npm run tracker -- import scenarios.json

# Web UI
npm run tracker:ui
# Opens http://localhost:3005
```

### Scenario Model

Scenarios track:
- **ID**: Unique test case identifier (e.g., `AUTH-LOGIN-001`)
- **Title**: Human-readable test name
- **Status**: `pending` | `automated` | `passed` | `failed` | `skipped` | `on-hold`
- **Priority**: `P1` (critical) | `P2` (major) | `P3` (minor)
- **Feature Area**: `auth` | `landing` | `products` | `doc` | `releases` | etc.
- **Groups**: `smoke` | `critical` | `regression` | `integration` | `edge-case`

### Updating Scenario Status

```bash
# Set scenario to automated
npm run tracker -- status AUTH-LOGIN-001 automated

# Hold a scenario (skips during test runs)
npm run tracker -- hold AUTH-LOGIN-001

# Remove hold
npm run tracker -- unhold AUTH-LOGIN-001

# Add groups
npm run tracker -- group AUTH-LOGIN-001 add smoke critical
```

---

## Reporting & Results

### Allure Reports

Allure provides comprehensive test reporting with history, trends, and detailed failures.

```bash
# Generate and open Allure report
npm run report:allure

# Generate only (don't open)
npm run report:allure:generate

# Open existing report
npm run report:allure:open
```

Report locations:
- `allure-results/` — Raw test data
- `allure-report/` — Generated HTML report

### HTML Reports

```bash
# Open Playwright HTML report
npm run report:html
```

---

## CI/CD Integration

GitHub Actions workflow in `.github/workflows/playwright.yml` runs on:
- **Push** to `main` or `develop`
- **Pull Requests**
- **Manual dispatch** (environment, role, test filter selection)

### Key Environment Variables

Set these in GitHub secrets:

```
PICASSO_BASE_URL       # Application URL
PICASSO_API_URL        # API endpoint
TEST_ROLE              # Test user role (admin, reviewer, viewer)
QA_USERNAME            # QA environment credentials
QA_PASSWORD
PPR_USERNAME           # PPR environment credentials
PPR_PASSWORD
```

---

## Common Development Patterns

### Adding a New Test

1. **Create spec file** in appropriate directory under `tests/`
   ```bash
   # Example: New feature test
   touch tests/products/product-export.spec.ts
   ```

2. **Create/update Page Object** in `src/pages/`
   ```typescript
   export class ProductExportPage extends BasePage {
     // Locators and methods
   }
   ```

3. **Add fixture** if needed (in `src/fixtures/base.fixture.ts`)

4. **Write test** following the standard pattern

5. **Update tracker** with scenario metadata
   ```bash
   npm run tracker -- add "PROD-EXPORT-001" \
     --title "Export product list" \
     --priority P2 \
     --feature-area products \
     --workflow "Product Management"
   ```

6. **Run test locally**
   ```bash
   npx playwright test --grep "PROD-EXPORT-001"
   ```

### Adding a New Page Object

```typescript
// src/pages/example.page.ts
import { BasePage } from './base.page';
import { Page, Locator } from '@playwright/test';

export class ExamplePage extends BasePage {
  private readonly headingLocator: Locator;
  
  constructor(page: Page) {
    super(page);
    this.headingLocator = page.locator('h1[data-testid="page-heading"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/example-path');
  }

  async expectPageLoaded(): Promise<void> {
    await this.expect(this.headingLocator).toBeVisible();
  }
}
```

Export in `src/pages/index.ts`:
```typescript
export { ExamplePage } from './example.page';
```

Add to fixture in `src/fixtures/base.fixture.ts`:
```typescript
type CustomFixtures = {
  examplePage: ExamplePage;
};

examplePage: async ({ page }, use) => {
  await use(new ExamplePage(page));
},
```

### Handling Complex Workflows

Use **test dependencies** for tests that must run in sequence:

```typescript
// playwright.config.ts
{
  name: 'create-and-edit-product',
  testMatch: /product-edit\.spec\.ts/,
  dependencies: ['product-create'],  // Waits for product-create to finish
  use: { ...devices['Desktop Chrome'] },
},
```

---

## Best Practices

### ✅ DO

- **Use Page Objects**: Encapsulate all selectors and interactions
- **Clear step names**: Use `test.step()` with descriptive names
- **Explicit waits**: Use `expect()` instead of arbitrary `waitForTimeout()`
- **Fixture injection**: Let Playwright manage setup/teardown
- **Meaningful assertions**: Test user-facing outcomes, not implementation details
- **Allure metadata**: Always include suite, severity, and description
- **Isolated tests**: Tests should not depend on execution order (except documented chains)
- **Local .env**: Keep `.env` with local testing settings (gitignored)
- **Type safety**: Use TypeScript types for test data and page parameters

### ❌ DON'T

- **Hardcoded URLs**: Use `baseURL` from environment config
- **Hardcoded credentials**: Use the fixture system
- **Mixed concerns**: Keep page objects, test logic, and helpers separate
- **Arbitrary waits**: Avoid `page.waitForTimeout()` without reason
- **Global state**: Use fixtures for setup/teardown, not global variables
- **Cross-test dependencies**: Except for documented project chains
- **Locator duplication**: Define locators once in page objects
- **Brittle selectors**: Prefer `data-testid` over class names or positions
- **Silent failures**: Always fail explicitly with clear error messages

---

## Troubleshooting

### Tests Timing Out

Check:
1. Environment `baseUrl` is correct
2. Application is running and accessible
3. Increase `timeout` in Playwright config if needed
4. Use `--headed` mode to debug: `npm run test:headed`

### Page Objects Not Found

Ensure:
1. Page class is exported in `src/pages/index.ts`
2. Fixture is registered in `src/fixtures/base.fixture.ts`
3. TypeScript types are correct in `src/fixtures/base.fixture.ts`
4. Run `npm run typecheck` to validate

### Selector Issues

Debug with:
```bash
# Run specific test in inspector
npx playwright test --debug --grep "test-name"

# Use Playwright Locator Inspector
npx playwright codegen http://localhost:3000
```

### Allure Report Not Generating

Ensure:
```bash
# Install Allure CLI
npm install -g allure

# Check results directory exists
ls -la allure-results/

# Manual generation
allure generate allure-results -o allure-report
```

---

## Code Generation & Recording

### Generate Tests with Codegen

```bash
# Interactive test generator
npm run codegen

# Target specific URL
npm run codegen:doc
npm run codegen:landing

# Record and save auth state
npm run inspect:save-auth
```

This launches Playwright's test generator for recording user interactions.

---

## Type Safety

### TypeScript Configuration

Paths aliases simplify imports:

```typescript
// Use
import { LoginPage } from '@/pages';
import { waitFor } from '@/helpers/wait.helper';

// Instead of
import { LoginPage } from '../../../src/pages';
```

Check types:
```bash
npm run typecheck
```

---

## Code Quality

### Linting & Formatting

```bash
# ESLint check
npm run lint

# Fix linting issues
npm run lint:fix

# Prettier formatting
npm run format
```

Pre-commit hooks (if configured) will enforce these standards.

---

## Continuous Learning & Updates

- **Playwright Docs**: https://playwright.dev
- **Allure Docs**: https://docs.qameta.io/allure
- **Test Scenario Tracker**: Run `npm run tracker -- help` for CLI docs

---

## Related Documentation

- **README.md** — Project setup and quick start
- **Automation Testing Plan** — Complete test scenario list and coverage
- **Coverage Matrix** — Current automation coverage by feature area
- **Application Map** — PICASso platform structure and workflows

---

## Questions or Issues?

- Check existing test examples in `tests/` directory
- Review similar page objects in `src/pages/`
- Run `npm run typecheck` to catch type issues early
- Use `npm run test:debug` to inspect test execution
- Consult Playwright docs for framework-level questions
