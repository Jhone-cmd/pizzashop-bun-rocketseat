import { createId as cuid } from "@paralleldrive/cuid2"
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { restaurants } from "./restaurants"

export const products = pgTable("products", {
  id: text("id")
    .$defaultFn(() => cuid())
    .primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  priceInCents: integer("price_in_cents").notNull(),
  restaurantId: text("restaurant_id")
    .references(() => restaurants.id, {
      onDelete: "cascade",
    })
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
