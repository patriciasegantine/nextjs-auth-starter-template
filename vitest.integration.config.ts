import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.integration.test.ts"],
    testTimeout: 15000,
    // Integration tests write real rows and share the rate-limit table,
    // so they can't run concurrently against the same database.
    fileParallelism: false,
  },
});
