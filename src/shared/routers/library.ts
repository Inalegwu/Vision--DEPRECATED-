import z from "zod";
import { dialog } from "electron";
import { publicProcedure, router } from "../../trpc";
import * as fs from "fs";
import path from "path";
import unzipper from "unzipper";

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

    const fileContent = fs.createReadStream(result.filePaths[0]);

    fileContent.pipe(
      unzipper.Extract({
        path: path.join(ctx.app.getPath("appData"), "temp"),
      })
    );
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

