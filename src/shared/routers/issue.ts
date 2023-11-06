import { publicProcedure, router } from "../../trpc";

export const issueRouter = router({
  getCurrentlyReading: publicProcedure.query(async ({ ctx }) => {
    const issues = await ctx.db.query.issues.findMany({
      where: (issues, { eq }) => eq(issues.currentlyReading, true),
      with: {
        pages: true,
      },
    });

    return {
      issues,
    };
  }),
  getDoneReading: publicProcedure.query(async ({ ctx }) => {
    const done = await ctx.db.query.reading.findMany({
      with: {
        issues: true,
      },
    });

    const issues = done.map((v) => ({
      id: v.id,
      issue_id: v.issueId,
      thumbnail: v.issues.thumbnailUrl,
      name: v.issues.name,
    }));

    return {
      issues,
    };
  }),
});

