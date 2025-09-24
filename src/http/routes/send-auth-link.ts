import { createId as cuid } from "@paralleldrive/cuid2"
import Elysia from "elysia"
import nodemailer from "nodemailer"
import z from "zod"
import { db } from "../../db/connection"
import { authLinks } from "../../db/schemas/auth-links"
import { env } from "../../env/schema"
import { mail } from "../../lib/mail"

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

    const authLink = new URL("/auth-links/authenticate", env.BASE_URL)

    authLink.searchParams.set("code", authLinkCode)
    authLink.searchParams.set("auth_redirect", env.AUTH_REDIRECT_URL)

    //console.log(authLink.toString())

    // Enviar Email
    const info = await mail.sendMail({
      from: {
        name: "Pizza Shop",
        address: "suporte@pizzashop.com.br",
      },
      to: email,
      subject: "Authenticate to Pizza Shop",
      html: `
        <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
          <p>Dear.</p>
          <p>We hope you are well.</p>
          <p></p>
          <p>Thank you for registering and being part of our team.</p>
          <p>Please, use the link below to log in to Pizza Shop.</p>
          <p></p>
          <p>
            <a href="${authLink.toString()}">Access - Pizza Shop</a>
          </p>
          <p></p>
          <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
        </div>`.trim(),
    })
    console.log(nodemailer.getTestMessageUrl(info))
  },
  {
    body: z.object({
      email: z.email(),
    }),
  }
)
