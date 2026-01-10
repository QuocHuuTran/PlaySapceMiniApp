import { defineConfig } from "vite";
import zaloMiniApp from "zmp-vite-plugin";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    root: "./src",
    base: "./",
    plugins: [zaloMiniApp(), react()],
    build: {
      target: "es2015",
      assetsInlineLimit: 0,
      polyfillModulePreload: false,
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].[hash].module.js",
        chunkFileNames: "assets/[name].[hash].module.js",
        assetFileNames: "assets/[name].[hash].[ext]",
        format: "iife",
      },
    },
    },
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  });
};
