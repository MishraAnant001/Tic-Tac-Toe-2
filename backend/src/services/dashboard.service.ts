import { SUCCESS_CODES } from "../constants";
import { Game, User } from "../models";
import { ApiResponse } from "../utils";

export class DashboardService{
    async getAdminDashBoard(){
        const game = await Game.find({})
        const users = await User.find({role:'user'})
        const data ={
            games:game.length,
            users:users.length
        }
        return new ApiResponse(SUCCESS_CODES.OK,data,"Dashboard fetched successfully")
    }
}