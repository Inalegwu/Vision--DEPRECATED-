import { dialog } from "electron";
import { publicProcedure, router } from "../../trpc";
import { createExtractorFromData } from "node-unrar-js/esm";
import * as fs from "fs";
import { TRPCError } from "@trpc/server";
import { v4 } from "uuid";
import { issues, pages } from "../schema";
import { convertToImageUrl } from "../utils";

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

      const thumbnailUrl = convertToImageUrl(
        extractedFiles[extractedFiles.length - 2].extraction?.buffer!
      );

      const name = files[0].split("-")[0] + files[0].split("-")[1];

      const createdIssue = await ctx.db
        .insert(issues)
        .values({
          id: v4(),
          name,
          thumbnailUrl,
        })
        .returning({ id: issues.id, name: issues.name });

      extractedFiles.forEach(async (v, idx) => {
        if (v.fileHeader.name.includes("xml")) {
          return;
        }

        const content = convertToImageUrl(v.extraction?.buffer!);

        await ctx.db.insert(pages).values({
          id: v4(),
          name: `${createdIssue[0].name}-${idx}`,
          content,
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
