#!/usr/bin/env node
'use strict';

const path = require('path');
const { buildPrd } = require('./prdContent');
const { writePrdDocx } = require('./buildPrdDocx');

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
Banking PRD Generator (BABOK-aligned)

Usage:
  node src/generatePrd.js --product "Digital Banking Platform" --feature "Instant Card Freeze & Unfreeze" --author "Jane Doe" [options]

Required:
  --product <string>         Banking product/system name
  --feature <string>         The feature/epic this PRD covers
  --author <string>          Senior BA's full name (document author)

Optional:
  --business-unit <string>   Default: "Retail Banking"
  --version <string>         Document version, default "0.1"
  --status <string>          Default "Draft"
  --priority <string>        Critical | High | Medium | Low (default "High")
  --target-release <string>  Target release / date
  --out <path>               Output .docx path (default: ./output/<Feature>_PRD.docx)
  --config <path>            JSON file with any of the above, plus rich fields not exposed as
                              flags (businessObjectives, successMetrics, stakeholders, inScope,
                              outOfScope, assumptions, constraints, dependencies, risks,
                              channelsAffected, regulatoryRequirements, businessRules, epics,
                              nonFunctionalRequirements, dataRequirements, glossary,
                              elicitationTechniques, elicitationSources, approvers).
                              CLI flags override config values. See
                              examples/banking-prd-example.json for a full example.
`;
}

async function main() {
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
    ...fromConfig,
    productName: args.product || fromConfig.productName,
    featureName: args.feature || fromConfig.featureName,
    author: args.author || fromConfig.author,
    businessUnit: args['business-unit'] || fromConfig.businessUnit,
    documentVersion: args.version || fromConfig.documentVersion,
    status: args.status || fromConfig.status,
    priority: args.priority || fromConfig.priority,
    targetRelease: args['target-release'] || fromConfig.targetRelease,
  };

  if (!options.productName || !options.featureName || !options.author) {
    console.error('Missing required arguments.\n');
    console.log(usage());
    process.exitCode = 1;
    return;
  }

  Object.keys(options).forEach((k) => options[k] === undefined && delete options[k]);

  const prd = buildPrd(options);

  const outPath =
    args.out ||
    path.join(process.cwd(), 'output', `${options.featureName.replace(/\s+/g, '_')}_PRD.docx`);

  const fs = require('fs');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  await writePrdDocx(prd, outPath);
  console.log(`Banking PRD written to: ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
