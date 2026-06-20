import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.ts"],
      exclude: [
        "src/server.ts",
        "src/models/**",
        "src/config/**",
        "src/prisma.config.ts",
      ],
      thresholds: {
        lines: 17,
        functions: 5,
        statements: 16,
        branches: 4,
      },
    },
  },
});
