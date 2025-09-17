import { env } from "../env/schema"
import { app } from "./app"

app.listen(env.PORT, () => {
  console.log("Server is running!🚀")
})
