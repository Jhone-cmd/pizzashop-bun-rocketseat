import { Elysia } from "elysia"
import { authenticateFromLink } from "./routes/authenticate-from-link"
import { getProfile } from "./routes/get-profile"
import { registerRestaurant } from "./routes/register-restaurant"
import { sendAuthLink } from "./routes/send-auth-link"
import { singOut } from "./routes/sing-out"

export const app = new Elysia()

app.use(registerRestaurant)
app.use(sendAuthLink)
app.use(authenticateFromLink)
app.use(singOut)
app.use(getProfile)
