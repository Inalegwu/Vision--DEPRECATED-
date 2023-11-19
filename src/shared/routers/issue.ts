import z from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../../trpc";
import { issues, pages } from "../schema";
import { DrizzleError, eq } from "drizzle-orm";

export const issueRouter = router({
  getIssue: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const issue = await ctx.db.query.issues.findFirst({
          where: (issues, { eq }) => eq(issues.id, input.id),
          with: {
            pages: true,
          },
        });

        return {
          issue,
        };
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Couldn't Get Issue",
        });
      }
    }),
  deleteIssue: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        ctx.db.transaction(async (tx) => {
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
});
