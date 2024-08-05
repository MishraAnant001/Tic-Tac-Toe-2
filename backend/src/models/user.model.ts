import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  role: string;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(secretKey: string, expiryTime: string): string;
  generateRefreshToken(secretKey: string, expiryTime: string): string;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
  },
  socialLoginId: {
    type: String,
    unique: true,
    sparse: true,
  },
  socialLoginProvider: {
    type: String,
    unique: true,
    sparse: true,
  },
  role: {
    type: String,
    default: "user",
  }
}, {
  timestamps: true
})

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (this.password)
    this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (secretKey: string, expiryTime: string) {
  return jwt.sign(
    {
      userid: this._id,
      role: this.role,
    },
    secretKey,
    {
      expiresIn: expiryTime,
    }
  );
};

userSchema.methods.generateRefreshToken = function (secretKey: string, expiryTime: string) {
  return jwt.sign(
    {
      userid: this._id,
    },
    secretKey,
    {
      expiresIn: expiryTime,
    }
  );
};

export const User = mongoose.model<IUser>("User", userSchema);