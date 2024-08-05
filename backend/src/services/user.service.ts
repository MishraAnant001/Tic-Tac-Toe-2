
import bcrypt from "bcrypt"
import { User } from "../models";
import { ApiError, ApiResponse } from "../utils";
import config from "config"
import { ERROR_CODES, SUCCESS_CODES } from "../constants";
import { ICredentials, IUser } from "../interfaces";
import { findOrCreateSocialUser } from "./auth.service";

export class UserService{
    async signupUser(userdata:IUser){
        const user = await User.create(userdata);
        return new ApiResponse(SUCCESS_CODES.CREATED,user,"user registered successfully")
    }
    async loginUser(credential:ICredentials){
        const user = await User.findOne({email:credential.email});
        if(!user){
            throw new ApiError(ERROR_CODES.NOT_FOUND,"No such user exists!")
        }
        // const match = await bcrypt.compare(credential.password,user.password);
        if(!user.isPasswordCorrect(credential.password)){
            throw new ApiError(ERROR_CODES.UNAUTHORIZED,"Invalid password");
        }
        const accessSecretkey :string = config.get("ACCESS_SECRET_KEY");
        const accessExpiry:string = config.get("ACCESS_TOKEN_EXPIRY_TIME")
        const refreshExpiry:string = config.get("REFRESH_TOKEN_EXPIRY_TIME")
        const refreshSecretkey :string = config.get("REFRESH_SECRET_KEY");
        const accessToken = user.generateAccessToken(accessSecretkey,accessExpiry)
        const refreshToken = user.generateAccessToken(refreshSecretkey,refreshExpiry)
        return new ApiResponse(SUCCESS_CODES.OK,{accessToken,refreshToken,user},"Login Successfull")
    }       

    async socialLogin(data:IUser) {
        const user = await findOrCreateSocialUser(data)
        const accessSecretKey: string = config.get('ACCESS_SECRET_KEY');
        const accessExpiry: string = config.get('ACCESS_TOKEN_EXPIRY_TIME');
        const refreshExpiry: string = config.get('REFRESH_TOKEN_EXPIRY_TIME');
        const refreshSecretKey: string = config.get('REFRESH_SECRET_KEY');
        const accessToken = user.generateAccessToken(accessSecretKey, accessExpiry);
        const refreshToken = user.generateRefreshToken(refreshSecretKey, refreshExpiry);
    
        return new ApiResponse(SUCCESS_CODES.OK, { accessToken, refreshToken, user }, 'Login Successful');
      }

    async generateAccessToken (userid:string){
        const user = await User.findById(userid)
        if(!user){
            throw new ApiError(ERROR_CODES.NOT_FOUND,"No such user exists!")            
        }
        const accessSecretkey :string = config.get("ACCESS_SECRET_KEY");
        const accessExpiry:string = config.get("ACCESS_TOKEN_EXPIRY_TIME")
        const accessToken = user.generateAccessToken(accessSecretkey,accessExpiry)
        return new ApiResponse(SUCCESS_CODES.OK,accessToken,"Token generated successfully!")
    }
    async getAllUsers(){
        const data = await User.find({role:'user'});
        return new ApiResponse(SUCCESS_CODES.OK,data,"Users fetched successfully")
    }

    async deleteUser(id:string){
        const data = await User.findByIdAndDelete(id)
        return new ApiResponse(SUCCESS_CODES.OK,data,"User deleted successfully")
    }
}