import crypto from "node:crypto"
import jwt from "@elysiajs/jwt"
import Elysia, { type Static, t } from "elysia"
import { env } from "../env/schema"
import { UnauthorizedError } from "./errors/unauthorized-error"

// 1. Decodifica as chaves privadas e públicas
const privateKeyBuffer = Buffer.from(env.JWT_PRIVATE_KEY, "base64")
const publicKeyBuffer = Buffer.from(env.JWT_PUBLIC_KEY, "base64")

// 2. Cria os KeyObjects
const privateKey = crypto.createPrivateKey({
  key: privateKeyBuffer,
  format: "der",
  type: "pkcs8",
})

const publicKey = crypto.createPublicKey({
  key: publicKeyBuffer,
  format: "der",
  type: "spki",
})

const jwtPayload = t.Object({
  sub: t.String(),
  restaurantId: t.Optional(t.String()),
})

export const auth = new Elysia()
  .error({
    UNAUTHORIZED: UnauthorizedError,
  })
  .onError(({ error, code, set }) => {
    switch (code) {
      case "UNAUTHORIZED": {
        set.status = 401
        return { code, message: error.message }
      }
    }
  })
  .use(
    jwt({
      name: "signer", // Nome para o plugin de assinatura
      secret: privateKey, // Usa a chave privada para assinar
      alg: "RS256",
      schema: jwtPayload,
    })
  )
  .use(
    jwt({
      name: "verifier", // Nome para o plugin de verificação
      secret: publicKey, // Usa a chave pública para verificar
      alg: "RS256",
      schema: jwtPayload,
    })
  )
  .derive({ as: "scoped" }, ({ signer, verifier, cookie: { authCookie } }) => {
    return {
      singIn: async (payload: Static<typeof jwtPayload>) => {
        // Usa o plugin "signer" para criar o token
        const token = await signer.sign(payload)

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
          // Usa o plugin "verifier" para verificar o token
          const payload = await verifier.verify(authCookie.value as string)

          if (!payload) {
            throw new Error("Token verification failed")
          }

          return {
            userId: payload.sub,
            restaurantId: payload.restaurantId,
          }
        } catch (error) {
          console.error("Error verifying token:", error)
          throw new UnauthorizedError()
        }
      },
    }
  })
