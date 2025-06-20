import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";

const parseInlineMarkdown = (text) => {
  const parts = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const index = match.index;
    if (index > lastIndex) {
      parts.push(new TextRun(text.slice(lastIndex, index)));
    }

    const matchText = match[0];
    if (matchText.startsWith("**")) {
      parts.push(new TextRun({ text: matchText.slice(2, -2), bold: true }));
    } else if (matchText.startsWith("*")) {
      parts.push(new TextRun({ text: matchText.slice(1, -1), italics: true }));
    }

    lastIndex = index + matchText.length;
  }

  if (lastIndex < text.length) {
    parts.push(new TextRun(text.slice(lastIndex)));
  }

  return parts;
};

const parseMarkdownLine = (line) => {
  const trimmed = line.trim();

  if (/^###\s+\*\*(.*)\*\*/.test(trimmed)) {
    return new Paragraph({
      heading: HeadingLevel.HEADING_3,
      children: [new TextRun({ text: RegExp.$1, bold: true })],
    });
  }
  if (/^##\s+\*\*(.*)\*\*/.test(trimmed)) {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun({ text: RegExp.$1, bold: true })],
    });
  }
  if (/^#\s+\*\*(.*)\*\*/.test(trimmed)) {
    return new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: RegExp.$1, bold: true })],
    });
  }
  if (/^###\s+(.*)/.test(trimmed)) {
    return new Paragraph({
      heading: HeadingLevel.HEADING_3,
      children: parseInlineMarkdown(RegExp.$1),
    });
  }
  if (/^##\s+(.*)/.test(trimmed)) {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: parseInlineMarkdown(RegExp.$1),
    });
  }
  if (/^#\s+(.*)/.test(trimmed)) {
    return new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: parseInlineMarkdown(RegExp.$1),
    });
  }

  if (/^\s*-\s+(.*)/.test(trimmed)) {
    return new Paragraph({
      bullet: { level: 0 },
      children: parseInlineMarkdown(RegExp.$1),
    });
  }

  if (/^\s{2,}-\s+(.*)/.test(line)) {
    return new Paragraph({
      bullet: { level: 1 },
      children: parseInlineMarkdown(RegExp.$1),
    });
  }

  return new Paragraph({
    children: parseInlineMarkdown(line),
  });
};

const ExportToDOCX = (data, filename, title) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: title,
                bold: true,
                size: 36,
              }),
            ],
          }),
          ...data.split("\n").map(parseMarkdownLine),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, filename || "events.docx");
  });
};

export default ExportToDOCX;
