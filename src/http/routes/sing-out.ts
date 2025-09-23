import Elysia from "elysia"
import { auth } from "../auth"

export const singOut = new Elysia()
  .use(auth)
  .post("/sing-out", async ({ singOut: internalSingOut }) => {
    internalSingOut()
  })
