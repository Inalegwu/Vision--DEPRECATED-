import z from "zod";
import { TRPCError } from "@trpc/server";
import { trackEvent } from "@aptabase/electron/main";
import { SqliteError } from "better-sqlite3";
import { issues, pages } from "../schema";
import { DrizzleError, eq } from "drizzle-orm";
import { publicProcedure, router } from "../../trpc";

export const issueRouter = router({
  getIssue: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const issue = await ctx.db.query.issues.findFirst({
        where: (issues, { eq }) => eq(issues.id, input.id),
      });

      if (!issue) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Couldn't find that issue , sorry 🤷‍♂️",
        });
      }

      const pages = await ctx.db.query.pages.findMany({
        where: (pages, { eq }) => eq(pages.issueId, issue.id),
      });

      return {
        issue: {
          ...issue,
          pages,
        },
      };
    }),
  deleteIssue: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      trackEvent("Delete Issue");
      try {
        ctx.db.transaction(async (tx) => {
          trackEvent("Issue deleted", {
            id: input.id,
          });
          await tx.delete(pages).where(eq(pages.issueId, input.id));
          await tx.delete(issues).where(eq(issues.id, input.id));
        });

        return true;
      } catch (e) {
        if (e instanceof DrizzleError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Couldn't Delete Issue",
            cause: e.cause,
          });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Couldn't Delete Issue",
          });
        }
      }
    }),
  getIssueData: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const issue = await ctx.db.query.issues.findFirst({
        where: (issues, { eq }) => eq(issues.id, input.id),
      });

      /**
       * TODO something like this will be implemented
       * when the metadata files are being saved
       *
       * const metadata=await ctx.db.query.meta.findFirst({
       *  where:(meta,{eq})=>eq(meta.issueId.input.id),
       * });
       *
       *
       */

      if (!issue) {
        trackEvent("Fetch issue error", {
          issue_id: input.id,
        });
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No Issue With That ID",
        });
      }

      return {
        data: issue,
      };
    }),
  changeIssueName: publicProcedure
    .input(z.object({ id: z.string(), newName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db
          .update(issues)
          .set({
            name: input.newName,
          })
          .where(eq(issues.id, input.id));
      } catch (e) {
        if (e instanceof DrizzleError) {
          console.log(e);
          trackEvent("Couldn't Update Issue", {
            cause: e.message,
          });
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Couldn't Update Issue",
          });
        } else if (e instanceof SqliteError) {
          console.log(e);
          trackEvent("Update Issue Sqlite Error", {
            cause: e.message,
          });
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Couldn't Update Issue",
          });
        } else {
          trackEvent("Unknown Error while updating issue");
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Couldn't Update Issue",
          });
        }
      }
    }),
});
