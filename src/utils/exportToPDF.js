import { jsPDF } from "jspdf";
import Roboto from "assets/font/Roboto-Black.ttf";

const ExportToPDF = (data) => {
  const doc = new jsPDF();

  doc.addFileToVFS("Roboto-Black.ttf", Roboto);

  doc.addFont("Roboto-Black.ttf", "roboto", "normal");

  doc.setFont("roboto", "normal");

  doc.setFontSize(16);
  doc.text("Danh sách sự kiện", 10, 10);

  doc.setFontSize(12);

  const lines = data.split("\n");
  let y = 20;

  lines.forEach((line) => {
    if (y > 280) {
      doc.addPage();
      y = 10;
    }
    doc.text(line, 10, y);
    y += 10;
  });

  doc.save("schedules.pdf");
};

export default ExportToPDF;
