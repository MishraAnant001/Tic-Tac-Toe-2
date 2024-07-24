import { Router } from "express"
import { gameRouter } from "./game.route"
import { userRouter } from "./user.route"
import { dashboardRouter } from "./dashboard.route"

export const mainRouter= Router()

mainRouter.use("/api/v1/game",gameRouter)
mainRouter.use("/api/v1/user",userRouter)
mainRouter.use("/api/v1/dashboard",dashboardRouter)