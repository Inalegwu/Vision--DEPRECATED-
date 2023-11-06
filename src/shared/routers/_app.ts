import { router } from "../../trpc";
import { libraryRouter } from "./library";
import { windowRouter } from "./window";

export const appRouter = router({
  window: windowRouter,
  library: libraryRouter,
});

export type AppRouter = typeof appRouter;

