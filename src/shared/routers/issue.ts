import { trackEvent } from "@aptabase/electron/main";
import { issues, pages } from "@shared/schema";
import { publicProcedure, router } from "@src/trpc";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";

// all actions that can be carried out on an issue
export const issueRouter = router({
  getIssue: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
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
      } catch (e) {
        console.log(e);
        trackEvent("error_occured", {
          router: "issue",
          function: "getIssue",
        });
      }
    }),
  removeIssue: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      trackEvent("Delete Issue");
      try {
        ctx.db.transaction(async (tx) => {
          trackEvent("Issue deleted", {
            deletedIssueId: input.id,
          });
          await tx.delete(pages).where(eq(pages.issueId, input.id));
          await tx.delete(issues).where(eq(issues.id, input.id));
        });

        return true;
      } catch (e) {
        console.log(e);
        trackEvent("error_occured", {
          router: "issue",
          function: "removeIssue",
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: e,
          message: "Something went wrong while trying to remove that issue",
        });
      }
    }),
  getIssueData: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const issue = await ctx.db.query.issues.findFirst({
          where: (issues, { eq }) => eq(issues.id, input.id),
        });

        if (!issue) {
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
      } catch (e) {
        trackEvent("error_occured", {
          router: "issue",
          function: "getIssueData",
        });
        console.log(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: e,
          message: "Error occured",
        });
      }
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
        trackEvent("error_occured", {
          router: "issue",
          function: "changeIssueName",
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: e,
          message: "Error occured",
        });
      }
    }),
    getIssuePageLength:publicProcedure.input(z.object({
      id:z.string()
    })).query(async({ctx,input})=>{
      const pages=await ctx.db.query.pages.findMany({
        where:(page,{eq})=>eq(page.issueId,input.id),
      })

      return pages.length
    })
});
