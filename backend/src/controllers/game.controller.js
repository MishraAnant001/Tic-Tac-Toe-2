"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
const services_1 = require("../services");
const constants_1 = require("../constants");
const service = new services_1.GameService();
class GameController {
    createGame(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const response = yield service.createGame(req.userid, data.gridSize, data.players);
                res.status(constants_1.SUCCESS_CODES.OK).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
    makeMove(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const response = yield service.makeMove(data.gameId, data.row, data.col);
                res.status(constants_1.SUCCESS_CODES.OK).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAllGames(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield service.getAllGames();
                res.status(constants_1.SUCCESS_CODES.OK).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getGame(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const response = yield service.getGame(id);
                res.status(constants_1.SUCCESS_CODES.OK).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.GameController = GameController;
