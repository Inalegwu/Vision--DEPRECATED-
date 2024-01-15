import react from "@vitejs/plugin-react";
import { defineConfig, externalizeDepsPlugin, loadEnv } from "electron-vite";
import { resolve } from "path";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode);
  return {
    main: {
      plugins: [externalizeDepsPlugin()],
      build: {
        lib: {
          entry: "src/main.ts",
        },
        rollupOptions: {
          external: ["better-sqlite3", "node-unrar-js"],
        },
      },
      resolve: {
        alias: {
          "@src": resolve(__dirname, "src/"),
          "@shared": resolve(__dirname, "src/shared/"),
          "@components": resolve(__dirname, "src/web/components/"),
          "@assets": resolve(__dirname, "src/assets/"),
        },
      },
    },
    preload: {
      plugins: [externalizeDepsPlugin()],
      build: {
        lib: {
          entry: "src/preload.ts",
        },
      },
    },
    renderer: {
      root: "src/web/",
      resolve: {
        alias: {
          "@src": resolve(__dirname, "src/"),
          "@shared": resolve(__dirname, "src/shared/"),
          "@components": resolve(__dirname, "src/web/components/"),
          "@assets": resolve(__dirname, "src/assets/"),
        },
      },
      plugins: [react()],
      build: {
        outDir: "out/renderer",
        rollupOptions: {
          input: "./src/web/index.html",
        },
      },
    },
  };
});
