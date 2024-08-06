"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const authenticate = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            throw new utils_1.ApiError(constants_1.ERROR_CODES.UNAUTHORIZED, constants_1.AUTH_MESSAGES.UNAUTHORIZED);
        }
        const secretkey = config_1.default.get("ACCESS_SECRET_KEY");
        const decoded = jsonwebtoken_1.default.verify(token, secretkey);
        req.userid = decoded.userid;
        req.role = decoded.role;
        next();
    }
    catch (error) {
        if (error.name == "TokenExpiredError") {
            return res.status(constants_1.ERROR_CODES.UNAUTHORIZED).json({
                success: false,
                message: constants_1.AUTH_MESSAGES.ACCESS_TOKEN_EXPIRED
            });
        }
        else if (error.name == "JsonWebTokenError") {
            return res.status(constants_1.ERROR_CODES.UNAUTHORIZED).json({
                success: false,
                message: constants_1.AUTH_MESSAGES.ACCESS_TOKEN_INVALID
            });
        }
        else {
            next(error);
        }
    }
};
exports.authenticate = authenticate;
const authorize = (allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.role)) {
            throw new utils_1.ApiError(constants_1.ERROR_CODES.FORBIDDEN, constants_1.AUTH_MESSAGES.UNAUTHORIZED);
        }
        next();
    };
};
exports.authorize = authorize;
