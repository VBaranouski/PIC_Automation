# PICASso: API and CI/CD Integration

*What Good Looks Like, Mapped to the Release Management Workflow*

# Contents

[PICASso: API and CI/CD Integration [1](#picasso-api-and-cicd-integration)](#picasso-api-and-cicd-integration)

[Purpose [2](#purpose)](#purpose)

[Guiding Principles [2](#guiding-principles)](#guiding-principles)

[API Integration vs. CRUD Endpoints [2](#api-integration-vs.-crud-endpoints)](#api-integration-vs.-crud-endpoints)

[What CRUD Is [3](#what-crud-is)](#what-crud-is)

[What an Integration API Is [3](#what-an-integration-api-is)](#what-an-integration-api-is)

[Why This Matters [3](#why-this-matters)](#why-this-matters)

[Governance Lens: API Type and DevSecOps Maturity [4](#governance-lens-api-type-and-devsecops-maturity)](#governance-lens-api-type-and-devsecops-maturity)

[How These Dimensions Interact with the API [5](#how-these-dimensions-interact-with-the-api)](#how-these-dimensions-interact-with-the-api)

[Component-Level Granularity [6](#component-level-granularity)](#component-level-granularity)

[The Problem [6](#the-problem)](#the-problem)

[The Resolution [6](#the-resolution)](#the-resolution)

[API and CI/CD Walkthrough of the Release Management Workflow [7](#api-and-cicd-walkthrough-of-the-release-management-workflow)](#api-and-cicd-walkthrough-of-the-release-management-workflow)

[Precondition: Product Creation / Update [7](#precondition-product-creation-update)](#precondition-product-creation-update)

[Step 1 — Create & Scope [7](#step-1-create-scope)](#step-1-create-scope)

[Step 2 — Review & Confirm [8](#step-2-review-confirm)](#step-2-review-confirm)

[Step 3 — Manage [8](#step-3-manage)](#step-3-manage)

[Step 4 — SA & PQL Sign-Off [9](#step-4-sa-pql-sign-off)](#step-4-sa-pql-sign-off)

[Step 5 — FCSR Review [9](#step-5-fcsr-review)](#step-5-fcsr-review)

[Step 6 — Post FCSR Actions [10](#step-6-post-fcsr-actions)](#step-6-post-fcsr-actions)

[Step 7 — Final Acceptance [10](#step-7-final-acceptance)](#step-7-final-acceptance)

[State, Approvals, Rework, and Delegation [12](#state-approvals-rework-and-delegation)](#state-approvals-rework-and-delegation)

[Decisions [12](#decisions)](#decisions)

[Tracked Actions [13](#tracked-actions)](#tracked-actions)

[Delegation [13](#delegation)](#delegation)

[Multi-Submitter Submissions [13](#multi-submitter-submissions)](#multi-submitter-submissions)

[Security at the Boundary [14](#security-at-the-boundary)](#security-at-the-boundary)

[Non-Negotiable Requirements [14](#non-negotiable-requirements)](#non-negotiable-requirements)

[Why This Closes the “What If Someone Injects Bad Data” Question [14](#automated-data-security)](#automated-data-security)

[Summary of Required API Capabilities [15](#summary-of-required-api-capabilities)](#summary-of-required-api-capabilities)

[Closing Position [16](#closing-position)](#closing-position)

## Purpose

PICASso is the source of truth for SDL artefacts and cybersecurity requirements. As more product teams adopt CI/CD and shift security evidence generation into automated pipelines, the manual-only workflow becomes the constraint on how fast and how reliably security posture can be captured.

This document describes what a mature API and CI/CD integration story looks like for PICASso. It is not a critique of the current platform. It is a forward-looking description of capabilities that would allow teams to drive the existing release management workflow programmatically, with the same fidelity, audit trail, and governance as the UI.

The document is structured to be readable at two levels:

- For product and delivery stakeholders: the conceptual sections (2, 3, 4, 5) explain the shape of the change and why each element matters.

- For engineering: the walkthrough of the seven PICASso steps (section 6) and the capability summary (section 9) give the technical detail needed to begin design.

## Guiding Principles

- Both paths coexist. The manual UI workflow remains fully supported. APIs are additive for teams who need automation.

- Parity of assurance. Anything done through an API or CI/CD pipeline must produce the same audit trail, traceability, and evidence record as the UI.

- The workflow is unchanged. The seven release management steps, the functional roles, and the governance gates stay as they are. The API exposes each step faithfully.

- Component-level granularity. Security posture is a property of a component, not only of a release. The API must support this even where the UI treats the release as the unit.

- State is first-class. Approvals, rework, delegation, and tracked actions are explicit operations, not implicit side effects of data changes.

- Security at the boundary is a precondition, not a feature. Authenticated APIs and certified pipelines must be in place before the first release is driven programmatically.

## API Integration vs. CRUD Endpoints

This distinction is the single most important concept in the document, and it is the source of most of the miscommunication between platform teams and integration consumers. Many systems expose endpoints that look like APIs but are in fact thin CRUD wrappers over database tables. A true integration API is a different kind of thing.

### What CRUD Is

CRUD stands for Create, Read, Update, Delete. A CRUD endpoint mirrors a row in a table: you can insert a record, fetch it, modify its fields, or remove it. CRUD is useful for basic data plumbing, and most platforms expose some form of it.

A typical CRUD endpoint looks like this:

- POST /releases create a release record

- GET /releases/{id} read a release record

- PATCH /releases/{id} update fields on a release record

- DELETE /releases/{id} delete a release record

CRUD tells you nothing about what the record means in business. It does not know whether a release can legally transition from Scope Approval to FCSR. It does not know whether a questionnaire answer is valid in context. It does not enforce the workflow; it only manipulates rows. If a caller writes rows in the wrong order, the platform will accept them.

### What an Integration API Is

An integration API exposes the platform’s workflow and business rules as first-class operations. Instead of asking callers to simulate the workflow by writing rows in the right order, it offers verbs that match what users actually do in the UI: answer a questionnaire, submit for scope approval, record residual risk, delegate an approval, link an external artefact, complete a post-FCSR action.

The same operations, expressed as an integration API, look like this:

- POST /releases open a release against one or more components

- POST /releases/{id}/questionnaire/answers submit answers; server validates branching

- POST /releases/{id}/split split into multiple releases mid-questionnaire

- POST /releases/{id}/scope-approval/submit move to SA & PQL sign-off

- POST /releases/{id}/decisions record approve / request-rework / delegate

- POST /releases/{id}/residual-risks attach residual risks and external IDs

- POST /releases/{id}/fcsr/submit move to FCSR review

- POST /releases/{id}/post-fcsr-actions create / complete tracked actions

### Why This Matters

CRUD forces every integration to reimplement the release management workflow outside of PICASso. Every pipeline ends up being a fragile copy of the same logic. When the workflow changes, every integration breaks silently. The source of truth leaks out of the platform.

An integration API keeps the workflow inside PICASso, where it belongs. Pipelines call verbs that match the release management steps. The platform enforces state transitions, role checks, and evidence requirements on the server side. When governance changes, the API changes with it, and every caller inherits the change correctly.

#### Quick Comparison

#### 

| **Aspect** | **CRUD Endpoints** | **Integration API** |
|----|----|----|
| Abstraction level | Rows in a table | Business operations and state transitions |
| Workflow ownership | Caller reconstructs it | Platform enforces it |
| Validation | Field-level (type, required) | Business-level (state, role, context, evidence) |
| Auditability | Change logs on rows | Workflow events with actor, decision, reason, context |
| Risk of drift | High; workflow lives outside the platform | Low; workflow lives in PICASso |

## Governance Lens: API Type and DevSecOps Maturity

The release management workflow does not exist in isolation. Two governance dimensions shape every release: the API type of the product being released, and the DevSecOps maturity of the team building it. These two dimensions determine which controls are mandatory and whether those controls are implemented manually or through automation.

#### API Types and Mandatory Controls

#### 

| **Type** | **Exposure** | **Mandatory Controls** | **Min. Maturity** |
|----|----|----|----|
| **A** | Internal, non-sensitive | Service authentication; SAST; SCA; secrets detection; logging & monitoring | Level 1 |
| **B** | Partner or authenticated intranet | Strong auth (OAuth2, mTLS); SAST; SCA; OpenAPI schema validation; input validation; TLS; logging & alerting; SDL documentation | Level 2 |
| **C** | External / internet-facing | OAuth2 / OIDC; rate limiting & throttling; SAST + SCA + DAST; OWASP API Top 10 coverage; threat modelling; secrets rotation; runtime monitoring; incident response readiness | Level 2 (Level 3 recommended) |
| **D** | Sensitive or regulated data | Everything in Type C, plus: data classification enforcement; encryption at rest and in transit; key management and HSM where applicable; segregation of duties; continuous risk monitoring; formal residual risk acceptance | Level 3 |

#### DevSecOps Maturity Levels

#### 

| **Level** | **Name** | **Characteristics** | **When Permitted** |
|----|----|----|----|
| **0** | Ad-hoc | Manual, reactive security activities; limited or no CI/CD; evidence collected manually | Pilots, legacy, approved exceptions only |
| **1** | Defined | CI/CD pipeline exists; security requirements defined but partially automated; manual reviews still required | Baseline for any API beyond internal use |
| **2** | Integrated | Security integrated into CI/CD; automated scanning produces traceable evidence; security gates enforced before promotion | Target for most business-critical APIs |
| **3** | Optimised | Fully automated and policy-driven; risk-based gating and continuous reassessment; near-real-time evidence ingestion into PICASso | Required for internet-facing or sensitive data APIs |

### How These Dimensions Interact with the API

- At Create & Scope, the caller declares API type and maturity. The platform computes the mandatory control set.

- At Review & Confirm, the Security Advisor validates the declaration and identifies any compensating controls required.

- At Manage, evidence is collected. For higher maturity, the pipeline pushes evidence to PICASso automatically. For lower maturity, evidence is attached manually.

- At FCSR, the decision explicitly references API type, maturity, and which mandatory controls are met. Exceptions are raised where maturity is below the minimum for the API type.

- The API exposes all of this as structured fields, not free text. Queries over the full portfolio (for example, every Type C release at maturity below 2) become trivial.

## Component-Level Granularity

Today a PICASso release is the unit of answer. All components inside a release share the same questionnaire answers, the same requirements, and the same residual risk posture. This is a known design constraint and it is the single largest source of friction when mapping PICASso to external systems such as SBOM registries and Jira.

### The Problem

- Release can cover multiple components. If two components need different answers to a security question, there is no way to express that without creating a separate release manually, after the fact.

- External systems key off a single product or component identifier. An SBOM is produced per product. A Jira project tracks a product. When a PICASso release spans multiple components, external tool IDs cannot be mapped cleanly because the release is one-to-many.

- Residual risk posture is frequently component-specific. Forcing components to share a posture degrades the accuracy of the compliance record and makes the FCSR decision harder to defend.

### The Resolution

The API must treat component-level scope as the norm, not the exception. Teams whose components genuinely share a posture can continue to group them in a single release. Teams whose components diverge must be able to split without friction. Two behaviours are needed:

1.  Release split. At any point before Scope Approval, a release may be split so that its components are redistributed across multiple releases. Answers given so far are inherited by each resulting release, which can then continue independently through the workflow.

2.  Per-component external ID mapping. Residual risk records may associate external identifiers (SBOM IDs, Jira keys, ticket references) at the release–component pair, not only at the release level.

## API and CI/CD Walkthrough of the Release Management Workflow

This section walks the seven PICASso release management steps in order. For each step the document describes: the functional roles involved today, the activities performed, how the step is exposed through the API, how CI/CD drives it, how API type and DevSecOps maturity apply, and what the audit and state implications are.

Nothing in the seven steps changes. The roles remain the same. The governance gates remain the same. What changes is that each step becomes callable from a pipeline, with the same rules enforced by the platform.

### Precondition: Product Creation / Update

Functional roles: Product Admin (Security Advisor during pilot phase).

Activities today: register the product in PICASso; update product details when they change (for example, a change in product type or the responsible users list).

#### API surface

- Create and update product records, including product type, component composition, owning LoB, responsible roles.

- Declare the API type (A–D) on the product record. This drives the mandatory control set for every future release against the product.

- Declare the DevSecOps maturity level. This is a property of the team and can evolve over time.

- Associate the product with its CI/CD pipeline identity and source repository.

#### CI/CD behaviour

- A new product is registered the first time its pipeline runs. Subsequent runs update metadata rather than recreate the record.

- Product metadata changes trigger a review, not silent acceptance. Changes to API type or maturity flag for Security Advisor validation.

### Step 1 — Create & Scope

Functional roles: Product Owner; Security Manager.

Activities today: answer the product questionnaire; answer the release questionnaire; review and update SDL process and product requirements applicability; review and update actions in CS risks and the FCSR decision where applicable.

#### API surface

- Open a release against one or more components belonging to the product.

- Submit answers to the product and release questionnaires. The server validates branching and returns the resulting set of SDL process and product requirements.

- Mark requirement applicability. The API distinguishes between applicable, not applicable with justification, and pending.

- Split a release at any point in this step. Answers submitted so far are inherited by each resulting release.

#### CI/CD behaviour

#### 

- The pipeline opens a release when a release candidate is tagged. The build metadata supplies component identity, version, and the API type (fetched from the product record).

- Where possible, questionnaire answers are derived from build metadata: SBOM contents, static analysis, dependency manifests, threat model artefacts. Human-authored answers remain possible via the UI.

- Contributors are recorded individually. The multi-submitter pattern applies here: many engineers may submit evidence against the same release.

#### Governance overlay

#### 

- API type is immutable on the release once opened. Any change requires closing the release and reopening.

- Maturity is recorded at release open time so that subsequent FCSR decisions can reference the maturity at the time of release, not the maturity today.

### Step 2 — Review & Confirm

Functional roles: Security Advisor, or LOB Security Leader, or BU Security Officer.

Activities today: review product questionnaire; review release questionnaire; risk classification update if needed; review and update SDL process requirements; review and update product requirements.

#### API surface

- Fetch the full release record: components, questionnaires, generated requirements, applicability, declared API type, declared maturity, compensating controls.

- Record a review decision: confirm, request changes, or adjust classification.

- Record compensating controls where the declared maturity is below the minimum for the API type but a release is still justified.

- Every review decision is an immutable audit event with actor, role, timestamp, and decision text.

#### CI/CD behaviour

- This step is typically human-driven even in high-maturity teams. The API exposes the state so that the pipeline can wait on the outcome rather than poll.

- Webhooks notify the pipeline when the step is complete, avoiding fixed polling intervals.

### Step 3 — Manage

Functional roles: Product Owner; Security Manager.

Activities today: manage SDL process requirements; manage product requirements; CS residual risk answers; manage actions.

#### API surface

- Submit responses to SDL process requirements and product requirements, with evidence attachments.

- Submit residual risk entries. Each entry carries a classification, a rationale, and one or more external identifier links.

- Attach external identifiers to the release–component pair: SBOM ID, Jira keys, scan report references, threat model artefact references.

- Create, update, and complete tracked actions. Actions carry an owner, a due date, a status, and a link to the decision context that created them.

#### CI/CD behaviour

- This is the step where CI/CD delivers the most value. Scan outputs, dependency reports, SBOMs, and test results are pushed to the release automatically.

- Evidence from automated pipelines is tagged as such. Auditors and approvers can distinguish automated evidence from manual attestations.

- The API is idempotent. A pipeline that retries a push does not create duplicate evidence records.

#### Governance overlay

- Mandatory controls for the declared API type are checked as evidence arrives. A missing control is flagged as a gap, not silently accepted.

- At Level 2 or higher, automated evidence is expected. Manual attestations at higher maturity levels flag for review.

### Step 4 — SA & PQL Sign-Off

Functional roles: Security Advisor; Process Quality Leader.

Activities today: review SDL process requirements artefacts and evaluate; review product requirements artefacts and evaluate; CS residual risks evaluate; add or update actions; provide FCSR decision recommendation; FCSR readiness confirmation.

#### API surface

- Fetch the full evidence set with provenance (manual vs. automated, author, timestamp, tool version where applicable).

- Record evaluation outcomes against process requirements, product requirements, and residual risks.

- Record an FCSR decision recommendation with supporting text.

- Record FCSR readiness confirmation.

- Each evaluation and each recommendation is an immutable audit event.

#### Governance overlay

- The sign-off explicitly references whether mandatory controls for the API type are met.

- Where the declared maturity is below the minimum for the API type, the recommendation must name the compensating controls that justify proceeding.

### Step 5 — FCSR Review

Functional roles: Security Advisor or Security Leader or BU Security Officer; Process Quality Leader. Escalation: CISO / SVP LOB.

Activities today: actions (pre- and post-conditions); decision; escalation and exception.

#### API surface

- Record the FCSR decision: approved, conditionally approved, or rejected.

- Where conditional, attach the set of post-FCSR actions that must be completed. Each action carries an owner, a due date, and a completion criterion.

- Where rejected, record the rationale and optionally a set of required changes.

- Escalate to CISO or SVP LOB when the release falls outside delegated authority. Escalation is an explicit state transition, not an email chain.

#### State and rework

- A conditional approval moves the release to Post FCSR Actions.

- A rejection returns the release to a defined prior state (most commonly Manage) with a linked rework reason.

- A rework cycle preserves all history. The release retains every decision, every action, and every evidence record from the previous iteration.

### Step 6 — Post FCSR Actions

Functional roles: Product Owner; Security Manager.

Activities today: manage pre-conditions actions; cancel release; complete release.

#### API surface

- Query the full list of actions for the release, including pre-conditions derived from prior approvals and post-conditions created by the current FCSR decision.

- Pull actions from prior releases involving the same product or component, so that preconditions established in earlier approvals remain visible and addressable.

- Complete actions individually. Each completion is attributed, timestamped, and optionally linked to evidence.

- Cancel the release explicitly. A cancellation carries a reason and is distinct from an abandoned release.

#### CI/CD behaviour

- Where an action can be closed by automated evidence (for example, a remediation shipped in a later build), the pipeline closes it and attaches the evidence reference.

- Where an action requires human judgement, it is closed via the UI; the pipeline simply waits on the state.

### Step 7 — Final Acceptance

Functional roles: Security Advisor or Security Leader or BU Security Officer.

Activities today: final acceptance; cancel.

#### API surface

- Record final acceptance. The release moves to an immutable approved terminal state.

- Record cancellation where final acceptance is not granted.

- Emit a webhook on terminal state so downstream consumers (release trains, compliance dashboards, SBOM registries) can react.

#### Governance overlay

- Final acceptance confirms that no regression in DevSecOps maturity has occurred since release open and that mandatory controls remain in place.

- The terminal record carries forward all decisions, all actions, all contributors, and all external identifier mappings for the full audit history.

## State, Approvals, Rework, and Delegation

Approvals in the PICASso workflow are not a single boolean. They are a state machine with explicit branches for rework, delegation, and tracked actions. The API must expose this explicitly so pipelines and external orchestrators can drive approvals with the same fidelity as the UI.

#### Release States

| **State** | **Meaning** |
|----|----|
| Draft | Release exists, components associated, questionnaires not yet submitted. |
| Create & Scope | Questionnaires and requirement applicability being captured. Release can still be split. |
| Review & Confirm | Awaiting Security Advisor or LOB Security Leader or BU Security Officer review. |
| Manage | Requirements and residual risks being populated with evidence. |
| SA & PQL Sign-Off | Awaiting evaluation and FCSR readiness confirmation. |
| FCSR | Awaiting FCSR decision. May return to Manage on rejection or move to Post FCSR Actions on conditional approval. |
| Post FCSR Actions | Conditional approval granted; actions must be closed before final acceptance. |
| Final Acceptance | Awaiting final acceptance decision. |
| Accepted | Terminal approved state. Immutable, audit-complete. |
| Cancelled | Release explicitly cancelled at any point in the workflow. |

### Decisions

Every decision step in the workflow (Review & Confirm, SA & PQL Sign-Off, FCSR, Final Acceptance) accepts one of the following outcomes. Every decision is recorded as an immutable audit event:

- Approve. The release progresses to the next state.

- Conditionally approve. The release progresses, but tracked actions are attached that must be completed before the next decision point.

- Request rework. The release returns to a defined prior state. A reason and optional action list are recorded.

- Reject. The release cannot proceed. A reason is recorded. The release may be cancelled or reopened after corrective work.

- Delegate. The decision authority is transferred to another authorised party for this release and this decision point only.

- Escalate. The decision is raised to the next authority level (for example, CISO or SVP LOB) when the release exceeds the current approver’s delegated authority.

### Tracked Actions

- Actions are scoped to a release and a component.

- Each action records an owner, a due date, a status, and the decision context that created it.

- Actions created in prior releases involving the same product or component are queryable from the current release, so preconditions from earlier approvals are visible and addressable.

- Action completion is attributable and may link to evidence, including evidence produced by the CI/CD pipeline.

### Delegation

PICASso today constrains many actions to a small number of formal roles. In automated workflows, the people who submit data are often not the people who bear the formal approval role. The API accommodates this without weakening the role model.

- Delegation is explicit, time-boxed, and audited. A role holder delegates a decision authority to another authorised party for a specific release and decision point.

- Every delegated decision carries both the original role holder and the delegate in its audit record.

- Delegation does not change the role model. It records who acted on behalf of whom, within the existing governance structure.

### Multi-Submitter Submissions

Data submission and data approval are separate responsibilities. The API allows many authenticated contributors to submit information (questionnaire answers, requirement responses, residual risk entries) against a release, while preserving the single formal approver at the end of each workflow step.

- Every submission is attributed to its author.

- The formal approver sees the full contributor list and validates that the aggregate record is correct.

- The role model is unchanged: one accountable approver, many traceable contributors.

## Security at the Boundary

Concerns about automation often focus on the wrong layer. The question is not whether a pipeline might inject data. The question is whether the ingestion boundary is trusted. If the boundary is properly secured, pipeline-driven submissions carry the same as UI-driven submissions. If the boundary is not properly secured, neither path is trustworthy.

### Non-Negotiable Requirements

- Mutual authentication. All API calls authenticated via short-lived, scoped tokens (OAuth 2.0 client credentials, OIDC, or equivalent) or mutual TLS for machine-to-machine traffic.

- Authorisation at the operation level. Every API operation is checked against the caller’s role, delegation chain, and scope (LoB, product, component).

- Pipeline identity is a first-class principal. A CI/CD pipeline runs as a named service identity, not as a human user and not as a shared secret.

- Every mutation produces an immutable audit event. Actor, operation, payload hash, timestamp, correlation ID.

- Secrets never traverse the payload. Tokens are issued by an identity provider, rotated automatically, and bound to the pipeline identity.

- Rate limiting, anomaly detection, and abuse monitoring on the ingestion boundary.

- Idempotency. Every mutating operation accepts a client idempotency key so that retries are safe.

### Automated Data Security 

A trusted pipeline is not a security concession. It is a requirement. If the pipeline that builds and ships the product cannot be trusted, then the product itself cannot be trusted, regardless of what the compliance record says. Securing the API boundary is the same exercise as securing the build pipeline that ships the software. The same controls that protect the product protect the evidence.

### Summary of Required API Capabilities

The following capabilities, taken together, constitute what the platform should design toward. Each capability maps to one or more of the seven workflow steps and is callable by CI/CD pipelines as well as by human users.

| **Capability** | **What it enables** | **Workflow step(s)** |
|----|----|----|
| Product & component management | Create and update products and components, including API type and DevSecOps maturity declaration. | Precondition |
| Release lifecycle | Open, progress, split, cancel, and accept releases. Each action returns the new state explicitly. | All steps |
| Questionnaire submission | Submit and update product and release questionnaire answers. Trigger branching server-side. | Create & Scope |
| Release split | Split a release into multiple releases mid-questionnaire, preserving answers given so far. | Create & Scope |
| Requirements & evidence | Fetch generated requirements, submit responses with evidence, support many contributors per release. | Manage; Sign-Off |
| Decision recording | Approve, conditionally approve, request rework, reject, delegate, or escalate at any decision step. | Review; Sign-Off; FCSR; Final |
| Tracked actions | Create, complete, and cross-reference actions scoped per release and component. Pull pre-conditions from prior releases. | FCSR; Post FCSR |
| Residual risk & external IDs | Record residual risks and map external identifiers (SBOM, Jira, etc.) at the release–component level. | Manage |
| Delegation | Explicit, time-boxed delegation of decision authority per release and decision point, with dual audit retention. | All decision steps |
| Webhooks | Push notifications on key state transitions so pipelines can react without polling. | All steps |
| Audit & query | Read full workflow history, all decisions, all actions, all contributors, and all external IDs for any release. | All steps |
| Authentication & authorisation | Short-lived, scoped tokens; per-operation authorisation; pipeline identities as first-class principals. | Platform-wide |
| Idempotency | Client idempotency keys on every mutation to make retries safe. | Platform-wide |

### 

### Closing Position

The seven-step release management workflow is well understood and serves teams who operate through the UI. The proposal in this document does not change the workflow, the roles, or the governance model. It adds a programmatic surface that mirrors the workflow faithfully, with the granularity and state semantics that automated pipelines require.

Three outcomes follow. First, teams that need CI/CD integration can adopt PICASso without bypassing it or building shadow workflows. Second, external systems that already assume one-to-one mapping between a release and a product or component map cleanly, without the workarounds that multi-component releases force today. Third, DevSecOps maturity and API type become structured governance data that can be queried across the portfolio, rather than narrative fields that only the original approver can interpret.

The manual path and the automated path are equivalent in assurance. They differ only in who is driving the keyboard.
