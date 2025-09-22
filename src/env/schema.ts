import z from "zod"

const envSchema = z.object({
  BASE_URL: z.url(),
  AUTH_REDIRECT_URL: z.url(),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.url(),
})

export const env = envSchema.parse(process.env)
