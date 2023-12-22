import { trackEvent } from "@aptabase/electron/main";
import { RarExtractor, ZipExtractor } from "@shared/extractors";
import { collections, issues, pages } from "@shared/schema";
import { Reasons } from "@shared/types";
import { convertToImageUrl, decodeMetaData, generateUUID } from "@shared/utils";
import { publicProcedure, router } from "@src/trpc";
import { TRPCError } from "@trpc/server";
import { DrizzleError, eq } from "drizzle-orm";
import { dialog } from "electron";
import z from "zod";

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
        const { sortedFiles, metaDataFile: _md } = await ZipExtractor(
          filePaths[0],
        );

        const thumbnailUrl = convertToImageUrl(
          sortedFiles[0]?.data?.buffer || sortedFiles[1]?.data?.buffer!,
        );

        console.log(sortedFiles[0]?.name, sortedFiles[1]?.name);

        console.log();

        const name =
          sortedFiles[0]?.name
            .replace(/\.[^/.]+$/, "")
            .replace(/(\d+)$/g, "")
            .replace("-", " ") ||
          filePaths[0]
            .replace(/^.*[\\\/]/, "")
            .replace(/\.[^/.]+$/, "")
            .replace(/(\d+)$/g, "")
            .replace("-", " ");

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

        for (const file of sortedFiles) {
          if (file.isDir) {
            return;
          }

          const content = convertToImageUrl(file.data.buffer);

          await ctx.db.insert(pages).values({
            id: generateUUID(),
            issueId: createdIssue[0].id,
            content,
            name: `${createdIssue[0].name}-${file.name}`,
          });
        }

        return {
          status: true,
          reason: Reasons.NONE,
        };
      }

      const { metaDataFile: _md, sortedFiles } = await RarExtractor(
        filePaths[0],
      );

      if (_md) {
        const decodedMeta = decodeMetaData(_md.extraction?.buffer!);
        const splitMeta = decodedMeta.split("\n");
        console.log(splitMeta);
      }

      // in the event the first item is a folder
      // the buffer will be undefined , so we can move on
      // to the next item , this will be the first image file
      // in that folder
      const thumbnailUrl = convertToImageUrl(
        sortedFiles[0]?.extraction?.buffer ||
          sortedFiles[1]?.extraction?.buffer!,
      );

      const name =
        sortedFiles[0]?.fileHeader.name
          .replace(/\.[^/.]+$/, "")
          .replace(/(\d+)$/g, "")
          .replace("-", " ") ||
        filePaths[0]
          .replace(/^.*[\\\/]/, "")
          .replace(/\.[^/.]+$/, "")
          .replace(/(\d+)$/g, "")
          .replace("-", " ");

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

      for (const file of sortedFiles) {
        if (file.fileHeader.flags.directory) {
          return;
        }

        const content = convertToImageUrl(file.extraction?.buffer!);

        await ctx.db.insert(pages).values({
          id: generateUUID(),
          name: `${createdIssue[0].name}-${file.fileHeader.name}`,
          content,
          issueId: createdIssue[0].id,
        });
      }

      return {
        status: true,
        reason: Reasons.NONE,
      };
    } catch (e) {
      trackEvent("error_occured", {
        router: "collection",
        function: "addToLibrary",
      });
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        cause: e,
        message: "Error occured",
      });
    }
  }),
  getLibrary: publicProcedure.query(async ({ ctx }) => {
    try {
      trackEvent("Load Library");

      // find all the users saved issues
      const issues = await ctx.db.query.issues.findMany({
        orderBy: (issues, { asc }) => asc(issues.name),
      });

      // get all the users collections from storage
      const collections = await ctx.db.query.collections.findMany({
        with: {
          issues: true,
        },
      });

      // filter out all issues that are already included
      // within collections
      const merged = issues.filter(
        (k) => !collections.find((l) => l.issues.find((m) => m.id === k.id)),
      );

      return {
        issues: merged,
        collections,
      };
    } catch (e) {
      trackEvent("error_occured", {
        router: "collection",
        function: "addToLibrary",
      });
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        cause: e,
        message: "Error occured",
      });
    }
  }),
  createCollection: publicProcedure
    .input(
      z.object({
        name: z.string().refine((v) => v.trim),
      }),
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
  addIssueToCollection: publicProcedure
    .input(
      z.object({
        issueId: z.string().refine((v) => v.trim),
        collectionId: z.string().refine((v) => v.trim),
      }),
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
        trackEvent("error_occured", {
          router: "collection",
          function: "addToLibrary",
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: e,
          message: "Error occured",
        });
      }
    }),
  deleteCollection: publicProcedure
    .input(
      z.object({
        id: z.string().refine((v) => v.trim),
      }),
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
        trackEvent("error_occured", {
          router: "collection",
          function: "addToLibrary",
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: e,
          message: "Error occured",
        });
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
        trackEvent("error_occured", {
          router: "collection",
          function: "addToLibrary",
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: e,
          message: "Error occured",
        });
      }
    }),
  changeIssueName: publicProcedure
    .input(
      z.object({
        id: z.string(),
        newName: z.string().refine((v) => v.trim()),
      }),
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
        trackEvent("error_occured", {
          router: "collection",
          function: "addToLibrary",
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: e,
          message: "Error occured",
        });
      }
    }),
});
