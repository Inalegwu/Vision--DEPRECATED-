import { trackEvent } from "@aptabase/electron/main";
import { publicProcedure, router } from "@src/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const collectionRouter = router({
  getIssuesInCollection: publicProcedure
    .input(
      z.object({
        id: z.string().refine((v) => v.trim),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const collection = await ctx.db.query.collections.findFirst({
          where: (collections, { eq }) => eq(collections.id, input.id),
          with: {
            issues: true,
          },
        });

        return {
          collection,
        };
      } catch (e) {
        console.log(e);
        trackEvent("error_occured", {
          router: "collection",
          function: "addToLibrary",
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: e,
          message: "Error occured",
        });
      }
    }),
});
