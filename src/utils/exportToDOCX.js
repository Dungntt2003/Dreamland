import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  UnderlineType,
  BorderStyle,
} from "docx";

const parseMarkdownLine = (line, lineIndex) => {
  if (!line.trim()) {
    return new Paragraph({
      children: [new TextRun("")],
      spacing: { after: 200 },
    });
  }

  if (/^### (.*)/.test(line)) {
    return new Paragraph({
      heading: HeadingLevel.HEADING_3,
      children: [
        new TextRun({
          text: RegExp.$1,
          color: "2563EB",
          size: 24,
        }),
      ],
      spacing: { before: 300, after: 200 },
      border: {
        bottom: {
          color: "E5E7EB",
          size: 1,
          style: BorderStyle.SINGLE,
        },
      },
    });
  } else if (/^## (.*)/.test(line)) {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [
        new TextRun({
          text: RegExp.$1,
          color: "1F2937",
          size: 28,
          bold: true,
        }),
      ],
      spacing: { before: 400, after: 250 },
      border: {
        bottom: {
          color: "D1D5DB",
          size: 2,
          style: BorderStyle.SINGLE,
        },
      },
    });
  } else if (/^# (.*)/.test(line)) {
    return new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [
        new TextRun({
          text: RegExp.$1,
          color: "111827",
          size: 32,
          bold: true,
        }),
      ],
      spacing: { before: 500, after: 300 },
      alignment: AlignmentType.LEFT,
    });
  }

  if (/^[-*+]\s+(.*)/.test(line)) {
    return new Paragraph({
      children: [
        new TextRun({ text: "• ", color: "6B7280", size: 20 }),
        ...parseInlineFormatting(RegExp.$1),
      ],
      indent: { left: 360 },
      spacing: { after: 120 },
    });
  }

  if (/^(\d+)\.\s+(.*)/.test(line)) {
    return new Paragraph({
      children: [
        new TextRun({ text: `${RegExp.$1}. `, color: "6B7280", bold: true }),
        ...parseInlineFormatting(RegExp.$2),
      ],
      indent: { left: 360 },
      spacing: { after: 120 },
    });
  }

  if (/^>\s+(.*)/.test(line)) {
    return new Paragraph({
      children: parseInlineFormatting(RegExp.$1),
      indent: { left: 720 },
      spacing: { after: 200 },
      border: {
        left: {
          color: "9CA3AF",
          size: 4,
          style: BorderStyle.SINGLE,
        },
      },
      shading: {
        fill: "F9FAFB",
      },
    });
  }

  if (/^```/.test(line)) {
    return new Paragraph({
      children: [new TextRun("")],
      spacing: { after: 100 },
    });
  }

  if (/^`([^`]+)`$/.test(line)) {
    return new Paragraph({
      children: [
        new TextRun({
          text: RegExp.$1,
          font: "Consolas",
          size: 18,
          color: "DC2626",
        }),
      ],
      shading: { fill: "F3F4F6" },
      spacing: { after: 150 },
    });
  }

  if (/^---+$/.test(line) || /^\*\*\*+$/.test(line)) {
    return new Paragraph({
      children: [new TextRun("")],
      border: {
        bottom: {
          color: "D1D5DB",
          size: 2,
          style: BorderStyle.SINGLE,
        },
      },
      spacing: { before: 200, after: 200 },
    });
  }

  return new Paragraph({
    children: parseInlineFormatting(line),
    spacing: { after: 150 },
    alignment: AlignmentType.JUSTIFY,
  });
};

const parseInlineFormatting = (text) => {
  const runs = [];
  let remaining = text;

  const patterns = [
    { regex: /\*\*\*(.*?)\*\*\*/g, format: { bold: true, italics: true } },
    { regex: /\*\*(.*?)\*\*/g, format: { bold: true } },
    { regex: /\*(.*?)\*/g, format: { italics: true } },
    { regex: /~~(.*?)~~/g, format: { strike: true } },
    { regex: /__(.*?)__/g, format: { underline: UnderlineType.SINGLE } },
    {
      regex: /`([^`]+)`/g,
      format: {
        font: "Consolas",
        color: "DC2626",
        shading: { fill: "F3F4F6" },
      },
    },
    {
      regex: /\[(.*?)\]\((.*?)\)/g,
      format: { color: "2563EB", underline: UnderlineType.SINGLE },
    },
  ];
  const allMatches = [];
  patterns.forEach((pattern, patternIndex) => {
    let match;
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    while ((match = regex.exec(remaining)) !== null) {
      allMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[1],
        format: pattern.format,
        patternIndex,
        fullMatch: match[0],
      });
    }
  });

  allMatches.sort((a, b) => a.start - b.start);

  let currentPos = 0;

  allMatches.forEach((match) => {
    if (match.start > currentPos) {
      const beforeText = remaining.slice(currentPos, match.start);
      if (beforeText) {
        runs.push(new TextRun(beforeText));
      }
    }

    runs.push(
      new TextRun({
        text: match.text,
        ...match.format,
      })
    );

    currentPos = match.end;
  });

  if (currentPos < remaining.length) {
    const afterText = remaining.slice(currentPos);
    if (afterText) {
      runs.push(new TextRun(afterText));
    }
  }

  if (runs.length === 0) {
    return [new TextRun(text)];
  }

  return runs;
};

const ExportToDOCX = (data, filename = "document.docx", title = "Document") => {
  const lines = data.split("\n");
  const processedLines = lines.map((line, index) =>
    parseMarkdownLine(line, index)
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: title,
                bold: true,
                size: 36,
                color: "1F2937",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
            border: {
              bottom: {
                color: "2563EB",
                size: 3,
                style: BorderStyle.SINGLE,
              },
            },
          }),
          new Paragraph({
            children: [new TextRun("")],
            spacing: { after: 400 },
          }),
          ...processedLines,
        ],
      },
    ],
  });

  Packer.toBlob(doc)
    .then((blob) => {
      saveAs(blob, filename);
    })
    .catch((error) => {
      console.error("Error exporting to DOCX:", error);
    });
};

export default ExportToDOCX;
