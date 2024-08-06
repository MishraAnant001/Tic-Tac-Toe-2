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
exports.UserController = void 0;
const services_1 = require("../services");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const service = new services_1.UserService();
class UserController {
    signupUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const response = yield service.signupUser(data);
                res.status(response.statusCode).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
    loginUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const response = yield service.loginUser(data);
                res.status(response.statusCode).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
    socialLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const response = yield service.socialLogin(data);
                res.status(response.statusCode).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAllUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield service.getAllUsers();
                res.status(response.statusCode).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const response = yield service.deleteUser(id);
                res.status(response.statusCode).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
    generateAccessToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.body;
                if (!refreshToken) {
                    throw new utils_1.ApiError(constants_1.ERROR_CODES.NOT_FOUND, constants_1.AUTH_MESSAGES.NOT_FOUND);
                }
                const secretKey = config_1.default.get("REFRESH_SECRET_KEY");
                const decoded = jsonwebtoken_1.default.verify(refreshToken, secretKey);
                const id = decoded.userid;
                const response = yield service.generateAccessToken(id);
                res.status(response.statusCode).json(response);
            }
            catch (error) {
                if (error.name == "TokenExpiredError") {
                    return res.status(constants_1.ERROR_CODES.UNAUTHORIZED).json({
                        success: false,
                        message: constants_1.AUTH_MESSAGES.REFRESH_TOKEN_EXPIRED
                    });
                }
                else if (error.name == "JsonWebTokenError") {
                    return res.status(constants_1.ERROR_CODES.UNAUTHORIZED).json({
                        success: false,
                        message: constants_1.AUTH_MESSAGES.REFRESH_TOKEN_INVALID
                    });
                }
                else {
                    next(error);
                }
            }
        });
    }
}
exports.UserController = UserController;
