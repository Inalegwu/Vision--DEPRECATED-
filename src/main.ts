import path from "path";
import { BrowserWindow, app, screen } from "electron";
import { createIPCHandler } from "electron-trpc/main";
import { appRouter } from "./shared/routers/_app";

const createWindow = () => {
  const windowSize = screen.getPrimaryDisplay().workAreaSize;

  const mainWindow = new BrowserWindow({
    frame: false,
    width: windowSize.width - 100,
    height: windowSize.height - 50,
    webPreferences: {
      preload: path.resolve(__dirname, "preload.js"),
    },
  });

  createIPCHandler({ router: appRouter, windows: [mainWindow] });

  mainWindow.loadFile("dist/index.html");
  // mainWindow.webContents.openDevTools({ mode: "detach" });
};

app.whenReady().then(() => {
  const date = new Date().toDateString();

  createWindow();
});

app.once("window-all-closed", () => app.quit());

