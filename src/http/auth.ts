import cookie from "@elysiajs/cookie"
import jwt from "@elysiajs/jwt"
import Elysia, { t } from "elysia"
import { env } from "../env/schema"

export const auth = new Elysia()
  .use(
    jwt({
      secret: {
        priv: env.JWT_PRIVATE_KEY,
        pub: env.JWT_PUBLIC_KEY,
      },
      alg: "RS256",
      schema: t.Object({
        sub: t.String(),
        restaurantId: t.Optional(t.String()),
      }),
    })
  )
  .use(cookie())
