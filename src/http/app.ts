import { Elysia } from "elysia"
import { approveOrder } from "./routes/approve-order"
import { authenticateFromLink } from "./routes/authenticate-from-link"
import { cancelOrder } from "./routes/cancel-order"
import { deliverOrder } from "./routes/deliver-order"
import { dispatchOrder } from "./routes/dispatch-order"
import { fetchOrders } from "./routes/fetch-orders"
import { getMonthReceipt } from "./routes/get -month-receipt"
import { getDayOrdersAmount } from "./routes/get-day-orders-amount"
import { getManagedRestaurant } from "./routes/get-managed-restaurant"
import { getMonthOrdersAmount } from "./routes/get-month-orders-amount"
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
app.use(dispatchOrder)
app.use(deliverOrder)
app.use(cancelOrder)
app.use(fetchOrders)
app.use(getMonthReceipt)
app.use(getDayOrdersAmount)
app.use(getMonthOrdersAmount)

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
