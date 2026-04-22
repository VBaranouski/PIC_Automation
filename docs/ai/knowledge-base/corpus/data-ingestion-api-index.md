# Data Ingestion API — User Guide Index

> **Source file:** `docs/ai/knowledge-base/user-guides/PICASso Data Ingestion API (4) (1).docx`
> **Version:** 1.3 (10-Sep-2025)
> **Total content:** ~6937 lines (extracted text), 128 endpoints

## Document Structure

| Section | Title | Sub-sections |
|---------|-------|-------------|
| 1 | Purpose | 1.1 Integration Architecture |
| 2 | Authentication | 2.1 Azure AD App Registration, 2.2 Consumer Tool Configuration, 2.3 Token Request & Validation, 2.4 Authorization & Scope Mapping |
| 3 | API Methods | 11 domains (see below) |

## API Domains (Section 3)

| # | Section | Domain | Endpoints | HTTP Methods |
|---|---------|--------|-----------|-------------|
| 3.1 | Release Details | Release | 3 | POST, PUT, GET |
| 3.2 | SDL Process Requirements Summary | SDLOpenProcessRequirements, SDLProcessRequirementsSummary | 12 | PUT, GET, POST, DELETE |
| 3.3 | System Design | SystemDesign | 18 | POST, PUT, GET, DELETE |
| 3.4 | Threat Model | ThreatModel | 21 | POST, PUT, GET, DELETE |
| 3.5 | 3rd Party Suppliers & SE Bricks | ThirdPartySuppliers | 15 | POST, PUT, GET, DELETE |
| 3.6 | Static Code Analysis | StaticCodeAnalysis | 11 | POST, PUT, GET, DELETE |
| 3.7 | Software Composition Analysis | SoftwareCompositionAnalysis | 15 | POST, PUT, GET, DELETE |
| 3.8 | FOSS Check | FOSSCheck | 7 | POST, PUT, GET, DELETE |
| 3.9 | Security Defects | SecurityDefects | 14 | POST, PUT, GET, DELETE |
| 3.10 | External Vulnerabilities | ExternalVulnerabilities | 11 | POST, PUT, GET, DELETE |
| 3.11 | Reference Data | ReferenceData_GetLoV | 1 | GET |

**Total endpoints:** 128

## Cross-Domain Patterns

Every domain that supports mutations shares these patterns:
- **Residual Risk Classification** sub-resource (POST/PUT/GET) on most domains
- **Actions** sub-resource (POST/PUT/DELETE/GET) on most domains
- **State-based editability** — data writable only in: INPROGRESS, FCSRREADINESSREVIEW, ACTIONSCLOSURE, FCSRREVIEW, FCSRESCALATED
- **Standard error codes:** 200, 201, 400, 401, 403, 404
- **Reference data validation** via `/ReferenceData_GetLoV/{EntityCode}` lookups
