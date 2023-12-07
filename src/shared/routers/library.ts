import z from "zod";
import { dialog } from "electron";
import { Reasons } from "@shared/types";
import { TRPCError } from "@trpc/server";
import { trackEvent } from "@aptabase/electron/main";
import { UnrarError } from "node-unrar-js";
import { SqliteError } from "better-sqlite3";
import { DrizzleError, eq } from "drizzle-orm";
import { publicProcedure, router } from "@src/trpc";
import { RarExtractor, ZipExtractor } from "@shared/extractors";
import { collections, issues, pages } from "@shared/schema";
import { convertToImageUrl, decodeMetaData, generateUUID } from "@shared/utils";

export const libraryRouter = router({
  addToLibrary: publicProcedure.mutation(async ({ ctx }) => {
    trackEvent("Add To Library");
    try {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        title: "Select Issue",
        defaultPath: ctx.app.getPath("downloads"),
        buttonLabel: "Add To Library",
        properties: ["openFile"],
        filters: [{ name: "Comic Book Archive", extensions: ["cbz", "cbr"] }],
      });

      if (canceled) {
        return {
          status: false,
          reason: Reasons.CANCELLED,
        };
      }

      // handle zip files
      if (filePaths[0].includes("cbz")) {
        const { sortedFiles, metaDataFile: md } = await ZipExtractor(
          filePaths[0]
        );

        const decodedMeta = decodeMetaData(md?.data!);

        console.log(decodedMeta);

        const thumbnailUrl = convertToImageUrl(sortedFiles[0].data.buffer);

        const name = sortedFiles[0]?.name
          .replace(/\.[^/.]+$/, "")
          .replace(/(\d+)$/g, "")
          .replace("-", "");

        const issueExists = await ctx.db.query.issues.findFirst({
          where: (issues, { eq }) => eq(issues.name, name),
        });

        if (issueExists) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `${name} , is already in your library`,
            cause: `Tried adding ${name} to library again`,
          });
        }

        const createdIssue = await ctx.db
          .insert(issues)
          .values({
            id: generateUUID(),
            name,
            thumbnailUrl,
          })
          .returning({
            id: issues.id,
            name: issues.name,
          });

        sortedFiles.forEach(async (v, idx) => {
          const content = convertToImageUrl(v.data.buffer);

          await ctx.db.insert(pages).values({
            id: generateUUID(),
            issueId: createdIssue[0].id,
            content,
            name: `${createdIssue[0].name}-${idx}`,
          });
        });

        return {
          status: true,
          reason: Reasons.NONE,
        };
      }
      // handle rar files
      else {
        console.log(filePaths);
        const { metaDataFile: md, sortedFiles } = await RarExtractor(
          filePaths[0]
        );

        const decodedMeta = decodeMetaData(md?.extraction?.buffer!);

        console.log(decodedMeta);

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
            id: generateUUID(),
            name,
            thumbnailUrl,
          })
          .returning({ id: issues.id, name: issues.name });

        sortedFiles.forEach(async (v, idx) => {
          const content = convertToImageUrl(v.extraction?.buffer!);

          await ctx.db.insert(pages).values({
            id: generateUUID(),
            name: `${createdIssue[0].name}-${idx}`,
            content,
            issueId: createdIssue[0].id,
          });
        });

        return {
          status: true,
          reason: Reasons.NONE,
        };
      }
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

      const collections = await ctx.db.query.collections.findMany({
        with: {
          issues: true,
        },
      });

      const merged = issues.filter(
        (k) => !collections.find((l) => l.issues.find((m) => m.id === k.id))
      );

      return {
        issues: merged,
        collections,
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
  createCollection: publicProcedure
    .input(
      z.object({
        name: z.string().refine((v) => v.trim),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const created = await ctx.db
          .insert(collections)
          .values({
            id: generateUUID(),
            name: input.name,
            dateCreated: Date.now(),
          })
          .returning({ name: collections.name, id: collections.id });

        return {
          status: true,
          data: created,
        };
      } catch (e) {
        if (e instanceof DrizzleError) {
          throw new TRPCError({
            code: "PARSE_ERROR",
            message: "Couldn't Create Collection",
            cause: e.message,
          });
        }
      }
    }),
  getCollectionById: publicProcedure
    .input(
      z.object({
        collectionId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const collection = await ctx.db.query.collections.findFirst({
        where: (collections, { eq }) => eq(collections.id, input.collectionId),
        with: {
          issues: true,
        },
      });

      return {
        collection,
      };
    }),
  addIssueToCollection: publicProcedure
    .input(
      z.object({
        issueId: z.string().refine((v) => v.trim),
        collectionId: z.string().refine((v) => v.trim),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const collection = await ctx.db.query.collections.findFirst({
          where: (collections, { eq }) =>
            eq(collections.id, input.collectionId),
        });

        if (!collection) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Couldn't Find That Collection",
          });
        }

        const result = await ctx.db
          .update(issues)
          .set({
            collectionId: collection.id,
          })
          .where(eq(issues.id, input.issueId))
          .returning({ name: issues.name });

        return {
          result,
        };
      } catch (e) {
        if (e instanceof DrizzleError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Couldn't Add Issue to Collection",
            cause: e.message,
          });
        } else if (e instanceof SqliteError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Couldn't Add Issue To Collection",
            cause: e.message,
          });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Unexpected Error",
            cause: e,
          });
        }
      }
    }),
  deleteCollection: publicProcedure
    .input(
      z.object({
        id: z.string().refine((v) => v.trim),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const collection = await ctx.db.query.collections.findFirst({
          where: (collections, { eq }) => eq(collections.id, input.id),
        });

        if (!collection) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Couldn't Find That Collection",
            cause: "Collection not found",
          });
        }

        const deletedCollection = await ctx.db
          .delete(collections)
          .where(eq(collections.id, collection.id))
          .returning({ name: collections.name });

        return {
          status: true,
          data: deletedCollection[0],
        };
      } catch (e) {
        if (e instanceof DrizzleError) {
          trackEvent("failed to delete collection-DRIZZLE ERROr", {
            cause: e.message,
          });
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Couldn't Delete Collection",
            cause: e.message,
          });
        } else if (e instanceof SqliteError) {
          trackEvent("failed to delete collection-SQLITE ERROR", {
            cause: e.message,
          });
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Couldn't Delete Collection",
            cause: e.message,
          });
        } else if (e instanceof TRPCError) {
          trackEvent("failed to delete collection-TRPC ERROR", {
            cause: e.message,
          });
          throw new TRPCError({
            code: e.code,
            cause: e.cause,
            message: e.message,
          });
        } else {
          trackEvent("failed to delete collection-UNEXPECTED ERROR", {
            cause: "unknown",
          });
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: "Couldn't Delete Collection",
          });
        }
      }
    }),
  removeIssueFromCollection: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const issue = await ctx.db.query.issues.findFirst({
          where: (issues, { eq }) => eq(issues.id, input.id),
        });

        if (!issue) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Couldn't Find That Issue",
            cause: "Issue not found",
          });
        }

        const removedIssue = await ctx.db
          .update(issues)
          .set({ collectionId: null })
          .where(eq(issues.id, issue.id))
          .returning({
            name: issues.name,
          });

        return {
          status: true,
          data: removedIssue[0],
        };
      } catch (e) {
        if (e instanceof DrizzleError) {
          trackEvent("failed to delete collection-DRIZZLE ERROr", {
            cause: e.message,
          });
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Couldn't Delete Collection",
            cause: e.message,
          });
        } else if (e instanceof SqliteError) {
          trackEvent("failed to delete collection-SQLITE ERROR", {
            cause: e.message,
          });
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Couldn't Delete Collection",
            cause: e.message,
          });
        } else if (e instanceof TRPCError) {
          trackEvent("failed to delete collection-TRPC ERROR", {
            cause: e.message,
          });
          throw new TRPCError({
            code: e.code,
            cause: e.cause,
            message: e.message,
          });
        } else {
          trackEvent("failed to delete collection-UNEXPECTED ERROR", {
            cause: "unknown",
          });
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: "Couldn't Delete Collection",
          });
        }
      }
    }),
  changeIssueName: publicProcedure
    .input(
      z.object({
        id: z.string(),
        newName: z.string().refine((v) => v.trim()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const collection = await ctx.db.query.collections.findFirst({
          where: (collections, { eq }) => eq(collections.id, input.id),
        });

        if (!collection) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Couldn't Find That Collection",
            cause: "collection not found",
          });
        }

        const newCollectionName = await ctx.db
          .update(collections)
          .set({
            name: input.newName,
          })
          .where(eq(collections.id, collection.id))
          .returning({ name: collections.name });

        return {
          status: true,
          data: newCollectionName[0],
        };
      } catch (e) {
        if (e instanceof DrizzleError) {
          trackEvent("failed to delete collection-DRIZZLE ERROr", {
            cause: e.message,
          });
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Couldn't Delete Collection",
            cause: e.message,
          });
        } else if (e instanceof SqliteError) {
          trackEvent("failed to delete collection-SQLITE ERROR", {
            cause: e.message,
          });
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Couldn't Delete Collection",
            cause: e.message,
          });
        } else if (e instanceof TRPCError) {
          trackEvent("failed to delete collection-TRPC ERROR", {
            cause: e.message,
          });
          throw new TRPCError({
            code: e.code,
            cause: e.cause,
            message: e.message,
          });
        } else {
          trackEvent("failed to delete collection-UNEXPECTED ERROR", {
            cause: "unknown",
          });
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: "Couldn't Delete Collection",
          });
        }
      }
    }),
});
