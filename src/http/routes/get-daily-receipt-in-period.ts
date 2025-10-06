import dayjs from "dayjs"
import { and, eq, gte, lte, sql, sum } from "drizzle-orm"
import Elysia from "elysia"
import z from "zod"
import { db } from "../../db/connection"
import { orders } from "../../db/schemas"
import { auth } from "../auth"
import { UnauthorizedError } from "../errors/unauthorized-error"

export const getDailyInPeriod = new Elysia().use(auth).get(
  "/metrics/get-daily-in-period",
  async ({ getCurrentUser, query, set }) => {
    const { restaurantId } = await getCurrentUser()

    const { from, to } = query

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const startDate = from ? dayjs(from) : dayjs().subtract(7, "days")
    const endDate = to ? dayjs(to) : from ? startDate.add(7, "days") : dayjs()

    if (endDate.diff(startDate, "days") > 7) {
      set.status = 400

      return {
        message: "You cannot list receipt in a larger period than 7 days.",
      }
    }

    const receiptPerDay = await db
      .select({
        date: sql<string>`TO_CHAR(${orders.createdAt}, 'DD/MM')`,
        receipt: sum(orders.totalInCents).mapWith(Number),
      })
      .from(orders)
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          gte(
            orders.createdAt,
            startDate
              .startOf("day")
              .add(startDate.utcOffset(), "minutes")
              .toDate()
          ),
          lte(
            orders.createdAt,
            endDate.endOf("day").add(startDate.utcOffset(), "minutes").toDate()
          )
        )
      )
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'DD/MM')`)

    const orderedReceiptPerDay = receiptPerDay.sort((a, b) => {
      const [dayA, monthA] = a.date.split("/").map(Number)
      const [dayB, monthB] = b.date.split("/").map(Number)

      if (monthA === monthB) {
        return (dayA ?? 0) - (dayB ?? 0)
      }

      // Ensure monthA and monthB are defined and valid numbers
      const safeMonthA =
        typeof monthA === "number" && !isNaN(monthA) ? monthA : 1
      const safeMonthB =
        typeof monthB === "number" && !isNaN(monthB) ? monthB : 1

      const dateA = new Date(2024, safeMonthA - 1)
      const dateB = new Date(2024, safeMonthB - 1)

      return dateA.getTime() - dateB.getTime()
    })

    return { orderedReceiptPerDay }
  },
  {
    query: z.object({
      from: z.string().optional(),
      to: z.string().optional(),
    }),
  }
)
