import Elysia from "elysia"
import { db } from "../../db/connection"
import { auth } from "../auth"
import { UnauthorizedError } from "../errors/unauthorized-error"

export const getManagedRestaurant = new Elysia()
  .use(auth)
  .get("/managed-restaurant", async ({ getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const managedRestaurant = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, restaurantId)
      },
    })

    return { managedRestaurant }
  })
