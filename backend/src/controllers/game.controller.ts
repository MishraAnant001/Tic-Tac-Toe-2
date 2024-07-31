import { NextFunction, Request, Response } from "express";
import { ICreateGameRequest, IMakeMoveRequest, IRequest } from "../interfaces";
import { GameService } from "../services";
import { SUCCESS_CODES } from "../constants";
const service = new GameService()
export class GameController{
    async createGame(req:IRequest,res:Response,next:NextFunction){
        try {
            const data:ICreateGameRequest = req.body
            const response = await service.createGame(req.userid!,data.gridSize,data.players)
            res.status(SUCCESS_CODES.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    async makeMove(req:Request,res:Response,next:NextFunction){
        try {
            const data:IMakeMoveRequest = req.body
            const response = await service.makeMove(data.gameId,data.row,data.col)
            res.status(SUCCESS_CODES.OK).json(response)
        } catch (error) {
            next(error)
        }
    }
    async getAllGames(req:Request,res:Response,next:NextFunction){
        try {
            const response = await service.getAllGames()
            res.status(SUCCESS_CODES.OK).json(response)
        } catch (error) {
            next(error)
        }
    }
    async getGame(req:Request,res:Response,next:NextFunction){
        try {
            const {id}=req.params
            const response = await service.getGame(id)
            res.status(SUCCESS_CODES.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

}