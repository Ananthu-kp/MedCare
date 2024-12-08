"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userRepository_1 = __importDefault(require("../Repositories/userRepository"));
const bcryptUtil_1 = __importDefault(require("../Utils/bcryptUtil"));
const nodeMailer_1 = require("../Config/nodeMailer");
const jwtConfig_1 = require("../Utils/jwtConfig");
class UserService {
    async registerUser(user) {
        const existingUser = await userRepository_1.default.findUserByEmail(user.email);
        if (existingUser) {
            return { success: false, message: 'User already exists', otp: '' };
        }
        user.password = await bcryptUtil_1.default.hashPassword(user.password);
        const savedUser = await userRepository_1.default.createUser(user);
        console.log('user created', savedUser);
        if (!savedUser) {
            return { success: false, message: 'Failed to register user', otp: '' };
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        console.log('your otp', otp);
        try {
            await (0, nodeMailer_1.sendOtpEmail)(user.email, otp);
            return { success: true, message: 'OTP sent to your email', otp };
        }
        catch (error) {
            return { success: false, message: 'Failed to send OTP', otp: '' };
        }
    }
    async verifyOtp(email, otp) {
        const user = await userRepository_1.default.findTempUserByEmail(email);
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        if (user.otp !== otp) {
            return { success: false, message: 'Invalid OTP' };
        }
        await userRepository_1.default.clearTempUserData(email);
        return { success: true, message: 'User verified and registered successfully' };
    }
    async resendOtp(email) {
        const user = await userRepository_1.default.findTempUserByEmail(email);
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        console.log('Resent otp', otp);
        try {
            await (0, nodeMailer_1.sendOtpEmail)(email, otp, true);
            await userRepository_1.default.saveOtp(email, otp);
            return { success: true, message: 'OTP resent to your email' };
        }
        catch (error) {
            console.error('Failed to resend OTP:', error);
            return { success: false, message: 'Failed to resend OTP' };
        }
    }
    async loginWithGoogle(profile) {
        const user = await userRepository_1.default.findUserByEmail(profile.email);
        if (!user) {
            const newUser = {
                email: profile.email,
                name: profile.name,
                googleId: profile.id,
                password: await bcryptUtil_1.default.hashPassword('randompassword' + Date.now()),
                isBlocked: false,
                phone: '',
            };
            delete newUser.tempData;
            delete newUser.otpCreatedAt;
            await userRepository_1.default.createGoogleUser(newUser);
            return this.generateTokens(newUser);
        }
        if (user.isBlocked) {
            return { success: false, message: "Your account has been blocked" };
        }
        return this.generateTokens(user);
    }
    generateTokens(user) {
        const accessToken = (0, jwtConfig_1.generateAccessToken)(user.email.toString());
        const refreshToken = (0, jwtConfig_1.generateRefreshToken)(user.email.toString());
        return { success: true, message: "Login successful", accessToken, refreshToken };
    }
    async requestOtpForPasswordReset(email) {
        const user = await userRepository_1.default.findUserByEmail(email);
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        console.log('Password reset otp ->', otp);
        try {
            user.otp = otp;
            await (0, nodeMailer_1.sendOtpEmail)(email, otp);
            return { success: true, message: 'OTP sent to your email', otp };
        }
        catch (error) {
            console.error('Failed to send OTP:', error);
            return { success: false, message: 'Failed to send OTP' };
        }
    }
    async verifyForgotOtp(email, otp) {
        const user = await userRepository_1.default.findUserByEmail(email);
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        return { success: true, message: 'OTP verified successfully' };
    }
    async resendForgotOtp(email) {
        const user = await userRepository_1.default.findUserByEmail(email);
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        console.log("Resend otp =>", otp);
        try {
            await (0, nodeMailer_1.sendOtpEmail)(email, otp, true);
            return { success: true, message: 'OTP resent to your email', otp };
        }
        catch (error) {
            console.error('Failed to send OTP:', error);
            return { success: false, message: 'Failed to send OTP' };
        }
    }
    async updatePassword(email, newPassword) {
        if (!newPassword) {
            return { success: false, message: 'Password cannot be empty' };
        }
        try {
            const hashedPassword = await bcryptUtil_1.default.hashPassword(newPassword);
            await userRepository_1.default.updatePassword(email, hashedPassword);
            return { success: true, message: 'Password updated successfully' };
        }
        catch (error) {
            console.error('Error updating password:', error);
            return { success: false, message: 'Failed to update password' };
        }
    }
    async getUserProfile(email) {
        return await userRepository_1.default.findUserByEmail(email);
    }
    async updatePersonalDetails(email, personalDetails) {
        return await userRepository_1.default.updatePersonalDetails(email, personalDetails);
    }
    async updateUserProfileImage(email, profileImageUrl) {
        try {
            const updatedUser = await userRepository_1.default.updateUserProfileImage(email, profileImageUrl);
            return { success: true, doctor: updatedUser };
        }
        catch (error) {
            console.error('Error updating doctor profile image:', error);
            return { success: false };
        }
    }
    async getAllDoctors(name) {
        try {
            return await userRepository_1.default.getAllDoctors(name);
        }
        catch (error) {
            console.error('Error in getAllDoctors service:', error);
            throw new Error('Error getting all doctors');
        }
    }
    async getDoctorDetails(id) {
        return userRepository_1.default.getDoctorById(id);
    }
    async getDoctorSlots(id) {
        return userRepository_1.default.getDoctorSlots(id);
    }
}
exports.default = new UserService();
