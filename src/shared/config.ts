import { QueryClient } from "@tanstack/react-query";
import { TRPCClientError, createTRPCReact } from "@trpc/react-query";
import { ipcLink } from "electron-trpc/renderer";
import { AppRouter } from "./routers/_app";
import toast from "react-hot-toast";

export const trpcReact = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // It's not a network request is it
      // so it's safe to say that things in the database won't be changing that often
      cacheTime: Infinity,
      networkMode: "always",
      retry: 4,
      onError: (err) => {
        if (err instanceof TRPCClientError) {
          console.log(err.cause);
          toast.error(err.message);
        } else {
          console.log(err);
        }
      },
    },
    mutations: {
      // Same goes for here
      cacheTime: Infinity,
      networkMode: "always",
      retry: 1,
      onError: (err) => {
        if (err instanceof TRPCClientError) {
          console.log(err.cause);
          toast.error(err.message);
        } else {
          console.log(err);
        }
      },
    },
  },
});

export const trpcClient = trpcReact.createClient({
  links: [ipcLink()],
});

