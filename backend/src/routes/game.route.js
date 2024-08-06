"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
exports.gameRouter = (0, express_1.Router)();
// const auth = new Authentication()
const controller = new controllers_1.GameController();
exports.gameRouter.post("/create", middlewares_1.authenticate, (0, middlewares_1.authorize)(['user']), controller.createGame);
exports.gameRouter.post("/make-move", middlewares_1.authenticate, (0, middlewares_1.authorize)(['user']), controller.makeMove);
exports.gameRouter.get("/", middlewares_1.authenticate, (0, middlewares_1.authorize)(['admin']), controller.getAllGames);
exports.gameRouter.get("/:id", middlewares_1.authenticate, (0, middlewares_1.authorize)(['user']), controller.getGame);
