'use strict';

/**
 * Builds the structured content for a banking user story, following the
 * Senior BA (digital banking) prompt: Title, User Story, Context,
 * Preconditions, Main Flow, Gherkin Acceptance Criteria, NFRs, Out of
 * Scope, and Open Questions. Business rules (limits, fees, thresholds)
 * are never invented — anything not supplied is marked [TBD] or raised
 * as an open question.
 */

function splitList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value)
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function capitalize(text) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function buildUserStory({
  feature,
  role,
  goal,
  title,
  trigger,
  constraints,
  designStatus,
  apis,
  preconditions,
  mainFlow,
  outOfScope,
  openQuestions,
  security = true,
  notifications = true,
  localization = true,
  generatedDate,
}) {
  if (!feature) throw new Error('feature is required');
  if (!role) throw new Error('role is required');
  if (!goal) throw new Error('goal is required');

  const constraintsList = splitList(constraints);
  const apisList = splitList(apis);
  const preconditionsList = splitList(preconditions);
  const mainFlowList = splitList(mainFlow);
  const outOfScopeList = splitList(outOfScope);
  const openQuestionsList = splitList(openQuestions);

  const storyTitle = title || capitalize(feature);
  const userStoryStatement = `As a ${role}, I want to ${feature}, so that ${goal}.`;

  const context = [
    `This story covers ${feature} for ${role}.${trigger ? ` It is triggered from ${trigger}.` : ''}`,
    designStatus ? `Design status: ${designStatus}.` : `Design status: [TBD].`,
  ];
  if (constraintsList.length) {
    context.push(`Known constraints: ${constraintsList.join('; ')}.`);
  }
  if (apisList.length) {
    context.push(`Related APIs: ${apisList.join(', ')}.`);
  }

  const finalPreconditions = preconditionsList.length
    ? preconditionsList
    : [
        'The user is authenticated and has an active session.',
        'The user\'s identity/KYC status meets the level required for this action [TBD].',
        'The account/card/product involved is in a state that allows this action (e.g., active, not already blocked/closed) [TBD].',
      ];

  const finalMainFlow = mainFlowList.length
    ? mainFlowList
    : [
        `The user navigates to the entry point for "${feature}"${trigger ? ` (${trigger})` : ''}.`,
        'The system displays the relevant information and available action(s).',
        `The user confirms they want to ${feature}.`,
        'The system validates the request and required business rules [TBD].',
        'The system processes the request and updates the relevant state.',
        'The system confirms the outcome to the user.',
      ];

  const acceptanceCriteria = {
    happyPath: [
      {
        name: `Successfully ${feature}`,
        given: `${capitalize(role)} is authenticated and all preconditions are met`,
        when: `they complete the main flow to ${feature}`,
        then: `the system completes the request successfully and confirms it to the user`,
      },
    ],
    alternativePaths: [
      {
        name: 'User has multiple eligible accounts/cards',
        given: `${capitalize(role)} has more than one eligible account or card`,
        when: `they start the flow to ${feature}`,
        then: 'the system lets them select which one the action applies to before proceeding',
      },
      {
        name: 'User has partial or incomplete data',
        given: 'some non-required information is missing',
        when: `${role} proceeds with ${feature}`,
        then: 'the system completes the action using available data and does not block on optional fields [TBD: confirm which fields are optional]',
      },
    ],
    edgeCases: [
      {
        name: 'Request times out',
        given: `${capitalize(role)} has submitted the request to ${feature}`,
        when: 'the backend does not respond within the expected timeout',
        then: 'the system shows a clear timeout error and does not apply a partial/duplicate change',
      },
      {
        name: 'Network failure mid-flow',
        given: `${capitalize(role)} is mid-flow for ${feature}`,
        when: 'the device loses network connectivity',
        then: 'the system preserves entered data where possible and allows the user to retry once connectivity is restored',
      },
      {
        name: 'Zero balance / expired card or account',
        given: 'the account has a zero balance or the card/account has expired',
        when: `${role} attempts to ${feature}`,
        then: 'the system blocks the action and explains why, with a next-step suggestion [TBD: exact copy/business rule]',
      },
    ],
    validation: [
      {
        name: 'Field-level validation error',
        given: `${capitalize(role)} is completing the flow to ${feature}`,
        when: 'they submit required information in an invalid format',
        then: 'the system shows an inline, field-level error and does not submit the request',
      },
      {
        name: 'System-level error on submit',
        given: `${capitalize(role)} submits a valid request to ${feature}`,
        when: 'the backend returns an unexpected error',
        then: 'the system shows a generic error state, logs the failure, and allows the user to retry',
      },
    ],
  };

  if (security) {
    acceptanceCriteria.security = [
      {
        name: 'Step-up authentication required',
        given: `${capitalize(role)} attempts to ${feature}`,
        when: 'the action is classified as sensitive per the bank\'s step-up policy [TBD]',
        then: 'the system requires an additional authentication step before completing the action',
      },
      {
        name: 'Session timeout during the flow',
        given: `${capitalize(role)} is mid-flow for ${feature}`,
        when: 'the session expires due to inactivity',
        then: 'the system ends the session, discards unsaved changes, and requires re-authentication',
      },
    ];
  }

  if (notifications) {
    acceptanceCriteria.notifications = [
      {
        name: 'Confirmation notification sent',
        given: `${feature} completes successfully`,
        when: 'the system finishes processing the request',
        then: 'the user receives a push/SMS/email confirmation per their notification preferences [TBD: which channels]',
      },
    ];
  }

  if (localization) {
    acceptanceCriteria.localization = [
      {
        name: 'Content is localized',
        given: `${capitalize(role)} has the app language set to Armenian or English`,
        when: `they go through the flow to ${feature}`,
        then: 'all UI text, error messages, and notifications appear in the selected language',
      },
    ];
  }

  const nonFunctional = [];
  if (security) {
    nonFunctional.push('All actions related to this story are captured in the audit log (who, what, when).');
  }
  if (apisList.length) {
    nonFunctional.push(`Response time for ${apisList.join(', ')} should meet the team's standard SLA [TBD].`);
  }
  nonFunctional.push('The flow is accessible per the team\'s accessibility standard [TBD].');

  const finalOutOfScope = outOfScopeList.length
    ? outOfScopeList
    : [`Business rules, limits, fees, or thresholds related to ${feature} are not defined here — see Open Questions.`];

  const finalOpenQuestions = [...openQuestionsList];
  if (!constraintsList.length) {
    finalOpenQuestions.push('Are there regulatory (PSD2/PCI) or internal policy constraints that apply to this flow?');
  }
  if (!preconditionsList.length) {
    finalOpenQuestions.push('What exact KYC/account/card state is required before this action is allowed?');
  }
  if (!designStatus) {
    finalOpenQuestions.push('Is a confirmed design (Figma) available for this flow, or should UI be treated as flexible?');
  }
  if (!finalOpenQuestions.length) {
    finalOpenQuestions.push('None at this time.');
  }

  return {
    title: storyTitle,
    userStoryStatement,
    context,
    preconditions: finalPreconditions,
    mainFlow: finalMainFlow,
    acceptanceCriteria,
    nonFunctional,
    outOfScope: finalOutOfScope,
    openQuestions: finalOpenQuestions,
    meta: {
      feature,
      role,
      goal,
      trigger,
      constraints: constraintsList,
      designStatus,
      apis: apisList,
      generatedDate: generatedDate || new Date().toISOString().slice(0, 10),
    },
  };
}

module.exports = { buildUserStory };
