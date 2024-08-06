"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    constructor(statusCode, data, message = "success") {
        this.success = true;
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        if (!data) {
            this.nbhits = 0;
        }
        else {
            if (Array.isArray(data)) {
                this.nbhits = data.length;
            }
            else {
                this.nbhits = 1;
            }
        }
    }
}
exports.ApiResponse = ApiResponse;
