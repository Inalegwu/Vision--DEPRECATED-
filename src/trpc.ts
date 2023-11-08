import { initTRPC } from "@trpc/server";
import { createContext } from "./shared/storage";

const t = initTRPC.context<typeof createContext>().create({
  isServer: true,
});

export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;

