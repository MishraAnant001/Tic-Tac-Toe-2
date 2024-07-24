import { Router } from "express";
import { authenticate, authorize } from "../middlewares";
import { DashboardController } from "../controllers";
export const dashboardRouter = Router()
const controller = new DashboardController()
dashboardRouter.get("/admin",authenticate,authorize(['admin']),controller.getAdminDashboard)