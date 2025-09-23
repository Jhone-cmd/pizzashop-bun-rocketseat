import dayjs from "dayjs"
import { eq } from "drizzle-orm"
import Elysia from "elysia"
import z from "zod"
import { db } from "../../db/connection"
import { authLinks } from "../../db/schemas"
import { auth } from "../auth"

export const authenticateFromLink = new Elysia().use(auth).get(
  "/auth-links/authenticate",
  async ({ query, singIn, redirect }) => {
    const { code, auth_redirect } = query

    const authLinkFromCode = await db.query.authLinks.findFirst({
      where(fields, { eq }) {
        return eq(fields.code, code)
      },
    })

    if (!authLinkFromCode) {
      throw new Error("Auth link not found.")
    }

    const daysSinceAuthLinkWasCreated = dayjs().diff(
      authLinkFromCode.createdAt,
      "days"
    )

    if (daysSinceAuthLinkWasCreated > 7) {
      throw new Error("Auth link expired, please generate a new one.")
    }

    const manageRestaurant = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.managerId, authLinkFromCode.userId)
      },
    })

    singIn({
      sub: authLinkFromCode.userId,
      restaurantId: manageRestaurant?.id,
    })

    await db.delete(authLinks).where(eq(authLinks.code, code))

    redirect(auth_redirect)
  },
  {
    query: z.object({
      code: z.string(),
      auth_redirect: z.string(),
    }),
  }
)
