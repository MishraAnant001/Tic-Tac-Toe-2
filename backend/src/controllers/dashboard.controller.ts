import { NextFunction, Response } from "express"
import { IRequest } from "../interfaces"
import { DashboardService } from "../services"

const service = new DashboardService()

export class DashboardController{
    async getAdminDashboard(req:IRequest,res:Response,next:NextFunction){
        try {
            const response = await service.getAdminDashBoard()
            res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    }
}