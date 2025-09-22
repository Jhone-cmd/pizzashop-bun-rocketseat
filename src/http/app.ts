import { Elysia } from "elysia"
import { registerRestaurant } from "./routes/register-restaurant"
import { sendAuthLink } from "./routes/send-auth-link"

export const app = new Elysia()
app.use(registerRestaurant)
app.use(sendAuthLink)
