
import { BrowserWindow, desktopCapturer, ipcMain, screen, app } from "electron";


ipcMain.on("screenshot", async (event) => {
  const img = await BrowserWindow.getAllWindows()[0].capturePage()
  event.sender.send("screenshot", img.toDataURL())
})

ipcMain.on("app-exe-path", async (event) => {
  event.returnValue = app.getPath("exe")
})

export default {}
