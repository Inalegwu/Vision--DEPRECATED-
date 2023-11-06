import { app, dialog } from "electron";
import { publicProcedure, router } from "../../trpc";

export const libraryRouter = router({
  addToLibrary: publicProcedure.mutation(async ({ ctx }) => {
    const result = await dialog.showOpenDialog({
      title: "Select Issue",
      defaultPath: app.getPath("downloads"),
      buttonLabel: "Add To Library",
      properties: ["openFile"],
    });

    if (result.canceled) {
      return {
        status: false,
        reason: "CANCELLED",
      };
    }
  }),
});

