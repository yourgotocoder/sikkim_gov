const fs = require("fs");
const path = require("path");
const pdf = require("pdfkit-table");
const os = require("os");

export function generatePdf(schoolCode, rows) {
  const homeDir = os.homedir();
  const desktopPath = path.join(homeDir, "Desktop");
  const doc = new pdf({ font: "Times-Roman", size: "A3" });
  if (!fs.existsSync(path.join(desktopPath, "result"))) {
    fs.mkdirSync(path.join(desktopPath, "result"));
  }
  doc.pipe(
    fs.createWriteStream(path.join(desktopPath, "result", `${schoolCode}.pdf`)),
  );
  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text(
      `AISSCE PRACTICAL EXTERNALS FOR ${schoolCode.toUpperCase()}`,
      70,
      20,
      { align: "center" },
    );
  doc.moveDown();
  (function() {
    const table = {
      title: `${schoolCode}`,
      subtitle: "",
      headers: [
        "CODE",
        "SUBJECT",
        "SCHOOL(FROM)",
        "SCHOOL CODE(FROM)",
        "MOBILE NO",
        "SCHOOL(TO)",
        "SCHOOL CODE(FROM)",
        "MOBILE NO",
      ],
      rows: rows,
    };

    doc.table(table);
  })();
  //

  doc.end();
}
