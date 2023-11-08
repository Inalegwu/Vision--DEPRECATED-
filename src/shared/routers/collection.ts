import { z } from "zod";
import { publicProcedure, router } from "../../trpc";
import { generateUUID } from "../utils";
import { collections } from "../schema";
import { eq } from "drizzle-orm";

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
  createCollection: publicProcedure
    .input(
      z.object({
        name: z.string().refine((v) => v.trim()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = generateUUID();

      const result = await ctx.db
        .insert(collections)
        .values({ id, name: input.name });

      console.log(result.lastInsertRowid);

      return true;
    }),
  deleteCollection: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .delete(collections)
        .where(eq(collections.id, input.id));

      console.log(result.lastInsertRowid);

      return true;
    }),
});

