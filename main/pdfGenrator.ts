const fs = require("fs");
const path = require("path");
const pdf = require("pdfkit-table");

export function generatePdf(schoolCode, rows) {
  const doc = new pdf({ font: "Times-Roman", size: "A3" });
  if (!fs.existsSync(path.join(__dirname, "result"))) {
    fs.mkdirSync(path.join(__dirname, "result"));
  }
  doc.pipe(
    fs.createWriteStream(path.join(__dirname, "result", `${schoolCode}.pdf`)),
  );
  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text(
      `AISSCE PRACTICAL EXTERNALS FOR ${"SCHOOL NAME VERY LONG EXAMPLE LOREM IPSUM"}`,
      70,
      20,
      { align: "center" },
    );
  doc.moveDown();
  (function() {
    const table = {
      title: `${schoolCode}`,
      subtitle: "Prepared by:JD/Exams",
      headers: [
        "CODE",
        "SUBJECT",
        "SCHOOL(FROM)",
        "CODE",
        "MOBILE NO",
        "SCHOOL(TO)",
        "CODE",
        "MOBILE NO",
      ],
      rows: rows,
    };

    doc.table(table);
  })();
  //

  doc.end();
}
