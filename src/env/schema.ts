import z from "zod"

const envSchema = z.object({
  BASE_URL: z.url(),
  AUTH_REDIRECT_URL: z.url(),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.url(),
  JWT_PRIVATE_KEY: z.base64(),
  JWT_PUBLIC_KEY: z.base64(),
})

export const env = envSchema.parse(process.env)
