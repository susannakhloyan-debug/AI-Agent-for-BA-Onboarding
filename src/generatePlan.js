#!/usr/bin/env node
'use strict';

const path = require('path');
const { buildPlan } = require('./planContent');
const { writePlanDocx } = require('./buildDocx');

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
BA Onboarding Plan Generator

Usage:
  node src/generatePlan.js --name "Jane Doe" --topic "Loyalty Points Program Enhancements" [options]

Required:
  --name <string>            New BA / intern's full name
  --topic <string>           The theme/feature this BA will work on
  --mentor <string>          Mentor's full name

Optional:
  --role <new_ba|intern>     Default: new_ba
  --product <string>         Product/system name (default: "the product")
  --sub-process <string>     Feature/workflow used for the process-modeling exercise
                              (default: derived from --topic)
  --duration <number>        Duration in months (default: 3)
  --evaluation <string>      Evaluation frequency (default: "Weekly check-ins + Project assessment")
  --start-date <string>      Onboarding start date
  --prd-template-name <str>  Name of the team's PRD template (default: "Product Requirement Document_template")
  --prd-template-link <url>  Link to the PRD template, if you have one (renders as a hyperlink)
  --out <path>               Output .docx path (default: ./output/<Name>_Onboarding_Plan.docx)
  --config <path>            Load a JSON file of the above options (CLI flags override it)
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
    baName: args.name || fromConfig.baName,
    role: args.role || fromConfig.role || 'new_ba',
    topic: args.topic || fromConfig.topic,
    productName: args.product || fromConfig.productName,
    subProcessTopic: args['sub-process'] || fromConfig.subProcessTopic,
    mentor: args.mentor || fromConfig.mentor,
    durationMonths: Number(args.duration || fromConfig.durationMonths || 3),
    evaluationFrequency: args.evaluation || fromConfig.evaluationFrequency,
    startDate: args['start-date'] || fromConfig.startDate,
    prdTemplateName: args['prd-template-name'] || fromConfig.prdTemplateName,
    prdTemplateLink: args['prd-template-link'] || fromConfig.prdTemplateLink,
    sqlResources: fromConfig.sqlResources,
    sqlTasks: fromConfig.sqlTasks,
    sqlAccessNote: fromConfig.sqlAccessNote,
    sqlAccessSource: fromConfig.sqlAccessSource,
  };

  if (!options.baName || !options.topic || !options.mentor) {
    console.error('Missing required arguments.\n');
    console.log(usage());
    process.exitCode = 1;
    return;
  }

  Object.keys(options).forEach((k) => options[k] === undefined && delete options[k]);

  const plan = buildPlan(options);

  const outPath =
    args.out || path.join(process.cwd(), 'output', `${options.baName.replace(/\s+/g, '_')}_Onboarding_Plan.docx`);

  const fs = require('fs');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  await writePlanDocx(plan, outPath);
  console.log(`Onboarding plan written to: ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
