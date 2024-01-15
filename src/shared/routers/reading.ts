import { publicProcedure, router } from "@src/trpc";
import { object, parse, string, toTrimmed } from "valibot";

export const reading = router({
  saveReadingState: publicProcedure
    .input((x) =>
      parse(
        object({
          id: string([toTrimmed()]),
        }),
        x,
      ),
    )
    .mutation(async ({ ctx, input }) => {
      console.log(input.id);
      console.log(ctx);
    }),
  getReadingState: publicProcedure
    .input((x) =>
      parse(
        object({
          id: string([toTrimmed()]),
        }),
        x,
      ),
    )
    .mutation(async ({ ctx, input }) => {
      console.log(ctx, input);
    }),
});
