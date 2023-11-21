import z from "zod";
import { trackEvent } from "@aptabase/electron/main";
import { DrizzleError, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../../trpc";
import { issues, pages } from "../schema";
import { SqliteError } from "better-sqlite3";

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

        if (!issue) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Couldn't find that issue , sorry 🤷‍♂️",
          });
        }

        return {
          issue,
        };
      } catch (e) {
        console.log(e);
        if (e instanceof SqliteError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: e.message,
            cause: e.cause,
          });
        }
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Couldn't Get Issue",
        });
      }
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
        console.log(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Couldn't Update Issue",
        });
      }
    }),
});
