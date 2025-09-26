import { createId as cuid } from "@paralleldrive/cuid2"
import { relations } from "drizzle-orm"
import { integer, pgTable, text } from "drizzle-orm/pg-core"
import { orders, products } from "."

export const orderItems = pgTable("order_items", {
  id: text("id")
    .$defaultFn(() => cuid())
    .primaryKey(),
  orderId: text("order_id")
    .references(() => orders.id, {
      onDelete: "cascade",
    })
    .notNull(),
  productId: text("product_id").references(() => products.id, {
    onDelete: "set null",
  }),
  priceInCents: integer("price_in_cents").notNull(),
  quantity: integer("quantity").notNull(),
})

export const ordersItemsRelations = relations(orderItems, ({ one }) => {
  return {
    product: one(products, {
      fields: [orderItems.productId],
      references: [products.id],
      relationName: "order_items_product",
    }),
    order: one(orders, {
      fields: [orderItems.orderId],
      references: [orders.id],
      relationName: "order_items_order",
    }),
  }
})
