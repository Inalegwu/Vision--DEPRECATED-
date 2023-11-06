import { router } from "../../trpc";
import { collectionRouter } from "./collection";
import { issueRouter } from "./issue";
import { libraryRouter } from "./library";
import { windowRouter } from "./window";

export const appRouter = router({
  window: windowRouter,
  library: libraryRouter,
  collection: collectionRouter,
  issue: issueRouter,
});

export type AppRouter = typeof appRouter;

