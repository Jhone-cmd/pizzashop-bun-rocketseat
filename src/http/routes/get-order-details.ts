import Elysia from "elysia"
import z from "zod"
import { db } from "../../db/connection"
import { auth } from "../auth"
import { UnauthorizedError } from "../errors/unauthorized-error"

export const getOrderDetails = new Elysia().use(auth).get(
  "/orders/:orderId",
  async ({ getCurrentUser, params, set }) => {
    const { orderId } = params
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const order = await db.query.orders.findFirst({
      columns: {
        id: true,
        totalInCents: true,
        status: true,
        createdAt: true,
      },
      with: {
        customer: {
          columns: {
            name: true,
            email: true,
            phone: true,
          },
        },
        ordersItems: {
          columns: {
            id: true,
            priceInCents: true,
            quantity: true,
          },
          with: {
            product: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
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

    return { order }
  },
  {
    params: z.object({
      orderId: z.cuid2(),
    }),
  }
)
