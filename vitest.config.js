import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.js"],
    include: ["tests/unit/**/*.{test,spec}.{js,jsx}", "tests/integration/**/*.{test,spec}.{js,jsx}"],
    exclude: ["tests/e2e/**"],
  },
});
