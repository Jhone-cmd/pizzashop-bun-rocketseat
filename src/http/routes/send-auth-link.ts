import { createId as cuid } from "@paralleldrive/cuid2"
import Elysia from "elysia"
import z from "zod"
import { db } from "../../db/connection"
import { authLinks } from "../../db/schemas/auth-links"
import { env } from "../../env/schema"

export const sendAuthLink = new Elysia().post(
  "/authenticate",
  async ({ body }) => {
    const { email } = body

    const userFromEmail = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.email, email)
      },
    })

    if (!userFromEmail) {
      throw new Error("User not found")
    }

    const authLinkCode = cuid()

    await db.insert(authLinks).values({
      userId: userFromEmail.id,
      code: authLinkCode,
    })

    // Enviar Email

    const authLink = new URL("/auth-links/authenticate", env.BASE_URL)

    authLink.searchParams.set("code", authLinkCode)
    authLink.searchParams.set("redirect", env.AUTH_REDIRECT_URL)

    console.log(authLink.toString())
  },
  {
    body: z.object({
      email: z.email(),
    }),
  }
)
