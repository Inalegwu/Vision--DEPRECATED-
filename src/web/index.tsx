import React from "react";
import { createRoot } from "react-dom/client";
import { queryClient, trpcClient, trpcReact } from "../shared/config";
import { QueryClientProvider } from "@tanstack/react-query";

import { App } from "./App";
import "./App.css";

createRoot(document.getElementById("root") as Element).render(
  <React.StrictMode>
    <trpcReact.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpcReact.Provider>
  </React.StrictMode>,
);
