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
exports.UserService = void 0;
const models_1 = require("../models");
const utils_1 = require("../utils");
const config_1 = __importDefault(require("config"));
const constants_1 = require("../constants");
const auth_service_1 = require("./auth.service");
class UserService {
    signupUser(userdata) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.User.create(userdata);
            return new utils_1.ApiResponse(constants_1.SUCCESS_CODES.CREATED, user, "user registered successfully");
        });
    }
    loginUser(credential) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.User.findOne({ email: credential.email });
            if (!user) {
                throw new utils_1.ApiError(constants_1.ERROR_CODES.NOT_FOUND, "No such user exists!");
            }
            // const match = await bcrypt.compare(credential.password,user.password);
            if (!user.isPasswordCorrect(credential.password)) {
                throw new utils_1.ApiError(constants_1.ERROR_CODES.UNAUTHORIZED, "Invalid password");
            }
            const accessSecretkey = config_1.default.get("ACCESS_SECRET_KEY");
            const accessExpiry = config_1.default.get("ACCESS_TOKEN_EXPIRY_TIME");
            const refreshExpiry = config_1.default.get("REFRESH_TOKEN_EXPIRY_TIME");
            const refreshSecretkey = config_1.default.get("REFRESH_SECRET_KEY");
            const accessToken = user.generateAccessToken(accessSecretkey, accessExpiry);
            const refreshToken = user.generateAccessToken(refreshSecretkey, refreshExpiry);
            return new utils_1.ApiResponse(constants_1.SUCCESS_CODES.OK, { accessToken, refreshToken, user }, "Login Successfull");
        });
    }
    socialLogin(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, auth_service_1.findOrCreateSocialUser)(data);
            const accessSecretKey = config_1.default.get('ACCESS_SECRET_KEY');
            const accessExpiry = config_1.default.get('ACCESS_TOKEN_EXPIRY_TIME');
            const refreshExpiry = config_1.default.get('REFRESH_TOKEN_EXPIRY_TIME');
            const refreshSecretKey = config_1.default.get('REFRESH_SECRET_KEY');
            const accessToken = user.generateAccessToken(accessSecretKey, accessExpiry);
            const refreshToken = user.generateRefreshToken(refreshSecretKey, refreshExpiry);
            return new utils_1.ApiResponse(constants_1.SUCCESS_CODES.OK, { accessToken, refreshToken, user }, 'Login Successful');
        });
    }
    generateAccessToken(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.User.findById(userid);
            if (!user) {
                throw new utils_1.ApiError(constants_1.ERROR_CODES.NOT_FOUND, "No such user exists!");
            }
            const accessSecretkey = config_1.default.get("ACCESS_SECRET_KEY");
            const accessExpiry = config_1.default.get("ACCESS_TOKEN_EXPIRY_TIME");
            const accessToken = user.generateAccessToken(accessSecretkey, accessExpiry);
            return new utils_1.ApiResponse(constants_1.SUCCESS_CODES.OK, accessToken, "Token generated successfully!");
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield models_1.User.find({ role: 'user' });
            return new utils_1.ApiResponse(constants_1.SUCCESS_CODES.OK, data, "Users fetched successfully");
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield models_1.User.findByIdAndDelete(id);
            return new utils_1.ApiResponse(constants_1.SUCCESS_CODES.OK, data, "User deleted successfully");
        });
    }
}
exports.UserService = UserService;
