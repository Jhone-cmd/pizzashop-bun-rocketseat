import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { env } from "../env/schema"
import * as schema from "./schemas"

const connection = postgres(env.DATABASE_URL)
export const db = drizzle(connection, { schema })
