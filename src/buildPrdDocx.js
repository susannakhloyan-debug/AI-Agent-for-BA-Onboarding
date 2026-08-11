'use strict';

const { Document, Packer, Paragraph, TextRun } = require('docx');
const {
  PAGE,
  MARGIN,
  FULL_WIDTH,
  COLORS,
  numbering,
  bulletList,
  bulletParagraph,
  heading1,
  heading2,
  heading3,
  bodyText,
  noteText,
  simpleTable,
  pageBreak,
  tocSection,
} = require('./docxHelpers');

function coverPage(meta) {
  const detailRows = [
    ['Product / System', meta.productName],
    ['Business Unit', meta.businessUnit],
    ['Author (Senior BA)', meta.author],
    ['Document Version', meta.documentVersion],
    ['Status', meta.status],
    ['Classification', meta.classification],
    ['Priority', meta.priority],
    ['Target Release', meta.targetRelease],
    ['Document Generated', meta.generatedDate],
  ];
  return [
    new Paragraph({
      spacing: { before: 500, after: 40 },
      children: [new TextRun({ text: 'PRODUCT REQUIREMENTS DOCUMENT', bold: true, size: 20, color: COLORS.accent })],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [new TextRun({ text: meta.featureName, bold: true, size: 44, color: COLORS.heading })],
    }),
    new Paragraph({
      spacing: { after: 320 },
      children: [new TextRun({ text: `${meta.productName} — Banking Application PRD`, italics: true, size: 22, color: COLORS.subtle })],
    }),
    simpleTable(['Field', 'Detail'], detailRows, [2600, FULL_WIDTH - 2600]),
    new Paragraph({ spacing: { before: 240 }, children: [] }),
    noteText('Structured per BABOK v3 (A Guide to the Business Analysis Body of Knowledge) knowledge areas, adapted for banking/fintech application delivery. See Section 17 for the full BABOK coverage checklist.'),
    pageBreak(),
  ];
}

function documentControl(meta) {
  return [
    heading1('Document Control'),
    heading2('Revision History'),
    simpleTable(
      ['Version', 'Date', 'Author', 'Description'],
      [[meta.documentVersion, meta.generatedDate, meta.author, 'Initial draft generated.']]
    ),
    pageBreak(),
  ];
}

function tableFromSpec(spec) {
  const { headers, rows, widthsPct } = spec;
  const widths = widthsPct
    ? widthsPct.map((p) => Math.floor(FULL_WIDTH * p))
    : undefined;
  return simpleTable(headers, rows, widths);
}

function narrativeLine(narrative) {
  return `As a ${narrative.asA}, I want ${narrative.iWant}, so that ${narrative.soThat}.`;
}

function acceptanceCriterionText(ac) {
  if (typeof ac === 'string') return ac;
  return `Given ${ac.given}, when ${ac.when}, then ${ac.then}.`;
}

function renderEpics(epics) {
  const out = [];
  epics.forEach((epic) => {
    out.push(heading2(`${epic.id} — ${epic.title}`));
    out.push(bodyText(epic.description));
    epic.userStories.forEach((us) => {
      out.push(heading3(`${us.id} — ${us.title}${us.priority ? ` (Priority: ${us.priority})` : ''}`));
      out.push(
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: narrativeLine(us.narrative), italics: true })],
        })
      );
      out.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [new TextRun({ text: 'Acceptance Criteria:', bold: true, size: 20 })],
        })
      );
      us.acceptanceCriteria.forEach((ac) => {
        out.push(bulletParagraph([new TextRun({ text: acceptanceCriterionText(ac) })]));
      });
    });
  });
  return out;
}

function renderPart(part) {
  const out = [];
  if (part.heading) out.push(heading2(part.heading));
  if (part.paragraphs) part.paragraphs.forEach((p) => out.push(bodyText(p)));
  if (part.bullets) out.push(...bulletList(part.bullets));
  if (part.table) out.push(tableFromSpec(part.table));
  if (part.epics) out.push(...renderEpics(part.epics));
  return out;
}

function sectionsContent(sections) {
  const out = [];
  sections.forEach((section) => {
    out.push(heading1(`${section.id}. ${section.title}`));
    out.push(noteText(`BABOK area: ${section.babok}`));
    section.parts.forEach((part) => out.push(...renderPart(part)));
  });
  return out;
}

function buildPrdDocument(prd) {
  const children = [
    ...coverPage(prd.meta),
    ...documentControl(prd.meta),
    ...tocSection(),
    ...sectionsContent(prd.sections),
  ];

  return new Document({
    numbering,
    styles: {
      default: {
        document: { run: { font: 'Calibri', size: 22 } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: PAGE,
            margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
          },
        },
        children,
      },
    ],
  });
}

async function writePrdDocx(prd, outputPath) {
  const fs = require('fs');
  const doc = buildPrdDocument(prd);
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  return outputPath;
}

module.exports = { buildPrdDocument, writePrdDocx };
