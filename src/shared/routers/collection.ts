import { trackEvent } from "@aptabase/electron/main";
import { publicProcedure, router } from "@src/trpc";
import { TRPCError } from "@trpc/server";
import { DrizzleError, eq } from "drizzle-orm";
import { z } from "zod";
import { collections, issues } from "../schema";
import { generateUUID } from "../utils";

// all actions that can be carried out on a collection and its contents
export const collectionRouter = router({
  getIssuesInCollection: publicProcedure
    .input(
      z.object({
        id: z.string().refine((v) => v.trim),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const collection = await ctx.db.query.collections.findFirst({
          where: (collections, { eq }) => eq(collections.id, input.id),
          with: {
            issues: {
              orderBy: (issues, { asc }) => [asc(issues.name)],
            },
          },
        });

        return {
          collection,
        };
      } catch (e) {
        console.log(e);
        trackEvent("error_occured", {
          router: "collection",
          function: "getIssuesInCollection",
          error: e instanceof Error ? e.message : "untraceable",
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: e,
          message: "Error occured",
        });
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
          function: "addIssueToCollection",
          error: e instanceof Error ? e.message : "untraceable",
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
          function: "deleteCollection",
          error: e instanceof Error ? e.message : "untraceable",
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
          function: "removeIssueFromCollection",
          error: e instanceof Error ? e.message : "untraceable",
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
        trackEvent("error_occured", {
          router: "collection",
          function: "createCollection",
          error: e instanceof Error ? e.message : "untraceable",
        });
        if (e instanceof DrizzleError) {
          throw new TRPCError({
            code: "PARSE_ERROR",
            message: "Couldn't Create Collection",
            cause: e.message,
          });
        }
      }
    }),
  changeCollectionName: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db
          .update(collections)
          .set({
            name: input.name,
          })
          .where(eq(collections.id, input.id));
      } catch (e) {
        trackEvent("error_occured", {
          router: "collection",
          function: "changeCollectionName",
          error: e instanceof Error ? e.message : "untraceable",
        });
        console.log(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: "unknown",
          message: "Something went wrong while changing collection name",
        });
      }
    }),
});
