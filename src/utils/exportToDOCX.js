import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

const ExportToDOCX = (data) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Danh sách sự kiện",
                bold: true,
                size: 32,
              }),
            ],
          }),

          ...data.split("\n").map(
            (line) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    size: 24,
                  }),
                ],
              })
          ),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, "schedules.docx");
  });
};

export default ExportToDOCX;
