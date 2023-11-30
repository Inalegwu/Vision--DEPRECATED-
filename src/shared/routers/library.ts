import { v4 } from "uuid";
import { dialog } from "electron";
import { Reasons } from "@shared/types";
import { TRPCError } from "@trpc/server";
import { trackEvent } from "@aptabase/electron/main";
import { UnrarError } from "node-unrar-js";
import { SqliteError } from "better-sqlite3";
import { DrizzleError } from "drizzle-orm";
import { issues, pages } from "@shared/schema";
import { convertToImageUrl } from "@shared/utils";
import { publicProcedure, router } from "@src/trpc";
import { RarExtractor } from "@shared/extractors";

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
      const { metaDataFile, sortedFiles } = await RarExtractor(filePaths[0]);

      const thumbnailUrl = convertToImageUrl(
        sortedFiles[0]?.extraction?.buffer!
      );

      const name = sortedFiles[0]?.fileHeader.name
        .replace(/\.[^/.]+$/, "")
        .replace(/(\d+)$/g, "")
        .replace("-", "");

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

      sortedFiles.forEach(async (v, idx) => {
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
        trackEvent("Zip Parse Failed", {
          cause: e.message,
        });
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "Couldn't Add To Library , Unsupported file type",
          cause: e.file,
        });
      }
      if (e instanceof DrizzleError) {
        trackEvent("Drizzle Failed to Save File", {
          cause: e.message,
        });
        console.log(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Couldn't Save Issue",
          cause: e.cause,
        });
      }
      if (e instanceof TRPCError) {
        trackEvent("Generic Error Event", {
          cause: e.cause?.message!,
        });
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

      const issues = await ctx.db.query.issues.findMany({
        orderBy: (issues, { asc }) => asc(issues.name),
      });

      return {
        issues,
      };
    } catch (e) {
      if (e instanceof DrizzleError) {
        trackEvent("Drizzle Query Error", {
          cause: e.message,
        });
        throw new TRPCError({
          message: "Couldn't Get Your Library",
          code: "INTERNAL_SERVER_ERROR",
          cause: e.cause,
        });
      } else if (e instanceof SqliteError) {
        trackEvent("SQLite Query Error", {
          cause: e.message,
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: e.cause,
          message: "Couldn't Get Your Library",
        });
      } else if (e instanceof TRPCError) {
        trackEvent("Generic Error Occurred", {
          cause: e.message,
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unexpected Error While trying to load your library",
        });
      }
    }
  }),
});
