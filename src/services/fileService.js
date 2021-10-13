const { dialog, app } = require("electron").remote;

export async function selectPdfFiles() {
  return dialog.showOpenDialog({
    title: "Please select a PDF file",
    buttonLabel: "Select",
    defaultPath: app.getPath("downloads"),
    filters: [{ name: "pdf", extensions: ["pdf"] }],
  });
}
