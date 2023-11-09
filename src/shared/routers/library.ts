import z from "zod";
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
      };
    }
  }),
  getLibrary: publicProcedure
    .input(
      z.object({
        filter: z.any(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (input.filter === "All") {
        const issues = await ctx.db.query.issues.findMany();
        const collections = await ctx.db.query.collections.findMany();

        return {
          issues,
          collections,
        };
      } else if (input.filter === "Collection") {
        const collections = await ctx.db.query.collections.findMany();

        return {
          collections,
        };
      } else if (input.filter === "Issue") {
        const issues = await ctx.db.query.issues.findMany();

        return {
          issues,
        };
      }
    }),
});

