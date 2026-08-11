'use strict';

/**
 * Builds the structured content for a Banking PRD, written the way a
 * Senior Business Analyst specialized in banking/fintech applications
 * would structure it — sections map onto the six BABOK v3 knowledge
 * areas (Business Analysis Planning & Monitoring, Elicitation &
 * Collaboration, Requirements Life Cycle Management, Strategy Analysis,
 * Requirements Analysis & Design Definition, Solution Evaluation) plus
 * banking-specific additions (regulatory/compliance, channels, NFRs).
 *
 * The section order and BABOK mapping are fixed; the feature/product
 * content is what changes between PRDs.
 */

const PRIORITIES = ['Critical', 'High', 'Medium', 'Low'];

const DEFAULT_REGULATORY_REQUIREMENTS = [
  {
    regulation: 'KYC / Customer Due Diligence',
    requirement: 'Customer identity, risk rating, and documentation must be verified/updated per the bank\'s KYC policy before the feature is available to a customer.',
  },
  {
    regulation: 'AML / Transaction Monitoring',
    requirement: 'Transactions and behaviors introduced by this feature must be visible to the AML monitoring/rules engine for suspicious-activity detection and SAR filing.',
  },
  {
    regulation: 'PCI DSS',
    requirement: 'Any cardholder data (PAN, CVV, expiry) touched by this feature must be handled per PCI DSS scope rules — no plaintext storage, tokenize/mask on display and in logs.',
  },
  {
    regulation: 'PSD2 / Open Banking (SCA)',
    requirement: 'Where the feature initiates a payment or accesses account data, Strong Customer Authentication (SCA) must be enforced unless a documented exemption applies.',
  },
  {
    regulation: 'Data Privacy (GDPR / local data protection law)',
    requirement: 'Personal data collected, displayed, or transmitted must have a documented lawful basis, retention period, and be covered by the bank\'s data subject rights processes.',
  },
  {
    regulation: 'Operational Risk / Basel III',
    requirement: 'Material changes to customer-facing or payment-processing functionality must go through operational risk assessment and be reflected in the risk register.',
  },
  {
    regulation: 'Internal Controls (SOX, where applicable)',
    requirement: 'Changes affecting financial reporting data or general ledger postings require documented control points and audit trail.',
  },
];

const DEFAULT_CHANNELS = ['Mobile Banking App', 'Internet/Online Banking', 'Branch / Teller System', 'Contact Center / IVR'];

const DEFAULT_ELICITATION_TECHNIQUES = [
  'Stakeholder interviews with business owner, Compliance, and Operations',
  'Requirements workshops / JAD sessions with Product, Engineering, and QA',
  'Document analysis of existing policy, procedure, and system documentation',
  'Process observation / walkthrough of the current (as-is) workflow',
  'Prototyping and wireframe review with UX and end users',
];

const DEFAULT_NFR_CATEGORIES = [
  {
    category: 'Security',
    items: [
      'All customer-initiated actions must be authenticated per the bank\'s authentication policy (MFA/SCA where applicable).',
      'Sensitive data must be encrypted in transit (TLS 1.2+) and at rest.',
      'Role-based access control (RBAC) must restrict internal access to the minimum required to perform the function.',
    ],
  },
  {
    category: 'Performance',
    items: [
      'Customer-facing screens must render within 2 seconds under normal load.',
      'Backend transaction processing must complete within the SLA agreed with the Operations team (default: 5 seconds, p95).',
    ],
  },
  {
    category: 'Availability & Reliability',
    items: [
      'The feature must meet the platform\'s standard availability target (default: 99.9% uptime, excluding planned maintenance windows).',
      'Failure of a downstream dependency must degrade gracefully with a clear customer-facing error state, not a silent failure.',
    ],
  },
  {
    category: 'Auditability & Compliance',
    items: [
      'Every state-changing action must produce an immutable audit log entry (who, what, when, before/after values).',
      'Audit logs must be retained per the bank\'s regulatory retention schedule.',
    ],
  },
  {
    category: 'Usability & Accessibility',
    items: [
      'Customer-facing screens must meet WCAG 2.1 AA accessibility standards.',
      'Error messages must be in plain language and actionable, avoiding raw system/error codes.',
    ],
  },
  {
    category: 'Scalability',
    items: [
      'The solution must support current transaction volume plus the documented growth forecast without redesign.',
    ],
  },
];

const DEFAULT_GLOSSARY = [
  { term: 'AML', definition: 'Anti-Money Laundering — regulations and controls to prevent illegally obtained funds from entering the financial system.' },
  { term: 'KYC', definition: 'Know Your Customer — the process of verifying a customer\'s identity and assessing risk.' },
  { term: 'PCI DSS', definition: 'Payment Card Industry Data Security Standard — security requirements for organizations handling card data.' },
  { term: 'PSD2', definition: 'Revised Payment Services Directive (EU) — governs payment services and Open Banking access, including SCA.' },
  { term: 'SCA', definition: 'Strong Customer Authentication — multi-factor authentication required for certain electronic payments/account access.' },
  { term: 'SLA', definition: 'Service Level Agreement — a measurable commitment on performance, availability, or turnaround time.' },
  { term: 'RACI', definition: 'Responsible, Accountable, Consulted, Informed — a stakeholder responsibility-assignment matrix.' },
  { term: 'NFR', definition: 'Non-Functional Requirement — a quality attribute of the system (security, performance, availability, etc.), as opposed to a specific behavior.' },
  { term: 'BABOK', definition: 'A Guide to the Business Analysis Body of Knowledge — the IIBA\'s standard reference for business analysis practice.' },
];

const DEFAULT_EPICS = (featureName, productName) => [
  {
    id: 'EPIC-1',
    title: featureName,
    description: `Deliver "${featureName}" within ${productName} so that the target customer/user segment can complete the underlying business need end-to-end, in compliance with applicable banking regulations.`,
    userStories: [
      {
        id: 'US-1.1',
        title: `Primary happy-path flow for ${featureName}`,
        narrative: {
          asA: 'registered customer',
          iWant: `to use ${featureName}`,
          soThat: 'I can complete the underlying task without contacting a branch or call center',
        },
        priority: 'High',
        acceptanceCriteria: [
          { given: 'the customer is authenticated and eligible for this feature', when: 'they initiate the action', then: 'the system completes it and confirms success within the agreed SLA' },
          { given: 'the action changes the customer\'s account/profile state', when: 'it completes', then: 'an audit log entry is created and, where required, a customer notification is sent' },
        ],
      },
      {
        id: 'US-1.2',
        title: `Validation and error handling for ${featureName}`,
        narrative: {
          asA: 'registered customer',
          iWant: 'clear feedback when my request cannot be completed',
          soThat: 'I understand what went wrong and what to do next',
        },
        priority: 'High',
        acceptanceCriteria: [
          { given: 'the customer submits invalid or incomplete input', when: 'they submit the request', then: 'the system blocks submission and shows a specific, actionable error message' },
          { given: 'a downstream system/dependency is unavailable', when: 'the customer attempts the action', then: 'the system shows a graceful error state and does not leave the account in a partial/inconsistent state' },
        ],
      },
      {
        id: 'US-1.3',
        title: `Internal visibility/support for ${featureName}`,
        narrative: {
          asA: 'contact center / operations agent',
          iWant: 'to view the status and history of this action for a customer',
          soThat: 'I can support and troubleshoot customer inquiries',
        },
        priority: 'Medium',
        acceptanceCriteria: [
          { given: 'an authorized internal user searches for a customer', when: 'they open the relevant record', then: 'they can see the current status and a full audit trail of the action' },
        ],
      },
    ],
  },
];

function defaultStakeholders() {
  return [
    { name: 'TBD', role: 'Business Sponsor', raci: 'A' },
    { name: 'TBD', role: 'Product Owner', raci: 'R' },
    { name: 'TBD', role: 'Senior Business Analyst (author)', raci: 'R' },
    { name: 'TBD', role: 'Engineering Lead', raci: 'C' },
    { name: 'TBD', role: 'QA Lead', raci: 'C' },
    { name: 'TBD', role: 'Compliance Officer', raci: 'C' },
    { name: 'TBD', role: 'Risk Officer', raci: 'C' },
    { name: 'TBD', role: 'Information Security', raci: 'C' },
    { name: 'TBD', role: 'Operations / Contact Center', raci: 'I' },
    { name: 'TBD', role: 'UX / Design', raci: 'I' },
  ];
}

function defaultApprovers() {
  return [
    { name: 'TBD', role: 'Business Sponsor' },
    { name: 'TBD', role: 'Product Owner' },
    { name: 'TBD', role: 'Compliance Officer' },
    { name: 'TBD', role: 'Engineering Lead' },
  ];
}

function buildPrd({
  productName,
  featureName,
  author,
  businessUnit = 'Retail Banking',
  documentVersion = '0.1',
  status = 'Draft',
  classification = 'Internal & Confidential',
  targetRelease,
  priority = 'High',
  generatedDate,
  approvers = defaultApprovers(),
  stakeholders = defaultStakeholders(),
  businessNeed,
  businessObjectives,
  successMetrics,
  currentState,
  futureState,
  inScope,
  outOfScope,
  assumptions,
  constraints,
  dependencies,
  risks,
  channelsAffected = DEFAULT_CHANNELS,
  regulatoryRequirements = DEFAULT_REGULATORY_REQUIREMENTS,
  businessRules,
  epics,
  nonFunctionalRequirements = DEFAULT_NFR_CATEGORIES,
  dataRequirements,
  glossary = DEFAULT_GLOSSARY,
  elicitationTechniques = DEFAULT_ELICITATION_TECHNIQUES,
  elicitationSources,
}) {
  if (!productName) throw new Error('productName is required');
  if (!featureName) throw new Error('featureName is required');
  if (!author) throw new Error('author is required');
  if (!PRIORITIES.includes(priority)) {
    throw new Error(`priority must be one of: ${PRIORITIES.join(', ')}`);
  }

  const resolvedEpics = epics && epics.length ? epics : DEFAULT_EPICS(featureName, productName);

  const meta = {
    productName,
    featureName,
    author,
    businessUnit,
    documentVersion,
    status,
    classification,
    targetRelease: targetRelease || 'TBD',
    priority,
    generatedDate: generatedDate || new Date().toISOString().slice(0, 10),
  };

  const businessObjectivesList =
    businessObjectives && businessObjectives.length
      ? businessObjectives
      : [
          `Enable customers to complete "${featureName}" through self-service channels, reducing branch/contact-center volume.`,
          'Reduce operational turnaround time (TAT) for the underlying request.',
          'Maintain full regulatory compliance and auditability for the new capability.',
        ];

  const successMetricsList =
    successMetrics && successMetrics.length
      ? successMetrics
      : [
          { metric: 'Self-service adoption rate', target: '≥ 70% of eligible requests completed without agent assistance', measurement: 'Channel analytics, 90 days post-launch' },
          { metric: 'Customer-reported issue rate', target: '< 2% of transactions result in a support contact', measurement: 'Contact center tagging' },
          { metric: 'Processing SLA adherence', target: '≥ 99% within agreed SLA', measurement: 'System transaction logs' },
        ];

  const inScopeList =
    inScope && inScope.length
      ? inScope
      : [`Customer-initiated "${featureName}" via the channels listed in Section 8 (Regulatory & Compliance) / channels affected.`, 'Associated notifications, audit logging, and internal support visibility.'];

  const outOfScopeList =
    outOfScope && outOfScope.length
      ? outOfScope
      : ['Changes to unrelated products or account types not explicitly listed above.', 'Any batch/offline processing not required for the primary flow (to be assessed separately).'];

  const assumptionsList =
    assumptions && assumptions.length
      ? assumptions
      : ['Existing core banking / customer identity APIs required for this feature are available and stable.', 'No changes to the bank\'s regulatory obligations are expected during the delivery window.'];

  const constraintsList =
    constraints && constraints.length
      ? constraints
      : ['Must be delivered within the current core banking platform\'s architecture and integration patterns.', 'Must comply with the bank\'s existing brand, accessibility, and security standards.'];

  const dependenciesList =
    dependencies && dependencies.length
      ? dependencies
      : ['Core banking system / account services API.', 'Identity & authentication service (SCA/MFA provider).', 'Notification service (SMS/push/email).'];

  const risksList =
    risks && risks.length
      ? risks
      : [
          { risk: 'Regulatory requirements change during development, requiring rework.', impact: 'High', likelihood: 'Low', mitigation: 'Compliance sign-off on requirements before development starts; change-log tracked in Section 14.' },
          { risk: 'Downstream system (core banking / identity) cannot support required response times.', impact: 'High', likelihood: 'Medium', mitigation: 'Early technical spike / NFR validation with Engineering before committing to release date.' },
          { risk: 'Low customer adoption of the new self-service flow.', impact: 'Medium', likelihood: 'Medium', mitigation: 'In-app education, phased rollout, and adoption metrics tracked per Section 2.' },
        ];

  const businessRulesList =
    businessRules && businessRules.length
      ? businessRules
      : [
          'The customer must be fully verified (KYC status = Verified) before this feature is accessible.',
          'The action is only available for account statuses in good standing (not blocked, frozen, or under investigation).',
          'Requests outside defined limits/thresholds must be routed for manual review rather than auto-approved.',
        ];

  const dataRequirementsList =
    dataRequirements && dataRequirements.length
      ? dataRequirements
      : [
          { entity: 'Customer Profile', description: 'Identity, KYC status, contact details used for verification and notification.', sourceSystem: 'Core Banking / CIF', sensitivity: 'PII' },
          { entity: 'Account', description: 'Account status, product type, balances relevant to eligibility checks.', sourceSystem: 'Core Banking', sensitivity: 'Confidential' },
          { entity: 'Transaction / Action Log', description: 'Record of the action performed, timestamps, and outcome for audit purposes.', sourceSystem: 'This feature / Audit service', sensitivity: 'Confidential' },
        ];

  const elicitationSourcesList =
    elicitationSources && elicitationSources.length
      ? elicitationSources
      : ['Business Sponsor / Product Owner', 'Compliance and Risk teams', 'Existing policy and procedure documentation', 'Contact center call-driver data'];

  const sections = [
    {
      id: 1,
      babok: 'Strategy Analysis',
      title: 'Purpose & Business Need',
      parts: [
        {
          paragraphs: [
            businessNeed ||
              `This document defines the business and functional requirements for "${featureName}" within ${productName}. It captures the business need, current gap, and target outcome so that the delivery team can design, build, test, and release the capability with full traceability back to the business objective and applicable banking regulations.`,
          ],
        },
      ],
    },
    {
      id: 2,
      babok: 'Strategy Analysis / Solution Evaluation',
      title: 'Business Objectives & Success Metrics',
      parts: [
        { heading: 'Business Objectives', bullets: businessObjectivesList },
        {
          heading: 'Success Metrics (KPIs)',
          table: {
            headers: ['Metric', 'Target', 'How It Will Be Measured'],
            rows: successMetricsList.map((m) => [m.metric, m.target, m.measurement]),
          },
        },
      ],
    },
    {
      id: 3,
      babok: 'Business Analysis Planning & Monitoring',
      title: 'Stakeholder Analysis (RACI)',
      parts: [
        {
          paragraphs: ['Stakeholders identified for this initiative, and their responsibility per the RACI model (Responsible, Accountable, Consulted, Informed):'],
          table: {
            headers: ['Name', 'Role', 'RACI'],
            rows: stakeholders.map((s) => [s.name, s.role, s.raci]),
          },
        },
      ],
    },
    {
      id: 4,
      babok: 'Elicitation & Collaboration',
      title: 'Elicitation Summary',
      parts: [
        { heading: 'Techniques Used', bullets: elicitationTechniques },
        { heading: 'Sources Consulted', bullets: elicitationSourcesList },
      ],
    },
    {
      id: 5,
      babok: 'Requirements Analysis & Design Definition',
      title: 'Scope',
      parts: [
        { heading: 'In Scope', bullets: inScopeList },
        { heading: 'Out of Scope', bullets: outOfScopeList },
        { heading: 'Channels Affected', bullets: channelsAffected },
      ],
    },
    {
      id: 6,
      babok: 'Strategy Analysis',
      title: 'Current State (As-Is) & Future State (To-Be)',
      parts: [
        {
          heading: 'Current State (As-Is)',
          paragraphs: [currentState || `Describe how the underlying need is currently met today (e.g. manual/branch/contact-center process) and the pain points that motivate "${featureName}".`],
        },
        {
          heading: 'Future State (To-Be)',
          paragraphs: [futureState || `Describe the target end-to-end experience once "${featureName}" is delivered, and how it resolves the pain points above.`],
        },
      ],
    },
    {
      id: 7,
      babok: 'Requirements Life Cycle Management',
      title: 'Assumptions, Constraints & Dependencies',
      parts: [
        { heading: 'Assumptions', bullets: assumptionsList },
        { heading: 'Constraints', bullets: constraintsList },
        { heading: 'Dependencies', bullets: dependenciesList },
      ],
    },
    {
      id: 8,
      babok: 'Requirements Analysis & Design Definition (Banking-Specific)',
      title: 'Regulatory & Compliance Requirements',
      parts: [
        {
          paragraphs: ['Applicable regulatory frameworks and the corresponding requirement this feature must satisfy. Confirm final scope with Compliance before development.'],
          table: {
            headers: ['Regulation / Framework', 'Requirement'],
            rows: regulatoryRequirements.map((r) => [r.regulation, r.requirement]),
            widthsPct: [0.32, 0.68],
          },
        },
      ],
    },
    {
      id: 9,
      babok: 'Requirements Analysis & Design Definition',
      title: 'Business Rules',
      parts: [{ bullets: businessRulesList }],
    },
    {
      id: 10,
      babok: 'Requirements Analysis & Design Definition',
      title: 'Functional Requirements — Epics, User Stories & Acceptance Criteria',
      parts: [{ epics: resolvedEpics }],
    },
    {
      id: 11,
      babok: 'Requirements Analysis & Design Definition',
      title: 'Non-Functional Requirements',
      parts: nonFunctionalRequirements.map((c) => ({ heading: c.category, bullets: c.items })),
    },
    {
      id: 12,
      babok: 'Requirements Analysis & Design Definition',
      title: 'Data Requirements',
      parts: [
        {
          table: {
            headers: ['Data Entity', 'Description', 'Source System', 'Sensitivity'],
            rows: dataRequirementsList.map((d) => [d.entity, d.description, d.sourceSystem, d.sensitivity]),
          },
        },
      ],
    },
    {
      id: 13,
      babok: 'Strategy Analysis',
      title: 'Risk Assessment',
      parts: [
        {
          table: {
            headers: ['Risk', 'Impact', 'Likelihood', 'Mitigation'],
            rows: risksList.map((r) => [r.risk, r.impact, r.likelihood, r.mitigation]),
            widthsPct: [0.32, 0.12, 0.14, 0.42],
          },
        },
      ],
    },
    {
      id: 14,
      babok: 'Requirements Life Cycle Management',
      title: 'Requirements Traceability Matrix',
      parts: [
        {
          paragraphs: ['Each requirement is traced back to a business objective (Section 2) and forward to its acceptance criteria (Section 10), so that scope changes and test coverage can be assessed at a glance.'],
          table: {
            headers: ['Req. ID', 'Requirement', 'Epic', 'Priority', 'Linked Business Objective'],
            rows: resolvedEpics.flatMap((epic) =>
              epic.userStories.map((us) => [
                us.id,
                us.title,
                `${epic.id} — ${epic.title}`,
                us.priority || 'Medium',
                businessObjectivesList[0] || 'General',
              ])
            ),
            widthsPct: [0.1, 0.34, 0.24, 0.1, 0.22],
          },
        },
      ],
    },
    {
      id: 15,
      babok: 'Solution Evaluation',
      title: 'Acceptance & Sign-off',
      parts: [
        {
          paragraphs: ['This document is considered approved once all listed approvers have signed off. Any change after approval must go through the change-control process and be reflected in the traceability matrix (Section 14).'],
          table: {
            headers: ['Name', 'Role', 'Approval (Y/N)', 'Date'],
            rows: approvers.map((a) => [a.name, a.role, '', '']),
          },
        },
      ],
    },
    {
      id: 16,
      babok: 'Requirements Life Cycle Management',
      title: 'Glossary',
      parts: [
        {
          table: {
            headers: ['Term', 'Definition'],
            rows: glossary.map((g) => [g.term, g.definition]),
            widthsPct: [0.22, 0.78],
          },
        },
      ],
    },
    {
      id: 17,
      babok: 'Appendix',
      title: 'BABOK Coverage Checklist',
      parts: [
        {
          paragraphs: ['This PRD is structured to address every BABOK v3 knowledge area. This checklist confirms coverage and points to the relevant section for traceability during review.'],
          table: {
            headers: ['BABOK Knowledge Area', 'Addressed In', 'Covered'],
            rows: [
              ['Business Analysis Planning & Monitoring', 'Section 3 — Stakeholder Analysis (RACI)', 'Yes'],
              ['Elicitation & Collaboration', 'Section 4 — Elicitation Summary', 'Yes'],
              ['Requirements Life Cycle Management', 'Sections 7, 14, 16 — Assumptions/Dependencies, Traceability Matrix, Glossary', 'Yes'],
              ['Strategy Analysis', 'Sections 1, 2, 6, 13 — Business Need, Objectives, Current/Future State, Risk', 'Yes'],
              ['Requirements Analysis & Design Definition', 'Sections 5, 8, 9, 10, 11, 12 — Scope, Compliance, Business Rules, Functional/Non-Functional/Data Requirements', 'Yes'],
              ['Solution Evaluation', 'Sections 2, 15 — Success Metrics, Acceptance & Sign-off', 'Yes'],
            ],
            widthsPct: [0.34, 0.52, 0.14],
          },
        },
        {
          heading: 'Requirements Quality Checklist (per BABOK requirement characteristics)',
          bullets: [
            'Atomic — each user story/acceptance criterion describes a single testable behavior.',
            'Complete — every user story has both a narrative and acceptance criteria.',
            'Consistent — terminology matches the Glossary (Section 16); no contradicting business rules.',
            'Concise — requirements avoid design/implementation detail unless it is a genuine constraint.',
            'Feasible — validated against known technical dependencies (Section 7).',
            'Unambiguous — acceptance criteria use Given/When/Then to remove interpretation gaps.',
            'Testable — every acceptance criterion is written so QA can derive a pass/fail test case.',
            'Prioritized — every requirement carries a priority (Section 10, Section 14).',
            'Traceable — every requirement links to a business objective and an epic (Section 14).',
          ],
        },
      ],
    },
  ];

  return { meta, sections };
}

module.exports = {
  buildPrd,
  PRIORITIES,
  DEFAULT_REGULATORY_REQUIREMENTS,
  DEFAULT_CHANNELS,
  DEFAULT_ELICITATION_TECHNIQUES,
  DEFAULT_NFR_CATEGORIES,
  DEFAULT_GLOSSARY,
};
