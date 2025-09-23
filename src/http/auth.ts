import crypto from "node:crypto"
import jwt from "@elysiajs/jwt"
import Elysia, { type Static, t } from "elysia"
import { env } from "../env/schema"

const keyBuffer = Buffer.from(env.JWT_PRIVATE_KEY, "base64")

// 2. Cria o KeyObject a partir do buffer
const privateKey = crypto.createPrivateKey({
  key: keyBuffer,
  format: "der", // Use "der" para chaves em formato binário (decodificadas de Base64)
  type: "pkcs8", // O tipo de chave (Private Key)
})

const jwtPayload = t.Object({
  sub: t.String(),
  restaurantId: t.Optional(t.String()),
})

export const auth = new Elysia()
  .use(
    jwt({
      secret: privateKey, // Use the KeyObject directly
      alg: "RS256",
      schema: jwtPayload,
    })
  )
  .derive(
    { as: "scoped" },
    ({ jwt: { sign, verify }, cookie: { authCookie } }) => {
      return {
        singIn: async (payload: Static<typeof jwtPayload>) => {
          const token = await sign(payload)

          authCookie?.set({
            value: token,
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7, // 7 days,
            path: "/",
          })
        },

        singOut: async () => {
          authCookie?.remove()
        },

        getCurrentUser: async () => {
          if (!authCookie?.value) {
            throw new Error("No token found in cookie")
          }

          try {
            // Verify the token using the privateKey (public verification in RS256)
            const payload = await verify(authCookie.value as string)

            if (!payload) {
              throw new Error("Token verification failed")
            }

            return {
              userId: payload.sub,
              restaurantId: payload.restaurantId,
            }
          } catch (error) {
            console.error("Error verifying token:", error)
            throw new Error("Unauthorized")
          }
        },
      }
    }
  )
