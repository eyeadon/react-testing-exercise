import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This is the default value, and will add all files with node_modules
    // in their paths to the ignore list.
    sourcemapIgnoreList(sourcePath, sourcemapPath) {
      return sourcePath.includes("node_modules");
    },
  },
  css: { devSourcemap: false },
  build: { sourcemap: false },
});
