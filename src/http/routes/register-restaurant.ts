import Elysia from "elysia"
import z from "zod"
import { db } from "../../db/connection"
import { restaurants } from "../../db/schemas"
import { users } from "../../db/schemas/users"

export const registerRestaurant = new Elysia().post(
  "/restaurants",
  async ({ body, set }) => {
    const { restaurantName, name, email, phone } = body

    const [manager] = await db
      .insert(users)
      .values([
        {
          name,
          email,
          phone,
          role: "manager",
        },
      ])
      .returning({
        id: users.id,
      })

    await db.insert(restaurants).values([
      {
        name: restaurantName,
        managerId: manager?.id,
      },
    ])

    set.status = 204
  },
  {
    body: z.object({
      name: z.string(),
      email: z.email(),
      phone: z.string(),
      restaurantName: z.string(),
    }),
  }
)
