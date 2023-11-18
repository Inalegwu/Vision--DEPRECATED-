import z from "zod";
import { publicProcedure, router } from "../../trpc";
import { issues } from "../schema";
import { eq } from "drizzle-orm";

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
  deleteIssue: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(issues).where(eq(issues.id, input.id));

      return true;
    }),
});
