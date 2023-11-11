import z from "zod";
import { publicProcedure, router } from "../../trpc";

export const issueRouter = router({
  getIssueById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const issue = await ctx.db.query.issues.findMany({
        where: (issues, { eq }) => eq(issues.id, input.id),
        with: {
          pages: true,
        },
      });

      return {
        issue,
      };
    }),
});

