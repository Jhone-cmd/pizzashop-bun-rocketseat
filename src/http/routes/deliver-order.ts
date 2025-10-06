import { eq } from "drizzle-orm"
import Elysia from "elysia"
import z from "zod"
import { db } from "../../db/connection"
import { orders } from "../../db/schemas"
import { auth } from "../auth"
import { UnauthorizedError } from "../errors/unauthorized-error"

export const deliverOrder = new Elysia().use(auth).patch(
  "/orders/:orderId/deliver",
  async ({ getCurrentUser, params, set }) => {
    const { orderId } = params
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const order = await db.query.orders.findFirst({
      where(fields, { eq, and }) {
        return and(
          eq(fields.id, orderId),
          eq(fields.restaurantId, restaurantId)
        )
      },
    })

    if (!order) {
      set.status = 400

      return { message: "Order not found." }
    }

    if (order.status !== "delivering") {
      set.status = 400

      return {
        message:
          "You cannot delivered orders that are not in 'delivering' status.",
      }
    }

    await db
      .update(orders)
      .set({ status: "delivered" })
      .where(eq(orders.id, orderId))
  },
  {
    params: z.object({
      orderId: z.cuid2(),
    }),
  }
)
