"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message = "something went wrong") {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
}
exports.ApiError = ApiError;
