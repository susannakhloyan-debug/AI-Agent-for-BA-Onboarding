'use strict';

const fs = require('fs');

const AC_SECTION_TITLES = {
  happyPath: 'Happy Path',
  alternativePaths: 'Alternative Paths',
  edgeCases: 'Edge Cases',
  validation: 'Validation & Error States',
  security: 'Security & Compliance',
  notifications: 'Notifications',
  localization: 'Localization',
};

function renderScenario(scenario) {
  return [
    '```gherkin',
    `Scenario: ${scenario.name}`,
    `  Given ${scenario.given}`,
    `  When ${scenario.when}`,
    `  Then ${scenario.then}`,
    '```',
  ].join('\n');
}

function renderAcceptanceCriteria(acceptanceCriteria) {
  const parts = ['### Acceptance Criteria'];
  Object.keys(AC_SECTION_TITLES).forEach((key) => {
    const scenarios = acceptanceCriteria[key];
    if (!scenarios || !scenarios.length) return;
    parts.push(`#### ${AC_SECTION_TITLES[key]}`);
    parts.push(scenarios.map(renderScenario).join('\n\n'));
  });
  return parts.join('\n\n');
}

function renderList(items) {
  return items.map((item) => `- ${item}`).join('\n');
}

function renderUserStoryMarkdown(story) {
  const parts = [
    `## ${story.title}`,
    `**User Story:** ${story.userStoryStatement}`,
    ['### Context / Background', story.context.join(' ')].join('\n\n'),
    ['### Preconditions', renderList(story.preconditions)].join('\n\n'),
    ['### Main Flow (Happy Path)', story.mainFlow.map((step, i) => `${i + 1}. ${step}`).join('\n')].join('\n\n'),
    renderAcceptanceCriteria(story.acceptanceCriteria),
  ];

  if (story.nonFunctional && story.nonFunctional.length) {
    parts.push(['### Non-Functional Requirements', renderList(story.nonFunctional)].join('\n\n'));
  }

  parts.push(['### Out of Scope', renderList(story.outOfScope)].join('\n\n'));
  parts.push(['### Open Questions', renderList(story.openQuestions)].join('\n\n'));

  return parts.join('\n\n');
}

function appendUserStoryToFile(story, filePath) {
  const storyMarkdown = renderUserStoryMarkdown(story);
  const exists = fs.existsSync(filePath);

  if (!exists) {
    fs.writeFileSync(filePath, `# User Stories\n\n${storyMarkdown}\n`);
    return { created: true };
  }

  const existing = fs.readFileSync(filePath, 'utf8').replace(/\s+$/, '');
  fs.writeFileSync(filePath, `${existing}\n\n---\n\n${storyMarkdown}\n`);
  return { created: false };
}

module.exports = { renderUserStoryMarkdown, appendUserStoryToFile };
