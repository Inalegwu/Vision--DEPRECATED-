import { queryClient, trpcClient, trpcReact } from "@shared/config";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDom from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryFallback } from "./pages";

import { App } from "./App";
import "./App.css";

ReactDom.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary
      FallbackComponent={(props) => <ErrorBoundaryFallback {...props} />}
    >
      <trpcReact.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </trpcReact.Provider>
    </ErrorBoundary>
  </React.StrictMode>,
);
