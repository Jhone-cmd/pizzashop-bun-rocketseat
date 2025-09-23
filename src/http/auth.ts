import crypto from "node:crypto"
import jwt from "@elysiajs/jwt"
import Elysia, { t } from "elysia"
import { env } from "../env/schema"

const keyBuffer = Buffer.from(env.JWT_PRIVATE_KEY, "base64")

// 2. Cria o KeyObject a partir do buffer
const privateKey = crypto.createPrivateKey({
  key: keyBuffer,
  format: "der", // Use "der" para chaves em formato binário (decodificadas de Base64)
  type: "pkcs8", // O tipo de chave (Private Key)
})

export const auth = new Elysia().use(
  jwt({
    secret: privateKey, // Use the KeyObject directly
    alg: "RS256",
    schema: t.Object({
      sub: t.String(),
      restaurantId: t.Optional(t.String()),
    }),
  })
)
