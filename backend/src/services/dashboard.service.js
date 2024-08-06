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
exports.DashboardService = void 0;
const constants_1 = require("../constants");
const models_1 = require("../models");
const utils_1 = require("../utils");
class DashboardService {
    getAdminDashBoard() {
        return __awaiter(this, void 0, void 0, function* () {
            const game = yield models_1.Game.find({});
            const users = yield models_1.User.find({ role: 'user' });
            const data = {
                games: game.length,
                users: users.length
            };
            return new utils_1.ApiResponse(constants_1.SUCCESS_CODES.OK, data, "Dashboard fetched successfully");
        });
    }
}
exports.DashboardService = DashboardService;
