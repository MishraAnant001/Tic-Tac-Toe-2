import { IUser } from "../interfaces";
import { User } from "../models";

export const findOrCreateSocialUser = async (payload: IUser) => {
    let user = await User.findOne({ socialLoginId: payload.socialLoginId, socialLoginProvider: payload.socialLoginProvider });
    if (!user) {
        user = new User({
            name: payload.name,
            email: payload.email,
            socialLoginId: payload.socialLoginId,
            socialLoginProvider: payload.socialLoginProvider,
            role: 'user',
        });
        await user.save();
    }
    return user;
}