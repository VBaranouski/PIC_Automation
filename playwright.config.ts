import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { getEnvironment } from './config/environments';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const environment = getEnvironment(process.env.TEST_ENV);
const projectRoot = __dirname;

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const exactSpec = (...segments: string[]): RegExp => new RegExp(segments.map(escapeRegex).join('[\\\\/]') + '$');

export default defineConfig({
	testDir: path.resolve(projectRoot, 'tests'),
	timeout: 30_000,
	expect: { timeout: 10_000 },
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 4 : undefined,
	outputDir: path.resolve(projectRoot, 'test-results'),

	reporter: [
		['list'],
		['html', { outputFolder: path.resolve(projectRoot, 'playwright-report'), open: 'never' }],
		['allure-playwright', {
			resultsDir: path.resolve(projectRoot, 'allure-results'),
			detail: true,
			suiteTitle: true,
		}],
		['json', { outputFile: path.resolve(projectRoot, 'test-results/results.json') }],
	],

	use: {
		baseURL: process.env.BASE_URL || environment.baseUrl,
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
		actionTimeout: 15_000,
		navigationTimeout: 60_000,
		testIdAttribute: 'data-testid',
	},

	projects: [
		{
			name: 'setup',
			testMatch: /.*\.setup\.ts/,
			// Exclude the DOC-specific state setup — it has its own project with dependencies
			testIgnore: [exactSpec('tests', 'doc', 'doc-state.setup.ts')],
		},
		{
			name: 'release-detail-header',
			testMatch: exactSpec('tests', 'releases', 'release-detail-header.spec.ts'),
			use: { ...devices['Desktop Chrome'] },
			dependencies: ['setup'],
		},
		{
			name: 'doc-product-setup',
			testMatch: exactSpec('tests', 'doc', 'new-product-creation-digital-offer.spec.ts'),
			use: { ...devices['Desktop Chrome'] },
			dependencies: ['setup'],
		},
		{
			name: 'doc-initiation',
			testMatch: exactSpec('tests', 'doc', 'initiate-doc.spec.ts'),
			use: { ...devices['Desktop Chrome'] },
			dependencies: ['doc-product-setup'],
		},
		// Scans My DOCs tab for a Controls Scoping DOC and persists its URL to .doc-state.json.
		// All DOC detail specs depend on this project.
		{
			name: 'doc-state-setup',
			testMatch: exactSpec('tests', 'doc', 'doc-state.setup.ts'),
			use: { ...devices['Desktop Chrome'] },
			dependencies: ['doc-initiation'],
		},
		// ── DOC tab specs (each depends on the previous to preserve logical order) ──────
		{
			name: 'doc-my-docs-tab',
			testMatch: exactSpec('tests', 'doc', 'my-docs-tab.spec.ts'),
			use: { ...devices['Desktop Chrome'] },
			dependencies: ['doc-state-setup'],
		},
		{
			name: 'doc-detail-header',
			testMatch: exactSpec('tests', 'doc', 'doc-detail.spec.ts'),
			use: { ...devices['Desktop Chrome'] },
			dependencies: ['doc-state-setup'],
		},
		{
			name: 'doc-detail-offer',
			testMatch: exactSpec('tests', 'doc', 'doc-detail-offer.spec.ts'),
			use: { ...devices['Desktop Chrome'] },
			dependencies: ['doc-state-setup'],
		},
		{
			name: 'doc-detail-roles',
			testMatch: exactSpec('tests', 'doc', 'doc-detail-roles.spec.ts'),
			use: { ...devices['Desktop Chrome'] },
			dependencies: ['doc-state-setup'],
		},
		{
			name: 'doc-detail-its',
			testMatch: exactSpec('tests', 'doc', 'doc-detail-its.spec.ts'),
			use: { ...devices['Desktop Chrome'] },
			dependencies: ['doc-state-setup'],
		},
		{
			name: 'doc-control-detail',
			testMatch: exactSpec('tests', 'doc', 'control-detail.spec.ts'),
			use: { ...devices['Desktop Chrome'] },
			dependencies: ['doc-detail-its'],
		},
		{
			name: 'doc-history',
			testMatch: exactSpec('tests', 'doc', 'doc-history.spec.ts'),
			use: { ...devices['Desktop Chrome'] },
			dependencies: ['doc-state-setup'],
		},
		{
			name: 'doc-detail-actions',
			testMatch: exactSpec('tests', 'doc', 'doc-detail-actions.spec.ts'),
			use: { ...devices['Desktop Chrome'] },
		},
		{
			name: 'doc-detail-risk-summary',
			testMatch: exactSpec('tests', 'doc', 'doc-detail-risk-summary.spec.ts'),
			use: { ...devices['Desktop Chrome'] },
		},
		{
			name: 'doc-detail-certification',
			testMatch: exactSpec('tests', 'doc', 'doc-detail-certification.spec.ts'),
			use: { ...devices['Desktop Chrome'] },
		},
		{
			name: 'doc-lifecycle',
			testMatch: exactSpec('tests', 'doc', 'doc-lifecycle.spec.ts'),
			use: { ...devices['Desktop Chrome'] },
		},
		// ── Tracker unit/integration tests (no browser, no dependencies) ────────────────
		{
			name: 'tracker',
			testMatch: /[\\/]tests[\\/]tracker[\\/].*\.test\.ts$/,
		},
		// ────────────────────────────────────────────────────────────────────────────────
		{
			name: 'chromium',
			testIgnore: [
				exactSpec('tests', 'doc', 'new-product-creation-digital-offer.spec.ts'),
				exactSpec('tests', 'doc', 'initiate-doc.spec.ts'),
				exactSpec('tests', 'doc', 'doc-state.setup.ts'),
				exactSpec('tests', 'doc', 'my-docs-tab.spec.ts'),
				exactSpec('tests', 'doc', 'doc-detail.spec.ts'),
				exactSpec('tests', 'doc', 'doc-detail-offer.spec.ts'),
				exactSpec('tests', 'doc', 'doc-detail-roles.spec.ts'),
				exactSpec('tests', 'doc', 'doc-detail-its.spec.ts'),
				exactSpec('tests', 'doc', 'control-detail.spec.ts'),
				exactSpec('tests', 'doc', 'doc-history.spec.ts'),
				exactSpec('tests', 'doc', 'doc-detail-actions.spec.ts'),
				exactSpec('tests', 'doc', 'doc-detail-risk-summary.spec.ts'),
				exactSpec('tests', 'doc', 'doc-detail-certification.spec.ts'),
				exactSpec('tests', 'doc', 'doc-lifecycle.spec.ts'),
				exactSpec('tests', 'releases', 'release-detail-header.spec.ts'),
			],
			use: { ...devices['Desktop Chrome'] },
			dependencies: ['setup'],
		},
		{
			name: 'smoke',
			grep: /@smoke/,
			testIgnore: [
				exactSpec('tests', 'doc', 'new-product-creation-digital-offer.spec.ts'),
				exactSpec('tests', 'doc', 'initiate-doc.spec.ts'),
				exactSpec('tests', 'doc', 'doc-state.setup.ts'),
			],
			use: { ...devices['Desktop Chrome'] },
			dependencies: ['setup'],
		},
	],
});
