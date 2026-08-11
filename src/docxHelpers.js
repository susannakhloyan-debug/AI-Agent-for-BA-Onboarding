'use strict';

/**
 * Low-level docx (docx-js) building blocks shared by every document
 * generator in this repo (onboarding plan, banking PRD, ...). Keeps a
 * single consistent look-and-feel across generated documents.
 */

const {
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
  subtle: '6B7280',
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
    {
      reference: 'plan-bullets-sub',
      levels: [
        {
          level: 0,
          format: LevelFormat.BULLET,
          text: '◦',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 900, hanging: 270 } } },
        },
      ],
    },
  ],
};

function bulletParagraph(children, opts = {}) {
  const { level = 0 } = opts;
  return new Paragraph({
    numbering: { reference: level === 0 ? 'plan-bullets' : 'plan-bullets-sub', level: 0 },
    spacing: { after: 60 },
    children,
  });
}

function bulletList(items, opts = {}) {
  return items.map((text) => bulletParagraph([new TextRun({ text })], opts));
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

function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 90 },
    children: [new TextRun({ text, bold: true, color: COLORS.accent, size: 22 })],
  });
}

function bodyText(text, opts = {}) {
  const { italics = false } = opts;
  return new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text, italics })] });
}

function noteText(text) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, italics: true, color: COLORS.subtle, size: 20 })],
  });
}

function linkLineParagraph({ text, url }) {
  if (url) {
    return new Paragraph({
      spacing: { after: 120 },
      children: [
        new ExternalHyperlink({
          link: url,
          children: [new TextRun({ text, color: COLORS.link, underline: {} })],
        }),
      ],
    });
  }
  return new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text, italics: true })] });
}

function cell(text, opts = {}) {
  const { header = false, width, shading } = opts;
  return new TableCell({
    width: width ? { size: width, type: WidthType.DXA } : undefined,
    shading: header
      ? { type: ShadingType.CLEAR, fill: COLORS.tableHeaderBg }
      : shading
      ? { type: ShadingType.CLEAR, fill: shading }
      : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: (Array.isArray(text) ? text : [text]).map(
      (line) =>
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: line,
              bold: header,
              color: header ? COLORS.tableHeaderText : undefined,
            }),
          ],
        })
    ),
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

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function tocSection(title = 'Contents') {
  return [
    heading1(title),
    new TableOfContents(title, { hyperlink: true, headingStyleRange: '1-2' }),
    pageBreak(),
  ];
}

module.exports = {
  PAGE,
  MARGIN,
  FULL_WIDTH,
  COLORS,
  numbering,
  bulletParagraph,
  bulletList,
  linkList,
  heading1,
  heading2,
  heading3,
  bodyText,
  noteText,
  linkLineParagraph,
  cell,
  simpleTable,
  pageBreak,
  tocSection,
};
