import { trackEvent } from "@aptabase/electron/main";
import { issues, pages } from "@shared/schema";
import { ChangeNameSchema, IdSchema } from "@shared/validators";
import { publicProcedure, router } from "@src/trpc";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import * as v from "valibot";

// all actions that can be carried out on an issue
export const issueRouter = router({
  getIssue: publicProcedure
    .input((x) => v.parse(IdSchema, x))
    .query(async ({ ctx, input }) => {
      try {
        const issue = await ctx.db.query.issues.findFirst({
          where: (issues, { eq }) => eq(issues.id, input.id),
        });

        // if the issue doesn't exist throw an
        // error so the app doesn't have to crash
        if (!issue) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Couldn't find that issue , sorry 🤷‍♂️",
          });
        }

        const pages = await ctx.db.query.pages.findMany({
          where: (pages, { eq }) => eq(pages.issueId, issue.id),
        });

        // I have to spread the issue into the object
        // with the pages because implementing the collection relation
        // somehow messed up the pages relation 🤷‍♂️
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
          error: `${e}`,
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: e,
          message: "Something went wrong while trying to remove that issue",
        });
      }
    }),
  removeIssue: publicProcedure
    .input((x) => v.parse(IdSchema, x))
    .mutation(async ({ ctx, input }) => {
      trackEvent("Delete Issue");
      try {
        ctx.db.transaction(async (tx) => {
          await tx.delete(pages).where(eq(pages.issueId, input.id));
          await tx.delete(issues).where(eq(issues.id, input.id));
        });

        return true;
      } catch (e) {
        console.log(e);
        trackEvent("error_occured", {
          router: "issue",
          function: "removeIssue",
          error: `${e}`,
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: e,
          message: "Something went wrong while trying to remove that issue",
        });
      }
    }),
  getIssueData: publicProcedure
    .input((x) => v.parse(IdSchema, x))
    .query(async ({ ctx, input }) => {
      try {
        const issue = await ctx.db.query.issues.findFirst({
          where: (issues, { eq }) => eq(issues.id, input.id),
        });

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
      } catch (e) {
        trackEvent("error_occured", {
          router: "issue",
          function: "getIssueData",
          error: `${e}`,
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
    .input((x) => v.parse(ChangeNameSchema, x))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db
          .update(issues)
          .set({
            name: input.name,
          })
          .where(eq(issues.id, input.id));
      } catch (e) {
        trackEvent("error_occured", {
          router: "issue",
          function: "changeIssueName",
          error: `${e}`,
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: e,
          message: "Error occured",
        });
      }
    }),
  getIssuePageLength: publicProcedure
    .input((x) => v.parse(IdSchema, x))
    .query(async ({ ctx, input }) => {
      const pages = await ctx.db.query.pages.findMany({
        where: (page, { eq }) => eq(page.issueId, input.id),
      });

      return pages.length;
    }),
});
