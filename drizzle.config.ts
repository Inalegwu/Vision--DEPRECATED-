import type { Config } from "drizzle-kit";

export default {
  schema: "./src/shared/schema/**/*.schema.ts",
  out: ".drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    url: "./storage.db",
  },
} satisfies Config;

