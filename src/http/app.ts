import jwt from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { env } from "../env/schema"
import { registerRestaurant } from "./routes/register-restaurant"
import { sendAuthLink } from "./routes/send-auth-link"

export const app = new Elysia()

app.use(
  jwt({
    name: "jwt",
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

app.use(registerRestaurant)
app.use(sendAuthLink)
