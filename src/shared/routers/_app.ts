import { issueRouter } from "@shared/routers/issue";
import { libraryRouter } from "@shared/routers/library";
import { windowRouter } from "@shared/routers/window";
import { publicProcedure, router } from "@src/trpc";
import pkg from "../../../package.json";
import { collectionRouter } from "./collection";

export const appRouter = router({
  window: windowRouter,
  library: libraryRouter,
  issue: issueRouter,
  collection:collectionRouter,
  version: publicProcedure.query(() => {
    return pkg.version;
  }),
});

export type AppRouter = typeof appRouter;
