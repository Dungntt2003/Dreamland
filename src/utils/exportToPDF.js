import { jsPDF } from "jspdf";

const ExportToPDF = (data) => {
  const doc = new jsPDF();

  doc.setFont("helvetica", "normal");
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
