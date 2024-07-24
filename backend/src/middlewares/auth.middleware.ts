import { NextFunction, Response } from "express";
import { IRequest } from "../interfaces";
import config from "config"
import jwt from "jsonwebtoken"
import { ApiError } from "../utils";
import { AUTH_MESSAGES, ERROR_CODES } from "../constants";

export const authenticate = (req: IRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1] || "";

        if (!token) {
            throw new ApiError(ERROR_CODES.UNAUTHORIZED, AUTH_MESSAGES.UNAUTHORIZED)
        }
        const secretkey: string = config.get("SECRET_KEY")
        jwt.verify(token, secretkey, (error: any, user: any) => {
            if (error) {
                throw new ApiError(ERROR_CODES.FORBIDDEN, AUTH_MESSAGES.TOKEN_INVALID)
            }
            req.userid = user.userid
            req.role = user.role
            next()
        })

    } catch (error) {
        next(error)
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