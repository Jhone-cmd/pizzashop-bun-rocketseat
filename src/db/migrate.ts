import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import postgres from "postgres"
import { env } from "../env/schema"

const connection = postgres(env.DATABASE_URL)
const db = drizzle(connection)

await migrate(db, { migrationsFolder: "drizzle" })

await connection.end()

process.exit()
