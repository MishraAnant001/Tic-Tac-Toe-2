import { NextFunction, Request, Response } from "express";
import { UserService } from "../services";
import { ICredentials, IUser } from "../interfaces";

const service = new UserService()

export class UserController{
    async signupUser(req:Request,res:Response,next:NextFunction){
        try {
            const data:IUser = req.body
            console.log(data);
            const response = await service.signupUser(data);
            res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    }
    async loginUser(req:Request,res:Response,next:NextFunction){
        try {
            const data:ICredentials = req.body
            const response = await service.loginUser(data);
            res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    }
    async getAllUsers(req:Request,res:Response,next:NextFunction){
        try {
            const response = await service.getAllUsers();
            res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    }
    async deleteUser(req:Request,res:Response,next:NextFunction){
        try {
            const {id} =req.params
            const response = await service.deleteUser(id);
            res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    }
}