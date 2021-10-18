import { ipcMain, Menu } from "electron";
import { openPdfPreviewWindow } from "./pdfService";

export function onShowPaperListContextMenu(mainWindow) {
  ipcMain.on("context-menu", (event, pdf) => {
    const template = [
      {
        label: `View`,
        click: async () => {
          await openPdfPreviewWindow(pdf, mainWindow);
          event.sender.send("pdf-state-change", pdf);
        },
      },
      {
        label: `${pdf.read ? "Mark as Unread" : "Mark as Read"}`,
        click: () => {
          pdf.read = !pdf.read;
          event.sender.send("pdf-state-change", pdf);
        },
      },
    ];
    const menu = Menu.buildFromTemplate(template);
    menu.popup();
  });
}
