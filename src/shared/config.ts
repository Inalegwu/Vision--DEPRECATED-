import { QueryClient } from "@tanstack/react-query";
import { createTRPCReact } from "@trpc/react-query";
import { ipcLink } from "electron-trpc/renderer";
import { AppRouter } from "./routers/_app";

export const trpcReact = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: 60 * 60 * 24,
      networkMode: "always",
      retry: 4,
    },
    mutations: {
      cacheTime: 60 * 60 * 24,
      networkMode: "always",
      retry: 1,
    },
  },
});

export const trpcClient = trpcReact.createClient({
  links: [ipcLink()],
});

