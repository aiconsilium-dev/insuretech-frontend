import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(({ command, mode }) => {
  const isVercel = process.env.VERCEL === "1";
  const base = isVercel ? "/" : "/insuretech-admin-test/";

  // #region agent log
  fetch("http://127.0.0.1:7888/ingest/1fef7b94-9655-4bda-96fd-3a82377cd632", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "adb972",
    },
    body: JSON.stringify({
      sessionId: "adb972",
      runId: "build-debug",
      hypothesisId: "H1,H2",
      location: "vite.config.ts:8",
      message: "Resolved Vite base config",
      data: {
        command,
        mode,
        isVercel,
        base,
        nodeEnv: process.env.NODE_ENV,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        "/api": {
          target: "http://localhost:8080",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
