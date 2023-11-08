import { BrowserWindow } from "electron";
import { publicProcedure, router } from "../../trpc";

export const windowRouter = router({
  closeWindow: publicProcedure.mutation(() => {
    const browserWindow = BrowserWindow.getFocusedWindow();

    if (!browserWindow) return;

    browserWindow.close();
  }),
  maximizeWindow: publicProcedure.mutation(() => {
    const browserWindow = BrowserWindow.getFocusedWindow();

    if (!browserWindow) return;

    const isMaximized = browserWindow.isMaximized();

    if (isMaximized) {
      browserWindow.unmaximize();
      return {
        fullscreen_status: false,
      };
    } else {
      browserWindow.maximize();
      return {
        fullscreen_status: true,
      };
    }
  }),
  minimizeWindow: publicProcedure.mutation(({ ctx }) => {
    const browserWindow = BrowserWindow.getFocusedWindow();

    if (!browserWindow) return;

    browserWindow.minimize();
  }),
});

