'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { buildUserStory } = require('../src/userStoryContent');
const { renderUserStoryMarkdown, appendUserStoryToFile } = require('../src/buildUserStoryMarkdown');

function main() {
  const story = buildUserStory({
    feature: 'block a lost or stolen debit card',
    role: 'cardholder with an active debit card',
    goal: 'unauthorized transactions are stopped immediately',
  });

  assert.strictEqual(story.title, 'Block a lost or stolen debit card');
  assert.strictEqual(
    story.userStoryStatement,
    'As a cardholder with an active debit card, I want to block a lost or stolen debit card, so that unauthorized transactions are stopped immediately.'
  );
  assert.ok(story.acceptanceCriteria.security, 'security ACs included by default');
  assert.ok(story.acceptanceCriteria.notifications, 'notification ACs included by default');
  assert.ok(story.acceptanceCriteria.localization, 'localization ACs included by default');

  assert.throws(() => buildUserStory({ role: 'x', goal: 'y' }), /feature is required/);

  const noSecurityStory = buildUserStory({
    feature: 'view account balance',
    role: 'account holder',
    goal: 'they can check their funds',
    security: false,
    notifications: false,
    localization: false,
  });
  assert.strictEqual(noSecurityStory.acceptanceCriteria.security, undefined);
  assert.strictEqual(noSecurityStory.acceptanceCriteria.notifications, undefined);
  assert.strictEqual(noSecurityStory.acceptanceCriteria.localization, undefined);

  const markdown = renderUserStoryMarkdown(story);
  assert.ok(markdown.startsWith('## Block a lost or stolen debit card'));
  assert.ok(markdown.includes('### Acceptance Criteria'));
  assert.ok(markdown.includes('Scenario:'));

  const tmpFile = path.join(os.tmpdir(), `UserStory.${Date.now()}.md`);
  const first = appendUserStoryToFile(story, tmpFile);
  assert.strictEqual(first.created, true);
  let contents = fs.readFileSync(tmpFile, 'utf8');
  assert.ok(contents.startsWith('# User Stories\n\n'));

  const second = appendUserStoryToFile(noSecurityStory, tmpFile);
  assert.strictEqual(second.created, false);
  contents = fs.readFileSync(tmpFile, 'utf8');
  assert.ok(contents.includes('\n\n---\n\n'));
  assert.ok(contents.includes('## View account balance'));

  fs.unlinkSync(tmpFile);

  console.log('user story test passed');
}

main();
