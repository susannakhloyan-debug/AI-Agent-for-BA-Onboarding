'use strict';

const fs = require('fs');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ExternalHyperlink,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  AlignmentType,
  BorderStyle,
  TableOfContents,
  PageBreak,
  LevelFormat,
} = require('docx');

// US Letter, DXA units (1440 = 1 inch)
const PAGE = { width: 12240, height: 15840 };
const MARGIN = 1440;
const FULL_WIDTH = PAGE.width - MARGIN * 2;

const COLORS = {
  heading: '1F3864',
  accent: '2E5395',
  tableHeaderBg: '2E5395',
  tableHeaderText: 'FFFFFF',
  link: '1155CC',
};

const numbering = {
  config: [
    {
      reference: 'plan-bullets',
      levels: [
        {
          level: 0,
          format: LevelFormat.BULLET,
          text: '•',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 540, hanging: 270 } } },
        },
      ],
    },
  ],
};

function bulletParagraph(children) {
  return new Paragraph({
    numbering: { reference: 'plan-bullets', level: 0 },
    spacing: { after: 60 },
    children,
  });
}

function bulletList(items) {
  return items.map((text) => bulletParagraph([new TextRun({ text })]));
}

function linkList(links) {
  return links.map((l) =>
    bulletParagraph([
      new ExternalHyperlink({
        link: l.url,
        children: [
          new TextRun({ text: l.text, color: COLORS.link, underline: {} }),
        ],
      }),
    ])
  );
}

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, bold: true, color: COLORS.heading })],
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, color: COLORS.accent })],
  });
}

function bodyText(text) {
  return new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text })] });
}

function cell(text, opts = {}) {
  const { header = false, width } = opts;
  return new TableCell({
    width: width ? { size: width, type: WidthType.DXA } : undefined,
    shading: header
      ? { type: ShadingType.CLEAR, fill: COLORS.tableHeaderBg }
      : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: header,
            color: header ? COLORS.tableHeaderText : undefined,
          }),
        ],
      }),
    ],
  });
}

function simpleTable(headerRow, rows, colWidths) {
  const widths = colWidths || headerRow.map(() => Math.floor(FULL_WIDTH / headerRow.length));
  return new Table({
    width: { size: FULL_WIDTH, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({
        tableHeader: true,
        children: headerRow.map((h, i) => cell(h, { header: true, width: widths[i] })),
      }),
      ...rows.map(
        (r) => new TableRow({ children: r.map((v, i) => cell(v, { width: widths[i] })) })
      ),
    ],
  });
}

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
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

function tocSection() {
  return [
    heading1('Contents'),
    new TableOfContents('Contents', { hyperlink: true, headingStyleRange: '1-2' }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

function renderPart(part) {
  const out = [];
  if (part.heading) out.push(heading2(part.heading));
  if (part.paragraphs) part.paragraphs.forEach((p) => out.push(bodyText(p)));
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
  const doc = buildDocument(plan);
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  return outputPath;
}

module.exports = { buildDocument, writePlanDocx };
