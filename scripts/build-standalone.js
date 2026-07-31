#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public');
const OUT_FILE = path.join(OUT_DIR, 'standalone.html');

const ENTRY_SOURCE = `
const { buildPlan } = require('${path.join(ROOT, 'src', 'planContent').replace(/\\/g, '\\\\')}');
const { buildDocument } = require('${path.join(ROOT, 'src', 'buildDocx').replace(/\\/g, '\\\\')}');
const { Packer } = require('docx');
window.BAOnboarding = { buildPlan, buildDocument, Packer };
`;

function main() {
  const result = esbuild.buildSync({
    stdin: {
      contents: ENTRY_SOURCE,
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

  const header = fs.readFileSync(path.join(ROOT, 'web', 'standalone-header.html'), 'utf8');
  const footer = fs.readFileSync(path.join(ROOT, 'web', 'standalone-footer.html'), 'utf8');

  const html = `${header}\n<script>\n${bundleJs}\n${footer}`;

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, html);
  console.log(`Standalone page written to: ${OUT_FILE} (${(html.length / 1024).toFixed(0)} KB)`);
}

main();
