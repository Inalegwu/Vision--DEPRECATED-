import z from "zod";
import { app, dialog } from "electron";
import { publicProcedure, router } from "../../trpc";
import * as fs from "fs/promises";
import { ArchiveReader, libarchiveWasm } from "libarchive-wasm";

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

    const file = await fs.readFile(result.filePaths[0]);
    const mod = await libarchiveWasm();
    const reader = new ArchiveReader(mod, new Int8Array(file));

    for (const entry of reader.entries()) {
      console.log(entry.getSize());
    }
  }),
  getLibrary: publicProcedure
    .input(
      z.object({
        filter: z.enum(["All", "Issue", "Collection"]),
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

