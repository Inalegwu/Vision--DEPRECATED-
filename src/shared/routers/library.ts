import * as fs from "fs";
import { v4 } from "uuid";
import { dialog } from "electron";
import { Reasons } from "../types";
import { TRPCError } from "@trpc/server";
import { trackEvent } from "@aptabase/electron/main";
import { UnrarError } from "node-unrar-js";
import { SqliteError } from "better-sqlite3";
import { DrizzleError } from "drizzle-orm";
import { issues, pages } from "../schema";
import { publicProcedure, router } from "../../trpc";
import { createExtractorFromData } from "node-unrar-js/esm";
import { convertToImageUrl, sortPages } from "../utils";

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
      // as a buffer.I don't ask why , I couldn't tell you.
      const wasmBinary = fs.readFileSync(
        "node_modules/node-unrar-js/dist/js/unrar.wasm"
      );

      // convert the buffer from the file we read
      // to a UInt8Array which node-unrar-js uses
      // IDK why
      const data = Uint8Array.from(fs.readFileSync(filePaths[0])).buffer;

      const extractor = await createExtractorFromData({
        data,
        wasmBinary,
      });

      const list = extractor.getFileList();
      const fileHeaders = [...list.fileHeaders];

      const files = fileHeaders.map((v) => v.name);
      const extracted = extractor.extract({ files });

      const extractedFiles = [...extracted.files];

      const sortedFiles = extractedFiles.sort(sortPages);

      const metaDataFile = sortedFiles.find((v) =>
        v.fileHeader.name.includes("xml")
      );

      // TODO parse metadata file to save to database which will come in handy later
      if (metaDataFile) {
        console.log(metaDataFile.fileHeader.name);
      }

      // convert first page of sorted file
      // to thumbnail url for the issue
      // as it is
      const thumbnailUrl = convertToImageUrl(
        sortedFiles[0]?.extraction?.buffer!
      );

      // parse the name from the file
      // header to create the issue name
      // using regex to strip off
      // some extraneous stuff
      const name = sortedFiles[0]?.fileHeader.name
        .replace(/\.[^/.]+$/, "")
        .replace(/(\d+)$/g, "")
        .replace("-", "");

      // check if the issue already exists
      // based on the parsed name
      // since I can guarantee that will always be the same
      const issueExists = await ctx.db.query.issues.findFirst({
        where: (issues, { eq }) => eq(issues.name, name),
      });

      if (issueExists) {
        throw new TRPCError({
          message: `${name} , is already in your library`,
          code: "CONFLICT",
          cause: `tried adding issue ${name} again`,
        });
      }

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
      if (e instanceof TRPCError) {
        throw new TRPCError({
          code: e.code,
          message: e.message,
          cause: e.cause,
        });
      }
    }
  }),
  getLibrary: publicProcedure.query(async ({ ctx }) => {
    try {
      trackEvent("Load Library");

      const issues = await ctx.db.query.issues.findMany({});

      return {
        issues,
      };
    } catch (e) {
      if (e instanceof DrizzleError) {
        throw new TRPCError({
          message: "Couldn't Get Your Library",
          code: "INTERNAL_SERVER_ERROR",
          cause: e.cause,
        });
      } else if (e instanceof SqliteError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: e.cause,
          message: "Couldn't Get Your Library",
        });
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unexpected Error While trying to load your library",
        });
      }
    }
  }),
});
