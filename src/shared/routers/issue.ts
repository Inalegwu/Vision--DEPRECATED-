import z from "zod";
import { publicProcedure, router } from "../../trpc";
import { reading } from "../schema";
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
  markIssueAsDoneReading: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const generatedId = generateUUID();
      const result = await ctx.db
        .insert(reading)
        .values({ id: generatedId, issueId: input.id });

      console.log(result.lastInsertRowid);

      return true;
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

