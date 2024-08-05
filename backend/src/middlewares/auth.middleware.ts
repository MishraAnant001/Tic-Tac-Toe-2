import { NextFunction, Response } from "express";
import config from "config"
import jwt from "jsonwebtoken"
import { IRequest } from "../interfaces";
import { ERROR_CODES, AUTH_MESSAGES } from "../constants";
import { ApiError } from "../utils";

export const authenticate = (req: IRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            throw new ApiError(ERROR_CODES.UNAUTHORIZED, AUTH_MESSAGES.UNAUTHORIZED)
        }
        const secretkey: string = config.get("ACCESS_SECRET_KEY")
        const decoded = jwt.verify(token,secretkey)
        req.userid = (decoded as {userid:string}).userid
        req.role = (decoded as {role:string}).role
        next()

    } catch (error) {
        if(error.name=="TokenExpiredError"){
            return res.status(ERROR_CODES.UNAUTHORIZED).json({
                success:false,
                message:AUTH_MESSAGES.ACCESS_TOKEN_EXPIRED
            })
        }
        else if(error.name=="JsonWebTokenError"){
            return res.status(ERROR_CODES.UNAUTHORIZED).json({
                success:false,
                message:AUTH_MESSAGES.ACCESS_TOKEN_INVALID
            })
        }else{
            next(error)
        }
    }
}

export const authorize = (allowedRoles: string[]) => {
    return (req: IRequest, res: Response, next: NextFunction) => {
        if (!allowedRoles.includes(req.role!)) {
            throw new ApiError(ERROR_CODES.FORBIDDEN, AUTH_MESSAGES.UNAUTHORIZED)
        }
        next()
    }
}