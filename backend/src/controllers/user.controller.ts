import { NextFunction, Request, Response } from "express";
import { UserService } from "../services";
import { ICredentials, IUser } from "../interfaces";
import { ERROR_CODES, AUTH_MESSAGES } from "../constants";
import { ApiError } from "../utils";
import jwt from "jsonwebtoken"
import config from "config"

const service = new UserService()

export class UserController{
    async signupUser(req:Request,res:Response,next:NextFunction){
        try {
            const data:IUser = req.body
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
    async socialLogin(req:Request,res:Response,next:NextFunction){
        try {       
            const data:IUser = req.body
            const response = await service.socialLogin(data);
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

    async generateAccessToken(req:Request,res:Response,next:NextFunction){
        try {
            const {refreshToken} = req.body
            if(!refreshToken){
                throw new ApiError(ERROR_CODES.NOT_FOUND,AUTH_MESSAGES.NOT_FOUND)
            }
            const secretKey:string = config.get("REFRESH_SECRET_KEY")
            const decoded = jwt.verify(refreshToken,secretKey)
            const id = (decoded as {userid:string}).userid
            const response = await service.generateAccessToken(id);
            res.status(response.statusCode).json(response)
        } catch (error) {
            if(error.name=="TokenExpiredError"){
                return res.status(ERROR_CODES.UNAUTHORIZED).json({
                    success:false,
                    message:AUTH_MESSAGES.REFRESH_TOKEN_EXPIRED
                })
            }
            else if(error.name=="JsonWebTokenError"){
                return res.status(ERROR_CODES.UNAUTHORIZED).json({
                    success:false,
                    message:AUTH_MESSAGES.REFRESH_TOKEN_INVALID
                })
            }else{
                next(error)
            }
        }
    }
}