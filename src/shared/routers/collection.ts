import { z } from "zod";
import { publicProcedure, router } from "../../trpc";

export const collectionRouter = router({
  getAllCollections: publicProcedure.query(({ ctx }) => {
    const collections = ctx.db.query.collections.findMany({});

    return {
      collections,
    };
  }),
  getCollectionById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const collection = await ctx.db.query.collections.findFirst({
        where: (collections, { eq }) => eq(collections.id, input.id),
        with: {
          issues: true,
        },
      });

      return {
        collection,
      };
    }),
  addIssueToCollection: publicProcedure
    .input(z.object({}))
    .mutation(async ({ ctx, input }) => {
      // TODO
    }),
  removeIssueFromCollection: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      //TODO
    }),
});

