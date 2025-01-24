import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "tests/setup.ts",
    // my trial code about sourcemaps
    server: { sourcemap: false },
  },
});
