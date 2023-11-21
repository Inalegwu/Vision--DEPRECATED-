import * as fs from "fs";
import { dialog } from "electron";
import { trackEvent } from "@aptabase/electron/main";
import { publicProcedure, router } from "../../trpc";
import { createExtractorFromData } from "node-unrar-js/esm";
import { TRPCError } from "@trpc/server";
import { v4 } from "uuid";
import { issues, pages } from "../schema";
import { convertToImageUrl, sortPages } from "../utils";
import { Reasons } from "../types";
import { UnrarError } from "node-unrar-js";
import { DrizzleError } from "drizzle-orm";

export const libraryRouter = router({
  addToLibrary: publicProcedure.mutation(async ({ ctx }) => {
    trackEvent("Add To Library");

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
          reason: Reasons.CANCELLED,
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

      const sortedFiles = extractedFiles.sort(sortPages);

      const metaDataFile = sortedFiles.find((v) =>
        v.fileHeader.name.includes("xml")
      );

      const thumbnailUrl = convertToImageUrl(
        sortedFiles[0].extraction?.buffer!
      );

      const name = sortedFiles[0].fileHeader.name
        .replace(/\.[^/.]+$/, "")
        .replace(/(\d+)$/g, "")
        .replace("-", "");

      const createdIssue = await ctx.db
        .insert(issues)
        .values({
          id: v4(),
          name,
          thumbnailUrl,
        })
        .returning({ id: issues.id, name: issues.name });

      sortedFiles
        .filter((v) => !v.fileHeader.name.includes("xml"))
        .forEach(async (v, idx) => {
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
        reason: Reasons.NONE,
      };
    } catch (e) {
      if (e instanceof UnrarError) {
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "Couldn't Add To Library , Unsupported file type",
          cause: e.file,
        });
      }
      if (e instanceof DrizzleError) {
        console.log(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Save Error",
          cause: e.cause,
        });
      }
    }
  }),
  getLibrary: publicProcedure.query(async ({ ctx }) => {
    trackEvent("Load Library");

    const issues = await ctx.db.query.issues.findMany({});

    return {
      issues,
    };
  }),
});
