import { router } from "../../trpc";
import { issueRouter } from "./issue";
import { libraryRouter } from "./library";
import { windowRouter } from "./window";

export const appRouter = router({
  window: windowRouter,
  library: libraryRouter,
  issue: issueRouter,
});

export type AppRouter = typeof appRouter;

