'use strict';

const { Document, Packer, Paragraph, TextRun } = require('docx');
const {
  PAGE,
  MARGIN,
  FULL_WIDTH,
  COLORS,
  numbering,
  bulletList,
  linkList,
  heading1,
  heading2,
  bodyText,
  linkLineParagraph,
  simpleTable,
  pageBreak,
  tocSection,
} = require('./docxHelpers');

function coverAndOverview(meta) {
  const overviewRows = [
    ['Duration', `${meta.durationMonths} month${meta.durationMonths > 1 ? 's' : ''}`],
    ['Goal', meta.goal],
    ['Mentor', meta.mentor],
    ['Evaluation Frequency', meta.evaluationFrequency],
    ['Role', meta.roleLabel],
    ['Focus Area / Topic', meta.topic],
    ['Product', meta.productName],
    ['Start Date', meta.startDate],
    ['Plan Generated', meta.generatedDate],
  ];
  return [
    new Paragraph({
      spacing: { before: 400, after: 80 },
      children: [new TextRun({ text: `Onboarding Plan for ${meta.baName}`, bold: true, size: 44, color: COLORS.heading })],
    }),
    new Paragraph({ spacing: { after: 400 }, children: [new TextRun({ text: 'Overview', bold: true, size: 26, color: COLORS.accent })] }),
    simpleTable(['Field', 'Detail'], overviewRows, [2600, FULL_WIDTH - 2600]),
    pageBreak(),
  ];
}

function renderPart(part) {
  const out = [];
  if (part.heading) out.push(heading2(part.heading));
  if (part.paragraphs) part.paragraphs.forEach((p) => out.push(bodyText(p)));
  if (part.linkLine) out.push(linkLineParagraph(part.linkLine));
  if (part.bullets) out.push(...bulletList(part.bullets));
  if (part.links) out.push(...linkList(part.links));
  if (part.sqlTable) {
    const widths = [
      Math.floor(FULL_WIDTH * 0.4),
      Math.floor(FULL_WIDTH * 0.25),
      Math.floor(FULL_WIDTH * 0.175),
      Math.floor(FULL_WIDTH * 0.175),
    ];
    out.push(
      simpleTable(
        ['Question', 'Query', 'Remarks from BA', 'Remarks from Mentor'],
        part.sqlTable.map((q) => [q, '', '', '']),
        widths
      )
    );
  }
  return out;
}

function sectionsContent(sections) {
  const out = [];
  sections.forEach((section) => {
    out.push(heading1(`${section.id}. ${section.title}`));
    section.parts.forEach((part) => out.push(...renderPart(part)));
  });
  return out;
}

function buildDocument(plan) {
  const children = [
    ...coverAndOverview(plan.meta),
    ...tocSection(),
    ...sectionsContent(plan.sections),
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

async function writePlanDocx(plan, outputPath) {
  const fs = require('fs');
  const doc = buildDocument(plan);
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  return outputPath;
}

module.exports = { buildDocument, writePlanDocx };
