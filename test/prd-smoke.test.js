'use strict';

const assert = require('assert');
const { buildPrd } = require('../src/prdContent');
const { buildPrdDocument } = require('../src/buildPrdDocx');
const { Packer } = require('docx');

async function main() {
  const prd = buildPrd({
    productName: 'Digital Banking Platform',
    featureName: 'Instant Card Freeze & Unfreeze',
    author: 'Test Analyst',
  });

  assert.strictEqual(prd.meta.productName, 'Digital Banking Platform');
  assert.strictEqual(prd.sections.length, 17);
  assert.ok(prd.sections.some((s) => s.title === 'BABOK Coverage Checklist'));
  assert.ok(prd.sections.some((s) => s.title === 'Requirements Traceability Matrix'));

  const doc = buildPrdDocument(prd);
  const buffer = await Packer.toBuffer(doc);
  assert.ok(Buffer.isBuffer(buffer) && buffer.length > 0, 'expected a non-empty docx buffer');

  assert.throws(() => buildPrd({ featureName: 'X', author: 'Y' }), /productName is required/);
  assert.throws(() => buildPrd({ productName: 'X', author: 'Y' }), /featureName is required/);
  assert.throws(() => buildPrd({ productName: 'X', featureName: 'Y' }), /author is required/);
  assert.throws(
    () => buildPrd({ productName: 'X', featureName: 'Y', author: 'Z', priority: 'Nonsense' }),
    /priority must be one of/
  );

  // Custom epics flow all the way through to the traceability matrix.
  const withEpics = buildPrd({
    productName: 'Digital Banking Platform',
    featureName: 'Custom Feature',
    author: 'Test Analyst',
    epics: [
      {
        id: 'EPIC-9',
        title: 'Custom Epic',
        description: 'A custom epic for the smoke test.',
        userStories: [
          {
            id: 'US-9.1',
            title: 'A custom story',
            narrative: { asA: 'customer', iWant: 'a thing', soThat: 'a reason' },
            priority: 'Critical',
            acceptanceCriteria: ['A plain-string acceptance criterion.', { given: 'a', when: 'b', then: 'c' }],
          },
        ],
      },
    ],
  });
  const traceability = withEpics.sections.find((s) => s.title === 'Requirements Traceability Matrix');
  assert.strictEqual(traceability.parts[0].table.rows[0][0], 'US-9.1');

  console.log('PRD smoke test passed');
}

main().catch((err) => {
  console.error('PRD smoke test failed:', err.message);
  process.exitCode = 1;
});
