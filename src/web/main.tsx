import { queryClient, trpcClient, trpcReact } from "@shared/config";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDom from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryFallback } from "./pages";

import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import "virtual:uno.css";
import { App } from "./App";
import "./App.css";
import { globalState$ } from "./state";

const { colorMode } = globalState$.uiState.get();

ReactDom.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary
      FallbackComponent={(props) => <ErrorBoundaryFallback {...props} />}
    >
      <trpcReact.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Theme
            appearance="dark"
            accentColor="iris"
            grayColor="mauve"
            radius="large"
            scaling="90%"
          >
            <App />
          </Theme>
        </QueryClientProvider>
      </trpcReact.Provider>
    </ErrorBoundary>
  </React.StrictMode>,
);
