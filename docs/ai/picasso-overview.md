# PICASso Application Overview

> Quick-reference document for AI agents working on the PICASso project.

## What is PICASso?

**PICASso** (Product Information for CyberSecurity Assessment) is a **Governance, Risk & Compliance (GRC)** web application used by Schneider Electric to manage the Secure Development Lifecycle (SDL) and Formal Cybersecurity Review (FCSR) process for all hardware and software products.

- **Platform**: Built on **OutSystems** low-code platform
- **Access**: Via the LEAP enterprise portal at `https://qa.leap.schneider-electric.com` (QA environment)
- **Authentication**: Schneider Electric SSO through LEAP; access requested via ServiceNow
- **Primary Module**: `GRC_PICASso` (main app) + `GRC_PICASso_DOC` (Digital Offer Certification)

## Core Purpose

PICASso ensures every Schneider Electric product release undergoes a structured cybersecurity review before going live. It tracks:
- **Product registration** and organizational ownership
- **Release scoping** with security questionnaires that auto-generate requirements
- **Process & Product Requirements** fulfillment with evidence tracking
- **Cybersecurity Residual Risks** assessment across 10 risk categories
- **FCSR Decision** workflow with multi-level approval hierarchy
- **Actions Management** for pre/post-condition tracking with Jira integration
- **Digital Offer Certification (DOC)** for IoT/cloud products

## Key User Roles

| Role | Responsibility |
|------|---------------|
| **Product Owner (PO)** | Creates products/releases, manages requirements, submits for review |
| **Security Manager (SM)** | Assists PO with security-related tasks at product level |
| **Security Advisor (SA)** | Reviews release scope, signs off on FCSR readiness, approves FCSR |
| **Process Quality Leader (PQL)** | Evaluates SDL process compliance, signs off alongside SA |
| **LOB Security Leader** | Approves FCSR for higher-risk releases at Line of Business level |
| **BU Security Officer** | Approves FCSR for highest-risk releases at Business Unit level |
| **Privacy Advisor/Reviewer** | Handles Data Protection & Privacy reviews when applicable |
| **Product Admin** | Administrative role; can inactivate products/releases |

## Application Structure

### Landing Page
Four tabs providing personalized views:
- **My Tasks** — action items assigned to the logged-in user across all releases
- **My Products** — products the user is associated with (as PO, SM, SA, etc.)
- **My Releases** — releases the user is involved in, with status filters
- **My DOCs** — Digital Offer Certifications for the user's products

Also accessible from landing: **Roles Delegation** link, **New Product** button, **Reports & Dashboards**

### Product Lifecycle
1. **Create Product** — register a new product with organizational hierarchy, product type, team assignments, security configuration, and tracking tool setup (Jira/Jama/Azure DevOps)
2. **Product Detail** — view/edit product information, manage releases, configure status mapping, view change history, initiate DOC
3. **Actions Management** — cross-release action tracking (opens in separate window)

### Release Workflow (7 Stages)

```
Creation & Scoping → Review & Confirm → Manage → SA & PQL Sign Off → FCSR Review → Post FCSR Actions → Final Acceptance
```

1. **Creation & Scoping** — PO/SM fill release details, answer questionnaire (auto-generates requirements), review process/product requirements, manage associated SE products
2. **Review & Confirm** — SA/LOB SL/BU SO review scope, adjust risk classification, provide scope decision
3. **Manage** — PO/SM update requirement statuses, collect evidence, fill CSRR sections, submit to Jira/Jama, provide FCSR recommendation
4. **SA & PQL Sign Off** — SA and PQL evaluate requirements completeness, classify residual risks, provide recommendations
5. **FCSR Review** — Decision maker (SA/LOB SL/BU SO) conducts formal review, decides: Go / Go with Pre-Conditions / Go with Post-Conditions / No-Go. Can escalate or request exception (CISO/SVP)
6. **Post FCSR Actions** — Close pre/post-condition actions; No-Go leads to cancellation
7. **Final Acceptance** — Reviewer accepts pre-condition closure; release marked Completed

### Release Content Tabs
- **Release Details** — release info, dates, associated SE products (Included/Part Of)
- **Roles & Responsibilities** — SDL roles and product team assignments
- **Questionnaire** — security questionnaire driving requirement scoping
- **Process Requirements** — SDL practice requirements with status/evidence/justification, bulk edit, file upload, Jira integration
- **Product Requirements** — cybersecurity requirements with categories/sources, custom requirements, Jama integration
- **Review & Confirm** — scope review summary and decision (visible at R&C stage)
- **Cybersecurity Residual Risks (CSRR)** — 10 sub-sections: SDL Processes Summary, Product Requirements Summary, System Design, Threat Model, 3rd Party Suppliers & SE Bricks, Static Code Analysis, Software Composition Analysis, FOSS Check, Security Defects, External Vulnerabilities
- **FCSR Decision** — participants, recommendations, discussion topics, actions, approval decision; includes **Report Configurator** for generating scope approval and FCSR results reports (Confluence 576736204)
- **Data Protection & Privacy Review** — privacy sections with questions and evidence (when applicable)

### DOC Workflow (5 Stages)
For Digital Offer products: Initiate DOC → Scope ITS Controls → Risk Assessment → Risk Summary Review → Issue Certification

### Roles Delegation
Separate page allowing users to delegate their roles to others for a specified period. Features:
- My Roles tab (personal role delegation)
- Org Level Users tab (CSO can delegate for users in their scope)
- Bulk delegation/removal
- Delegation history tracking
- Email notifications for delegation events
- **Delegated Requirements Traceability** — dialog showing full traceability matrix of requirements across delegated roles (Confluence 587596145)

## Integration Points

| System | Purpose |
|--------|---------|
| **Jira** | Submit/sync process & product requirements; submit actions; daily auto-sync |
| **Jama** (via Orchestra) | Submit/sync product requirements to Jama; daily auto-sync |
| **ServiceNow** | Access request management |
| **LEAP Portal** | SSO authentication gateway |
| **PIM** | Product data integration (planned/WIP) |
| **Azure DevOps** | Tracking tool option (planned/WIP) |
| **Tableau** | Reporting & dashboards |
| **Intel DS / Informatica** | Training completion progress data feed for SDL compliance tracking (Confluence 681885751) |
| **Data Ingestion API** | REST API (OAuth 2.0 via Azure AD) for pushing data into PICASso from external tools; supports 11 domains: Release Details, SDL Process Requirements Summary, System Design, Threat Model, 3rd Party Suppliers & SE Bricks, Static Code Analysis, Software Composition Analysis, FOSS Check, Security Defects, External Vulnerabilities, Reference Data (Confluence 683835899) |
| **Data Extraction API** | REST API for reading PICASso Staging Area DB for reporting and metrics; supports 3 auth modes: system-to-system (OAuth 2.0 Client Credentials), user-to-system (PingID Authorization Code), and PowerQuery (Refresh Token via PAT page) (Confluence 684370146) |

## Technical Notes for Automation

- **URL Pattern**: `https://qa.leap.schneider-electric.com/GRC_PICASso/{PageName}?{params}`
- **UI Framework**: OutSystems reactive web — uses custom web components (e.g., `vscomp-combobox`), AJAX-heavy, dynamic DOM
- **Key Challenges**: Dynamic loading, iframe for LEAP header, custom dropdowns (not native `<select>`), date pickers, file upload for requirements
- **Test Credentials**: User `PICEMDEPQL` / password `outsystems` / role: Process Quality Leader
- **Existing Tests**: Located in `projects/pw-autotest/tests/` using Playwright + TypeScript

## Map Artifacts

| File | Description |
|------|-------------|
| `docs/ai/application-map.json` | Structured data v1.6.0 — 31 nodes, 42 links: all pages, tabs, dialogs, elements, external integrations |
| `docs/ai/application-map.html` | 2D interactive force-graph (D3.js v7, SVG) |
| `docs/ai/application-map-3d.html` | 3D interactive force-graph (3d-force-graph, WebGL) |
| `docs/ai/exploration-plan.md` | Detailed exploration log with all steps A-K |
| `docs/ai/automation-testing-plan.md` | Feature-by-feature TypeScript/Playwright test checklist (workflow-based, Phase 1) |
| `docs/ai/current-automation-coverage.md` | Free-form notes on what is currently automated in `projects/pw-autotest` |
| `docs/ai/current-automation-coverage-matrix.md` | Tabular matrix of suite → coverage level |
| `docs/ai/story-to-test-mapping.md` | Jira story → test file → test title mapping |
| `docs/ai/picasso-overview.md` | This document |

---
*Last updated: 2026-03-29. Sources: browser exploration sessions, User Navigation Guide, Confluence pages, and application-map.json v1.6.0.*
