import { BrowserWindow, ipcMain } from "electron";

export function onOpenPdfPreviewWindow(mainWindow) {
  ipcMain.on("pdf-view", async (event, pdf) => {
    await openPdfPreviewWindow(pdf, mainWindow);
    event.sender.send("pdf-state-change", pdf);
  });
}

export async function openPdfPreviewWindow(pdf, mainWindow) {
  pdf.read = true;
  const child = new BrowserWindow({
    parent: mainWindow,
    frame: true,
  });
  await child.loadFile(pdf.path);
}
