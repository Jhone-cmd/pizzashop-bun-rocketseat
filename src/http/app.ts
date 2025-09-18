import { Elysia } from "elysia"
import { registerRestaurant } from "./routes/register-restaurant"

export const app = new Elysia()
app.use(registerRestaurant)
