import { and, count, desc, eq, ilike, sql } from "drizzle-orm"
import Elysia from "elysia"
import z from "zod"
import { db } from "../../db/connection"
import { orderStatusEnum, orders, users } from "../../db/schemas"
import { auth } from "../auth"
import { UnauthorizedError } from "../errors/unauthorized-error"

export const fetchOrders = new Elysia().use(auth).get(
  "/orders",
  async ({ getCurrentUser, query }) => {
    const { orderId, pageIndex, customerName, status } = query
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const baseQuery = db
      .select({
        orderId: orders.id,
        status: orders.status,
        createdAt: orders.createdAt,
        total: orders.totalInCents,
        customerName: users.name,
      })
      .from(orders)
      .innerJoin(users, eq(users.id, orders.customerId))
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          status ? eq(orders.status, status) : undefined,
          orderId ? ilike(orders.id, `%${orderId}%`) : undefined,
          customerName ? ilike(users.name, `%${customerName}%`) : undefined
        )
      )

    const [amountOfOrdersQuery, allOrders] = await Promise.all([
      db.select({ count: count() }).from(baseQuery.as("baseQuery")),
      db
        .select()
        .from(baseQuery.as("baseQuery"))
        .offset(pageIndex * 10)
        .limit(10)
        .orderBy((fields) => {
          return [
            sql`CASE ${fields.status}
              WHEN 'pending' THEN 1
              WHEN 'processing' THEN 2
              WHEN 'delivering' THEN 3
              WHEN 'delivered' THEN 4
              WHEN 'canceled' THEN 99
              END
            `,
            desc(fields.createdAt),
          ]
        }),
    ])

    const amountOfOrders = amountOfOrdersQuery[0]?.count ?? 0

    return {
      orders: allOrders,
      meta: {
        pageIndex,
        perPage: 10,
        totalCount: amountOfOrders,
      },
    }
  },
  {
    query: z.object({
      orderId: z.string().optional(),
      pageIndex: z.coerce.number().min(0),
      status: z.enum(orderStatusEnum.enumValues).optional(),
      customerName: z.string().optional(),
    }),
  }
)
