import z from "zod";
import { publicProcedure, router } from "../../trpc";
import { generateUUID } from "../utils";

export const issueRouter = router({
  getCurrentlyReading: publicProcedure.query(async ({ ctx }) => {
    const issues = await ctx.db.query.issues.findMany({
      where: (issues, { eq }) => eq(issues.currentlyReading, true),
    });

    return {
      issues,
    };
  }),
  getIssueById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const issue = await ctx.db.query.issues.findMany({
        where: (issues, { eq }) => eq(issues.id, input.id),
        with: {
          pages: true,
        },
      });

      // const pages = await ctx.db.query.pages.findMany({
      //   where: (pages, { eq }) => eq(pages.issueId, input.id),
      // })

      return {
        issue,
      };
    }),
});

