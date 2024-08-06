"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_MESSAGES = exports.AUTH_MESSAGES = exports.USER_MESSAGES = exports.SERVER_MESSAGES = void 0;
exports.SERVER_MESSAGES = {
    START_SUCCESS: 'Server is running on port',
};
exports.USER_MESSAGES = {
    CREATE_SUCCESS: 'User registered successfully',
    NOT_FOUND: 'User not found',
    UPDATE_SUCCESS: 'User updated successfully',
    DELETE_SUCCESS: 'User deleted successfully',
    FETCH_SUCCESS: 'User fetched successfully'
};
exports.AUTH_MESSAGES = {
    INVALID_PASSWORD: 'password not valid!',
    LOGIN_SUCCESS: 'Login successfull',
    UNAUTHORIZED: 'unauthorized access!',
    ACCESS_TOKEN_EXPIRED: 'access token expired! kindly login again',
    ACCESS_TOKEN_INVALID: 'access token not valid!',
    REFRESH_TOKEN_EXPIRED: 'refresh token expired! kindly login again',
    REFRESH_TOKEN_INVALID: 'refresh token not valid!',
    NOT_FOUND: 'token not found',
};
exports.DB_MESSAGES = {
    CONNECT_SUCCESS: 'Database connected successfully',
    CONNECT_ERROR: 'Error while connecting database'
};
