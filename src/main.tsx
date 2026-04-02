import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import App from "./App";
import { SidebarProvider } from "./contexts/SidebarContext";
import "./index.css";

async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCK !== "true") return;
  const { worker } = await import("./mocks/browser");
  return worker.start({ onUnhandledRequest: "bypass" });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <SidebarProvider>
            <App />
          </SidebarProvider>
        </HashRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
});
