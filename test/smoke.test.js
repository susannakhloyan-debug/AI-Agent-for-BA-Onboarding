'use strict';

const assert = require('assert');
const { buildPlan } = require('../src/planContent');
const { buildDocument } = require('../src/buildDocx');
const { Packer } = require('docx');

async function main() {
  const plan = buildPlan({
    baName: 'Test Analyst',
    role: 'intern',
    topic: 'Test Topic',
    mentor: 'Test Mentor',
    productName: 'Test Product',
  });

  assert.strictEqual(plan.meta.baName, 'Test Analyst');
  assert.strictEqual(plan.sections.length, 9);

  const doc = buildDocument(plan);
  const buffer = await Packer.toBuffer(doc);
  assert.ok(Buffer.isBuffer(buffer) && buffer.length > 0, 'expected a non-empty docx buffer');

  assert.throws(() => buildPlan({ role: 'intern', topic: 'X', mentor: 'Y' }), /baName is required/);
  assert.throws(
    () => buildPlan({ baName: 'X', topic: 'Y', mentor: 'Z', role: 'bogus' }),
    /role must be one of/
  );

  console.log('smoke test passed');
}

main().catch((err) => {
  console.error('smoke test failed:', err.message);
  process.exitCode = 1;
});
