/**
 * Test Scenario Tracker — Operations (re-export shim)
 *
 * Backwards-compatible barrel that re-exports every public symbol
 * from the focused modules introduced in the Phase 3 split.
 *
 * Consumers (CLI, UI server, index.ts) can keep importing from
 * './operations' with zero changes.
 */

// Shared helpers
export {
  WORKFLOW_ORDER,
  workflowSortKey,
  now,
  parseJsonArray,
  normalizeSpecFilePath,
  featureAreaFromSpecFile,
  workflowNameFromSubsection,
} from './helpers';

// Spec file parsing (TS AST)
export type {
  ImportableScenarioCandidate,
  ScenarioDetailOverride,
  ParsedSpecScenarioDetail,
} from './spec-parser';
export {
  extractQuotedText,
  extractScenarioIdFromDescription,
  extractScenarioTextFromDescription,
  extractScenarioIdsFromSpecContent,
  extractStringFromTsExpression,
  isTestDefinitionCall,
  isFixmeTestDefinition,
  isTestStepCall,
  isAllureDescriptionCall,
  isGenericExecutionNote,
  findSpecFiles,
  loadScenarioDetailOverrides,
  parseScenarioDetailsFromSpec,
  parseImportableScenariosFromSpec,
} from './spec-parser';

// CRUD operations
export type {
  AddScenarioInput,
  UpdateScenarioInput,
  ScenarioDetails,
} from './crud';
export {
  rowToScenario,
  getGroups,
  setGroups,
  isValidAutomationState,
  isValidExecutionStatus,
  isValidPriority,
  isValidFeatureArea,
  addScenario,
  getScenario,
  scenarioExists,
  updateScenario,
  removeScenario,
  setAutomationState,
  setExecutionStatus,
  holdScenario,
  unholdScenario,
  addGroupToScenario,
  removeGroupFromScenario,
  listAllGroups,
  addGroup,
  listScenarios,
  getOnHoldIds,
  setScenarioDetails,
  getScenarioDetails,
  upsertScenarioDetails,
  getAllScenarioDetails,
  upsertScenario,
  getDistinctWorkflows,
} from './crud';

// Sync operations
export type {
  SpecMappingIndex,
  SyncResult,
  SyncScenarioDetailsResult,
} from './sync';
export {
  buildSpecMappingIndex,
  resolveScenarioSpecFile,
  normalizeScenarioSpecMappings,
  syncWithSpecFiles,
  syncScenarioDetailsFromSpecs,
} from './sync';

// Statistics
export type { TrackerStats } from './stats';
export { getStats } from './stats';

// Import / Export
export {
  exportToJson,
  importMissingScenariosFromSpecs,
  importFromJson,
} from './import-export';
