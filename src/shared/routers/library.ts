import z from "zod";
import { dialog } from "electron";
import { publicProcedure, router } from "../../trpc";

export const libraryRouter = router({
  addToLibrary: publicProcedure.mutation(async ({ ctx }) => {
    const result = await dialog.showOpenDialog({
      title: "Select Issue",
      defaultPath: ctx.app.getPath("downloads"),
      buttonLabel: "Add To Library",
      properties: ["openFile"],
    });

    if (result.canceled) {
      return {
        status: false,
      };
    }

    return true;
  }),
  getLibrary: publicProcedure.query(async ({ ctx }) => {
    const issues = ctx.db.query.issues.findMany({});

    return {
      issues,
    };
  }),
});
