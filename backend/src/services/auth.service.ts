import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/user.model';
import config from 'config';
import { IUser } from '../interfaces';

const client = new OAuth2Client(config.get('GOOGLE_CLIENT_ID'));

export const googleAuthService = {

  async findOrCreateGoogleUser(payload: IUser) {
    let user = await User.findOne({ googleId: payload.googleId });
    if (!user) {
      user = new User({
        name: payload.name,
        email: payload.email,
        googleId: payload.googleId,
        role: 'user',
      });
      await user.save();
    }
    return user;
  },
};
