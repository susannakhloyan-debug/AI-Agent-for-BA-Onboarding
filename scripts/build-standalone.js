#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public');

const PAGES = [
  {
    outFile: 'standalone.html',
    header: 'standalone-header.html',
    footer: 'standalone-footer.html',
    entrySource: `
const { buildPlan } = require('${path.join(ROOT, 'src', 'planContent').replace(/\\/g, '\\\\')}');
const { buildDocument } = require('${path.join(ROOT, 'src', 'buildDocx').replace(/\\/g, '\\\\')}');
const { Packer } = require('docx');
window.BAOnboarding = { buildPlan, buildDocument, Packer };
`,
  },
  {
    outFile: 'user-story-standalone.html',
    header: 'user-story-standalone-header.html',
    footer: 'user-story-standalone-footer.html',
    entrySource: `
const { buildUserStory } = require('${path.join(ROOT, 'src', 'userStoryContent').replace(/\\/g, '\\\\')}');
const { renderUserStoryMarkdown } = require('${path.join(ROOT, 'src', 'buildUserStoryMarkdown').replace(/\\/g, '\\\\')}');
window.BankingUserStory = { buildUserStory, renderUserStoryMarkdown };
`,
  },
];

function buildPage({ outFile, header, footer, entrySource }) {
  const result = esbuild.buildSync({
    stdin: {
      contents: entrySource,
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
    throw new Error('bundled JS unexpectedly contains a literal </script sequence');
  }

  const headerHtml = fs.readFileSync(path.join(ROOT, 'web', header), 'utf8');
  const footerHtml = fs.readFileSync(path.join(ROOT, 'web', footer), 'utf8');

  const html = `${headerHtml}\n<script>\n${bundleJs}\n${footerHtml}`;

  const outPath = path.join(OUT_DIR, outFile);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(outPath, html);
  console.log(`Standalone page written to: ${outPath} (${(html.length / 1024).toFixed(0)} KB)`);
}

function main() {
  PAGES.forEach(buildPage);
}

main();
