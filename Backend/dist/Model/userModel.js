"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
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
userSchema.pre('save', function (next) {
    if (this.googleId) {
        this.tempData = undefined;
        this.otpCreatedAt = undefined;
    }
    next();
});
userSchema.index({ otpCreatedAt: 1 }, { expireAfterSeconds: 300 });
const User = (0, mongoose_1.model)('User', userSchema);
exports.User = User;
