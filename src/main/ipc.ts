
import { BrowserWindow, desktopCapturer, ipcMain, screen } from "electron";


ipcMain.on("screenshot", async (event) => {
  const img = await BrowserWindow.getAllWindows()[0].capturePage()
  event.sender.send("screenshot", img.toDataURL())
})

export default {}
