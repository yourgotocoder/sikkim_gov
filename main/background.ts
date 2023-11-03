import path from "path";
import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { externalAllocator } from "./solution";
import { generatePdf } from "./pdfGenrator";

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});

ipcMain.on("message", async (event, arg) => {
  event.reply("message", `${arg} World!`);
});

ipcMain.on("generate-pdf", async (event, arg) => {
  const preProcessedData = externalAllocator(
    arg.district,
    arg.subject,
    arg.school,
  );
  for (let schoolData in preProcessedData) {
    const finalData = [];
    for (let subs in preProcessedData[schoolData]) {
      const temp = [subs.toUpperCase()];
      const subName = arg.subject.find((sub) => sub.code === subs);
      temp.push(subName.title.toUpperCase());
      const schoolFrom = preProcessedData[schoolData][subs].from;
      temp.push(schoolFrom.toUpperCase());
      const schoolFromData = arg.school.find((sc) => sc.name === schoolFrom);
      temp.push(schoolFromData.code.toUpperCase());
      temp.push(schoolFromData.contactno);
      //
      const schoolTo = preProcessedData[schoolData][subs].to;
      temp.push(schoolTo.toUpperCase());
      const schoolToData = arg.school.find((sc) => sc.name === schoolTo);
      temp.push(schoolToData.code.toUpperCase());
      temp.push(schoolToData.contactno.toUpperCase());
      finalData.push(temp);
    }
    generatePdf(schoolData, finalData);
  }
  event.reply("generate-pdf", `PDF's generated`);
});
