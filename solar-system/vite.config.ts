import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@engine": path.resolve(__dirname, "../engine/src"),
    },
  },
  server: {
    fs: {
      allow: [".."],
    },
  },
  // Add this block to bypass the crashing dependency scanner
  optimizeDeps: {
    exclude: ["@engine", "../engine/src"],
  },
});
