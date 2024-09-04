import { Schema, model } from "mongoose";

type UserType = {
    otp?: string;
    name: string;
    email: string;
    phone?: string;
    password: string;
    isBlocked?: boolean;
    profileImg?: string;
    address?: string;
    createdAt?: Date;
    tempData?: boolean;
    otpCreatedAt?: Date;
    googleId?: string;
}

const userSchema = new Schema<UserType>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    profileImg: { type: String },
    googleId: { type: String },
    address: { type: String },
    otp: { type: String }, 
    tempData: { type: Boolean, default: false }, 
    createdAt: { type: Date, default: Date.now },
    otpCreatedAt: { type: Date, default: Date.now, expires: '5m' }
});


userSchema.index({ otpCreatedAt: 1 }, { expireAfterSeconds: 300 });


const User = model<UserType>('User', userSchema)

export { User, UserType}