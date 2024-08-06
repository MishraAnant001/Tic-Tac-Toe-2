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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const db_1 = require("./src/db");
const cors_1 = __importDefault(require("cors"));
const constants_1 = require("./src/constants");
const middlewares_1 = require("./src/middlewares");
const routes_1 = require("./src/routes");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(routes_1.mainRouter);
app.use(middlewares_1.errorHandler);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const port = config_1.default.get("PORT");
        const url = config_1.default.get("MONGO_URI");
        yield (0, db_1.connectDB)(url);
        console.log(constants_1.DB_MESSAGES.CONNECT_SUCCESS);
        app.listen(port, () => {
            console.log(constants_1.SERVER_MESSAGES.START_SUCCESS, port);
        });
    }
    catch (error) {
        console.log(constants_1.DB_MESSAGES.CONNECT_ERROR, error.message);
    }
}))();
