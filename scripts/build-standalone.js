#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public');

function esc(p) {
  return p.replace(/\\/g, '\\\\');
}

const TARGETS = [
  {
    name: 'BA Onboarding Plan',
    outFile: path.join(OUT_DIR, 'standalone.html'),
    header: path.join(ROOT, 'web', 'standalone-header.html'),
    footer: path.join(ROOT, 'web', 'standalone-footer.html'),
    entrySource: `
const { buildPlan } = require('${esc(path.join(ROOT, 'src', 'planContent'))}');
const { buildDocument } = require('${esc(path.join(ROOT, 'src', 'buildDocx'))}');
const { Packer } = require('docx');
window.BAOnboarding = { buildPlan, buildDocument, Packer };
`,
  },
  {
    name: 'Banking PRD Generator',
    outFile: path.join(OUT_DIR, 'prd-standalone.html'),
    header: path.join(ROOT, 'web', 'prd-standalone-header.html'),
    footer: path.join(ROOT, 'web', 'prd-standalone-footer.html'),
    entrySource: `
const { buildPrd } = require('${esc(path.join(ROOT, 'src', 'prdContent'))}');
const { buildPrdDocument } = require('${esc(path.join(ROOT, 'src', 'buildPrdDocx'))}');
const { Packer } = require('docx');
window.BankingPRD = { buildPrd, buildPrdDocument, Packer };
`,
  },
];

function buildTarget(target) {
  const result = esbuild.buildSync({
    stdin: {
      contents: target.entrySource,
      resolveDir: ROOT,
      loader: 'js',
    },
    bundle: true,
    platform: 'browser',
    format: 'iife',
    minify: true,
    external: ['fs'],
    write: false,
  });

  const bundleJs = result.outputFiles[0].text;
  if (bundleJs.includes('</script')) {
    throw new Error(`bundled JS for "${target.name}" unexpectedly contains a literal </script sequence`);
  }

  const header = fs.readFileSync(target.header, 'utf8');
  const footer = fs.readFileSync(target.footer, 'utf8');

  const html = `${header}\n<script>\n${bundleJs}\n${footer}`;

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(target.outFile, html);
  console.log(`${target.name} standalone page written to: ${target.outFile} (${(html.length / 1024).toFixed(0)} KB)`);
}

function main() {
  TARGETS.forEach(buildTarget);
}

main();
