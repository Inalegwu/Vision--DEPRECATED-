import { app, dialog } from "electron";
import { publicProcedure, router } from "../../trpc";
import * as fs from "fs";

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

    console.log(result.filePaths);

    const file = fs.readFileSync(result.filePaths[0]);

    console.log(file);
  }),
});

