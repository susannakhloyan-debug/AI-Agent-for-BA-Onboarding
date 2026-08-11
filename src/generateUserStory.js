#!/usr/bin/env node
'use strict';

const path = require('path');
const { buildUserStory } = require('./userStoryContent');
const { appendUserStoryToFile } = require('./buildUserStoryMarkdown');

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      args[key] = true;
    } else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function usage() {
  return `
Banking User Story Generator

Usage:
  node src/generateUserStory.js --feature "block a lost or stolen debit card" \\
    --role "cardholder with an active debit card" \\
    --goal "unauthorized transactions are stopped immediately" [options]

Required:
  --feature <string>          The action/feature this story is about
  --role <string>              Specific user role/persona
  --goal <string>               The business/user value ("so that ...")

Optional:
  --title <string>              Story title (default: derived from --feature)
  --trigger <string>             Where in the app this flow starts
  --constraints <list>            Comma-separated known constraints (regulatory/technical)
  --design-status <string>        e.g. "confirmed Figma", "not yet designed", "reference only"
  --apis <list>                    Comma-separated related API endpoint names
  --preconditions <list>           Comma-separated preconditions (default: generic banking preconditions)
  --main-flow <list>               Comma-separated ordered steps (default: generic happy-path steps)
  --out-of-scope <list>            Comma-separated out-of-scope items
  --open-questions <list>          Comma-separated open questions
  --no-security                    Omit the Security & Compliance acceptance criteria
  --no-notifications               Omit the Notifications acceptance criteria
  --no-localization                Omit the Localization acceptance criteria
  --out <path>                     Output Markdown file (default: ./UserStory.md, appended if it exists)
  --config <path>                  Load a JSON file of the above options (CLI flags override it)
`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || args.h) {
    console.log(usage());
    return;
  }

  let fromConfig = {};
  if (args.config) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    fromConfig = require(path.resolve(process.cwd(), args.config));
  }

  const options = {
    feature: args.feature || fromConfig.feature,
    role: args.role || fromConfig.role,
    goal: args.goal || fromConfig.goal,
    title: args.title || fromConfig.title,
    trigger: args.trigger || fromConfig.trigger,
    constraints: args.constraints || fromConfig.constraints,
    designStatus: args['design-status'] || fromConfig.designStatus,
    apis: args.apis || fromConfig.apis,
    preconditions: args.preconditions || fromConfig.preconditions,
    mainFlow: args['main-flow'] || fromConfig.mainFlow,
    outOfScope: args['out-of-scope'] || fromConfig.outOfScope,
    openQuestions: args['open-questions'] || fromConfig.openQuestions,
    security: args['no-security'] ? false : fromConfig.security !== false,
    notifications: args['no-notifications'] ? false : fromConfig.notifications !== false,
    localization: args['no-localization'] ? false : fromConfig.localization !== false,
  };

  if (!options.feature || !options.role || !options.goal) {
    console.error('Missing required arguments.\n');
    console.log(usage());
    process.exitCode = 1;
    return;
  }

  const story = buildUserStory(options);
  const outPath = args.out || path.join(process.cwd(), 'UserStory.md');

  const { created } = appendUserStoryToFile(story, outPath);
  console.log(`${created ? 'Created' : 'Updated'} ${outPath} with story: "${story.title}"`);
}

main();
