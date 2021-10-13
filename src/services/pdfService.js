let PDFParser = require("electron").remote.require("pdf2json");

export async function getPdfContent(path) {
  let pdfParser = new PDFParser(this, 1);
  pdfParser.loadPDF(path);

  return new Promise((resolve, reject) => {
    pdfParser.on("pdfParser_dataError", (errData) =>
      reject(errData.parserError)
    );

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      resolve(pdfData);
    });
  });
}
