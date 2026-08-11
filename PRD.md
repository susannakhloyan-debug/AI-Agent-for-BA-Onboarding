# Banking PRD — Fill-In Template

A plain-Markdown version of `examples/prd-fill-in-template.json`, for
filling in directly without touching JSON. Same fields, same order as
what the Banking PRD Generator produces (BABOK v3-aligned, 17 sections).

**How to use:** replace every `[FILL IN — ...]` with your real project
details. Only **Product / System Name**, **Feature Name**, and
**Author** are required — everything else is optional; leave a
section's table at just its header row (or delete the section) to skip
it and fall back to the tool's built-in banking default.

**When you're done:** transfer these answers into a copy of
`examples/prd-fill-in-template.json` (or edit that file's placeholders
directly) and run:

```bash
node src/generatePrd.js --config examples/your-feature.json
```

---

## Document Control

| Field | Value |
|---|---|
| Product / System Name | [FILL IN — e.g. Digital Banking Platform] |
| Feature / Epic | [FILL IN — e.g. Instant Card Freeze & Unfreeze] |
| Author (Senior BA) | [FILL IN — your name] |
| Business Unit | [FILL IN — e.g. Retail Banking, Cards & Payments] |
| Document Version | 0.1 |
| Status | Draft |
| Priority | High *(Critical / High / Medium / Low)* |
| Target Release | [FILL IN — e.g. Q4 2026] |

## 1. Purpose & Business Need
*BABOK: Strategy Analysis*

[FILL IN — 2-4 sentences: what business problem does this feature solve, and why now?]

## 2. Business Objectives & Success Metrics
*BABOK: Strategy Analysis / Solution Evaluation*

**Business Objectives**
- [FILL IN — objective 1, e.g. "Reduce average handling time for X by Y%."]
- [FILL IN — objective 2]

**Success Metrics (KPIs)**

| Metric | Target | How It Will Be Measured |
|---|---|---|
| [FILL IN] | [FILL IN] | [FILL IN] |

## 3. Stakeholder Analysis (RACI)
*BABOK: Business Analysis Planning & Monitoring*

| Name | Role | RACI |
|---|---|---|
| TBD | Business Sponsor | A |
| TBD | Product Owner | R |
| [FILL IN — your name] | Senior Business Analyst (author) | R |
| TBD | Engineering Lead | C |
| TBD | Compliance Officer | C |
| TBD | Risk Officer | C |
| TBD | Operations / Contact Center | I |

*R = Responsible, A = Accountable, C = Consulted, I = Informed*

## 4. Elicitation Summary
*BABOK: Elicitation & Collaboration*

**Techniques Used**
- [FILL IN — e.g. Stakeholder interviews with Compliance and Operations]

**Sources Consulted**
- [FILL IN — e.g. Business Sponsor, existing policy documentation]

## 5. Scope
*BABOK: Requirements Analysis & Design Definition*

**In Scope**
- [FILL IN]

**Out of Scope**
- [FILL IN]

**Channels Affected**
- [FILL IN — e.g. Mobile Banking App, Internet/Online Banking, Branch/Teller, Contact Center/IVR]

## 6. Current State (As-Is) & Future State (To-Be)
*BABOK: Strategy Analysis*

**Current State**

[FILL IN — how is this need met today?]

**Future State**

[FILL IN — what will the experience look like once this is delivered?]

## 7. Assumptions, Constraints & Dependencies
*BABOK: Requirements Life Cycle Management*

**Assumptions**
- [FILL IN]

**Constraints**
- [FILL IN]

**Dependencies**
- [FILL IN]

## 8. Regulatory & Compliance Requirements
*BABOK: Requirements Analysis & Design Definition — banking-specific*

| Regulation / Framework | Requirement |
|---|---|
| [FILL IN — e.g. KYC / Customer Due Diligence] | [FILL IN — what must this feature do to satisfy it] |

*Leave this table at just the header row to fall back to the tool's default banking regulatory list (KYC, AML, PCI DSS, PSD2, GDPR, Basel III, SOX).*

## 9. Business Rules
*BABOK: Requirements Analysis & Design Definition*

- [FILL IN — a rule that governs how this feature must behave (eligibility, limits, exceptions)]

## 10. Functional Requirements — Epics, User Stories & Acceptance Criteria
*BABOK: Requirements Analysis & Design Definition*

### EPIC-1 — [FILL IN title]

[FILL IN — 1-2 sentence description of what this epic delivers and why]

#### US-1.1 — [FILL IN story title] (Priority: [FILL IN])

As a [FILL IN user type], I want [FILL IN], so that [FILL IN].

Acceptance Criteria:
- Given [FILL IN], when [FILL IN], then [FILL IN].
- Given [FILL IN], when [FILL IN], then [FILL IN].

*(Copy the `#### US-x.x` block above for additional stories, and the `### EPIC-x` block for additional epics.)*

## 11. Non-Functional Requirements
*BABOK: Requirements Analysis & Design Definition*

**Security**
- [FILL IN]

**Performance**
- [FILL IN]

*Delete this section to fall back to the tool's default NFRs (Security, Performance, Availability & Reliability, Auditability & Compliance, Usability & Accessibility, Scalability).*

## 12. Data Requirements
*BABOK: Requirements Analysis & Design Definition*

| Data Entity | Description | Source System | Sensitivity |
|---|---|---|---|
| [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN — e.g. PII, PCI — Cardholder Data, Confidential] |

## 13. Risk Assessment
*BABOK: Strategy Analysis*

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| [FILL IN] | [FILL IN — High/Medium/Low] | [FILL IN — High/Medium/Low] | [FILL IN] |

## 14. Requirements Traceability Matrix
*BABOK: Requirements Life Cycle Management*

*Generated automatically by the tool from Section 10's user stories — nothing to fill in here.*

## 15. Acceptance & Sign-off
*BABOK: Solution Evaluation*

| Name | Role |
|---|---|
| TBD | Business Sponsor |
| TBD | Product Owner |
| TBD | Compliance Officer |

## 16. Glossary
*BABOK: Requirements Life Cycle Management*

| Term | Definition |
|---|---|
| [FILL IN] | [FILL IN] |

*Leave this table at just the header row to fall back to the tool's default banking glossary (KYC, AML, PCI DSS, PSD2, SCA, SLA, RACI, NFR, BABOK).*

## 17. BABOK Coverage Checklist
*Appendix*

*Generated automatically — confirms all six BABOK knowledge areas and requirement-quality characteristics (atomic, complete, consistent, concise, feasible, unambiguous, testable, prioritized, traceable) are addressed.*
