import { Router } from "express";
import { UserController } from "../controllers";
import { authenticate, authorize } from "../middlewares";

export const userRouter = Router()

const controller= new UserController()

userRouter.post("/login",controller.loginUser);
userRouter.post("/login/social",controller.socialLogin);
userRouter.post("/signup",controller.signupUser);
userRouter.get("/",authenticate,authorize(['admin']),controller.getAllUsers)
userRouter.delete("/:id",authenticate,authorize(['admin']),controller.deleteUser)
userRouter.post("/generate-token",controller.generateAccessToken)