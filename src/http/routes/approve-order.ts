import { eq } from "drizzle-orm"
import Elysia from "elysia"
import z from "zod"
import { db } from "../../db/connection"
import { orders } from "../../db/schemas"
import { auth } from "../auth"
import { UnauthorizedError } from "../errors/unauthorized-error"

export const approveOrder = new Elysia().use(auth).patch(
  "/orders/:orderId/approve",
  async ({ getCurrentUser, params, set }) => {
    const { orderId } = params
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const order = await db.query.orders.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, orderId)
      },
    })

    if (!order) {
      set.status = 400

      return { message: "Order not found." }
    }

    if (order.status !== "pending") {
      set.status = 400

      return { message: "You can only approve pending orders." }
    }

    await db
      .update(orders)
      .set({ status: "processing" })
      .where(eq(orders.id, orderId))
  },
  {
    params: z.object({
      orderId: z.cuid2(),
    }),
  }
)
