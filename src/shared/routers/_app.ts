import { router } from "../../trpc";

import { windowRouter } from "./window";

export const appRouter = router({
  window: windowRouter,
});

export type AppRouter = typeof appRouter;

