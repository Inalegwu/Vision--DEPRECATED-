import z from "zod";
import { app, dialog } from "electron";
import { publicProcedure, router } from "../../trpc";
import * as zlib from "zlib";
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
      };
    }

    const unzip = zlib.createUnzip();

    fs.createReadStream(result.filePaths[0]).pipe(unzip);

    return true;
  }),
  getLibrary: publicProcedure
    .input(
      z.object({
        filter: z.any(),
      })
    )
    .query(async ({ ctx, input }) => {
      const issues = ctx.db.query.issues.findMany({});

      return {
        issues,
      };
    }),
});

