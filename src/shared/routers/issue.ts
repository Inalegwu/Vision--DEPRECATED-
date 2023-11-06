import z from "zod";
import { publicProcedure, router } from "../../trpc";
import { reading } from "../schema";
import { v4 } from "uuid";

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
  markIssueAsDone: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .insert(reading)
        .values({ id: v4(), issueId: input.id });

      console.log(result.lastInsertRowid);

      return true;
    }),
});

