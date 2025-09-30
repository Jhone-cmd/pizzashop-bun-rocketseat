import { Elysia } from "elysia"
import { approveOrder } from "./routes/approve-order"
import { authenticateFromLink } from "./routes/authenticate-from-link"
import { getManagedRestaurant } from "./routes/get-managed-restaurant"
import { getOrderDetails } from "./routes/get-order-details"
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
app.use(getManagedRestaurant)
app.use(getOrderDetails)
app.use(approveOrder)

app.onError(({ error, code, set }) => {
  switch (code) {
    case "VALIDATION": {
      set.status = error.status
      return error.toResponse()
    }

    default: {
      console.error(error)
      return new Response(null, { status: 500 })
    }
  }
})
