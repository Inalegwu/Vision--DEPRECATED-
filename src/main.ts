import path from "path";
import { appRouter } from "./shared/routers/_app";
import { createContext } from "./shared/context";
import { createIPCHandler } from "electron-trpc/main";
import { initialize } from "@aptabase/electron/main";
import { BrowserWindow, app, screen } from "electron";

initialize("A-EU-0154526847");

const createWindow = () => {
  const windowSize = screen.getPrimaryDisplay().workAreaSize;

  const mainWindow = new BrowserWindow({
    frame: false,
    width: windowSize.width - 50,
    height: windowSize.height - 50,
    webPreferences: {
      sandbox: false,
      preload: path.resolve(__dirname, "preload.js"),
    },
  });

  mainWindow.hide();

  createIPCHandler({
    router: appRouter,
    windows: [mainWindow],
    createContext,
  });

  mainWindow.loadFile("dist/index.html");

  mainWindow.webContents.openDevTools({ mode: "right" });
};

app.setName("Vision");

app.whenReady().then(() => {
  createWindow();
});

app.once("window-all-closed", () => app.quit());
