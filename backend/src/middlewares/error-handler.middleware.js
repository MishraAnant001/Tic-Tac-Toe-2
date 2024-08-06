"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const errorHandler = (error, req, res, next) => {
    // console.log(error.message );
    if (error instanceof utils_1.ApiError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }
    if (error.code == 11000) {
        return res.status(constants_1.ERROR_CODES.BAD_REQUEST).json({
            success: false,
            message: "User with email already exists!"
        });
    }
    console.log(error);
    return res.status(constants_1.ERROR_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
    });
    // next(error)
};
exports.errorHandler = errorHandler;
