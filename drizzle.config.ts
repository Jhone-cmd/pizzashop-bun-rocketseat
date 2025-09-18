import { type Config, defineConfig } from "drizzle-kit"
import { env } from "./src/env/schema"

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schemas/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
}) satisfies Config
