import { Router } from "express";
import { GameController } from "../controllers";
import { authenticate, authorize } from "../middlewares";
export const gameRouter = Router()
// const auth = new Authentication()
const controller= new GameController()
gameRouter.post("/create",authenticate,authorize(['user']),controller.createGame);
gameRouter.post("/make-move",authenticate,authorize(['user']),controller.makeMove);
gameRouter.get("/",authenticate,authorize(['admin']),controller.getAllGames)
gameRouter.get("/:id",authenticate,authorize(['user']),controller.getGame)