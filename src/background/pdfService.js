console.log("init pdfService");
const { ipcMain } = require("electron");
const PDFParser = require("pdf2json");

ipcMain.on("prefix-convert-pdf", (event, pdf) => {
  console.log("get event", pdf);
  // new PDFParser()
  //   .on("pdfParser_dataError", (errData) => {
  //     event.sender.send("prefix-pdf-converted-error", errData);
  //   })
  //   .on("pdfParser_dataReady", (pdfData) => {
  //     event.sender.send("prefix-pdf-converted", pdfData);
  //   })
  //   .loadPDF(pdf.path);
});
