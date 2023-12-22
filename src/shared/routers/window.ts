import { trackEvent } from "@aptabase/electron/main";
import { publicProcedure, router } from "../../trpc";

export const windowRouter = router({
  closeWindow: publicProcedure.mutation(({ ctx }) => {
    trackEvent("App Closed");
    if (!ctx.window) return;

    ctx.window.close();
  }),
  maximizeWindow: publicProcedure.mutation(({ ctx }) => {
    if (!ctx.window) return;

    const isMaximized = ctx.window.isMaximized();

    if (isMaximized) {
      ctx.window.unmaximize();
      return {
        fullscreen_status: false,
      };
    }

    ctx.window.maximize();

    return {
      fullscreen_status: true,
    };
  }),
  minimizeWindow: publicProcedure.mutation(({ ctx }) => {
    ctx.window?.minimize();
  }),
});
