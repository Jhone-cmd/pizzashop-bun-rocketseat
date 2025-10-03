import dayjs from "dayjs"
import { and, count, eq, gte, sql } from "drizzle-orm"
import Elysia from "elysia"
import { db } from "../../db/connection"
import { orders } from "../../db/schemas"
import { auth } from "../auth"
import { UnauthorizedError } from "../errors/unauthorized-error"

export const getMonthOrdersAmount = new Elysia()
  .use(auth)
  .get("/metrics/get-month-orders-amount", async ({ getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const today = dayjs()
    const lastMonth = today.subtract(1, "month")
    const startOfLastMonth = lastMonth.startOf("month")

    const ordersPerMonth = await db
      .select({
        dayWithMonthAndYear: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
        amount: count(),
      })
      .from(orders)
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          gte(orders.createdAt, startOfLastMonth.toDate())
        )
      )
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`)

    const currentMonthWitYear = today.format("YYYY-MM")
    const lastMonthWitYear = lastMonth.format("YYYY-MM")

    const currentMonthOrdersAmount = ordersPerMonth.find((orderPerMonth) => {
      return orderPerMonth.dayWithMonthAndYear === currentMonthWitYear
    })

    const lastMonthOrdersAmount = ordersPerMonth.find((orderPerMonth) => {
      return orderPerMonth.dayWithMonthAndYear === lastMonthWitYear
    })

    const diffFromLastMonth =
      currentMonthOrdersAmount && lastMonthOrdersAmount
        ? (currentMonthOrdersAmount.amount * 100) / lastMonthOrdersAmount.amount
        : null

    return {
      receipt: currentMonthOrdersAmount?.amount,
      diffFromLastMonth: diffFromLastMonth
        ? Number((diffFromLastMonth - 100).toFixed(2))
        : 0,
    }
  })
