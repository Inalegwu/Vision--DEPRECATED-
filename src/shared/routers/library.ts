import { dialog } from "electron";
import { publicProcedure, router } from "../../trpc";
import { createExtractorFromData } from "node-unrar-js/esm";
import * as fs from "fs";
import { TRPCError } from "@trpc/server";
import { v4 } from "uuid";
import { issues, pages } from "../schema";

export const libraryRouter = router({
  addToLibrary: publicProcedure.mutation(async ({ ctx }) => {
    try {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        title: "Select Issue",
        defaultPath: ctx.app.getPath("downloads"),
        buttonLabel: "Add To Library",
        properties: ["openFile"],
      });

      if (canceled) {
        return {
          status: false,
        };
      }

      // load the wasm binary of node-unrar-js from {filePath}
      const wasmBinary = fs.readFileSync(
        "node_modules/node-unrar-js/dist/js/unrar.wasm"
      );

      const buf = Uint8Array.from(fs.readFileSync(filePaths[0])).buffer;

      const extractor = await createExtractorFromData({
        data: buf,
        wasmBinary,
      });

      const list = extractor.getFileList();
      const listArcHeader = list.arcHeader;
      const fileHeaders = [...list.fileHeaders];

      const files = fileHeaders.map((v) => v.name);

      const extracted = extractor.extract({ files });
      const extractedFiles = [...extracted.files];

      const b64 = Buffer.from(extractedFiles[0].extraction?.buffer!).toString(
        "base64"
      );
      const thumbnailUrl = "data:image/png;base64," + b64;

      const name = extractedFiles[0].fileHeader.name.split("-")[0];

      const createdIssue = await ctx.db
        .insert(issues)
        .values({
          id: v4(),
          name,
          thumbnailUrl,
        })
        .returning({ id: issues.id, name: issues.name });

      extractedFiles.forEach(async (v, idx) => {
        const b64 = Buffer.from(v.extraction?.buffer!).toString("base64");
        const name =
          v.fileHeader.name.split("-")[0] + v.fileHeader.name.split("-")[1];
        const url = "data:image/png;base64" + b64;

        await ctx.db.insert(pages).values({
          id: v4(),
          name: `${createdIssue[0].name}-${idx}`,
          content: url,
          issueId: createdIssue[0].id,
        });
      });

      return {
        status: true,
      };
    } catch (e) {
      if (e instanceof Error) {
        throw new TRPCError({
          code: "PARSE_ERROR",
          message: "Couldn't Add To Library",
          cause: e.cause,
        });
      }
    }
  }),
  getLibrary: publicProcedure.query(async ({ ctx }) => {
    const issues = await ctx.db.query.issues.findMany({});

    return {
      issues,
    };
  }),
});
