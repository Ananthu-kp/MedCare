"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = __importDefault(require("../Services/userService"));
const userRepository_1 = __importDefault(require("../Repositories/userRepository"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtConfig_1 = require("../Utils/jwtConfig");
const httpStatus_1 = require("../Utils/httpStatus");
const multer_1 = require("../Config/multer");
class UserController {
    async register(req, res) {
        try {
            const { name, email, phone, password, confirmPassword } = req.body;
            if (password !== confirmPassword) {
                res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ success: false, message: "Passwords do not match" });
                return;
            }
            const result = await userService_1.default.registerUser({
                name, email, phone, password,
                otp: ""
            });
            if (result.success) {
                try {
                    await userRepository_1.default.saveOtp(email, result.otp);
                }
                catch (error) {
                    console.error('Error saving OTP:', error);
                    res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error saving OTP" });
                    return;
                }
            }
            res.status(result.success ? httpStatus_1.HttpStatus.OK : httpStatus_1.HttpStatus.CONFLICT).json(result);
        }
        catch (error) {
            console.error('Error registering user:', error);
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error registering user" });
        }
    }
    async verifyOtp(req, res) {
        try {
            const { email, otp } = req.body;
            console.log("Received Data:", { email, otp });
            const result = await userService_1.default.verifyOtp(email, otp);
            if (result.success) {
                await userRepository_1.default.clearTempUserData(email);
            }
            res.status(result.success ? httpStatus_1.HttpStatus.OK : httpStatus_1.HttpStatus.BAD_REQUEST).json(result);
        }
        catch (error) {
            console.error('Error in verifyOtp:', error);
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
        }
    }
    async resendOtp(req, res) {
        try {
            const { email } = req.body;
            const result = await userService_1.default.resendOtp(email);
            res.status(result.success ? httpStatus_1.HttpStatus.OK : httpStatus_1.HttpStatus.BAD_REQUEST).json(result);
        }
        catch (error) {
            console.error('Error resending OTP:', error);
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await userRepository_1.default.findUserByEmail(email);
            console.log('User =>', user);
            if (!user) {
                res.status(httpStatus_1.HttpStatus.UNAUTHORIZED).json({ success: false, message: "Invalid credentials" });
                return;
            }
            if (user.isBlocked) {
                res.status(httpStatus_1.HttpStatus.FORBIDDEN).json({ success: false, message: "Your account has been blocked" });
                return;
            }
            const isMatch = await bcrypt_1.default.compare(password, user.password);
            if (!isMatch) {
                res.status(httpStatus_1.HttpStatus.UNAUTHORIZED).json({ success: false, message: "Invalid credentials" });
                return;
            }
            const accessToken = (0, jwtConfig_1.generateAccessToken)(user.email.toString());
            const refreshToken = (0, jwtConfig_1.generateRefreshToken)(user.email.toString());
            res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Login successful",
                accessToken,
                refreshToken,
            });
        }
        catch (error) {
            console.error('Error logging in user:', error);
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
        }
    }
    async googleLogin(req, res) {
        try {
            const { profile } = req.body;
            const result = await userService_1.default.loginWithGoogle(profile);
            res.status(result.success ? httpStatus_1.HttpStatus.OK : httpStatus_1.HttpStatus.FORBIDDEN).json(result);
        }
        catch (error) {
            console.error('Error in Google login:', error);
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
        }
    }
    async otpForPassReset(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ message: "Email is required" });
            }
            const result = await userService_1.default.requestOtpForPasswordReset(email);
            res.status(result.success ? httpStatus_1.HttpStatus.OK : httpStatus_1.HttpStatus.BAD_REQUEST).json(result);
        }
        catch (error) {
            console.error('Error in reset password:', error);
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
        }
    }
    async verifyForgotOtp(req, res) {
        try {
            const { email, otp } = req.body;
            const result = await userService_1.default.verifyForgotOtp(email, otp);
            res.status(result.success ? httpStatus_1.HttpStatus.OK : httpStatus_1.HttpStatus.BAD_REQUEST).json(result);
        }
        catch (error) {
            console.error('Error in verifyForgotOtp:', error);
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
        }
    }
    async resendForgotOtp(req, res) {
        try {
            const { email } = req.body;
            const result = await userService_1.default.resendForgotOtp(email);
            res.status(result.success ? httpStatus_1.HttpStatus.OK : httpStatus_1.HttpStatus.BAD_REQUEST).json(result);
        }
        catch (error) {
            console.error('Error in resendForgotOtp:', error);
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
        }
    }
    async resetPassword(req, res) {
        try {
            const { email, otp, newPassword } = req.body;
            const otpResult = await userService_1.default.verifyForgotOtp(email, otp);
            if (!otpResult.success) {
                res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json(otpResult);
                return;
            }
            const result = await userService_1.default.updatePassword(email, newPassword);
            res.status(result.success ? httpStatus_1.HttpStatus.OK : httpStatus_1.HttpStatus.BAD_REQUEST).json(result);
        }
        catch (error) {
            console.error('Error resetting password:', error);
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
        }
    }
    async getUserProfile(req, res) {
        try {
            const userId = req.user.id;
            const userProfile = await userService_1.default.getUserProfile(userId);
            if (!userProfile) {
                res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ message: 'Doctor not found' });
                return;
            }
            res.status(httpStatus_1.HttpStatus.OK).json(userProfile);
        }
        catch (error) {
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
        }
    }
    async updatePersonalDetails(req, res) {
        try {
            const userId = req.user.id;
            const personalDetails = req.body;
            const updatedUser = await userService_1.default.updatePersonalDetails(userId, personalDetails);
            res.status(httpStatus_1.HttpStatus.OK).json(updatedUser);
        }
        catch (error) {
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
        }
    }
    ;
    async uploadProfileImage(req, res) {
        multer_1.profileUpload.single('profileImage')(req, res, async (err) => {
            if (err) {
                console.error('Multer Error:', err);
                return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ success: false, message: "Error uploading file", error: err.message });
            }
            const profileImage = req.file;
            if (!profileImage) {
                return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ success: false, message: "Profile image file is required" });
            }
            try {
                const userId = req.user.id;
                const profileImageUrl = profileImage.filename;
                const result = await userService_1.default.updateUserProfileImage(userId, profileImageUrl);
                if (result.success) {
                    return res.status(httpStatus_1.HttpStatus.OK).json({ success: true, profileImageUrl });
                }
                else {
                    return res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to update profile image" });
                }
            }
            catch (error) {
                console.error('Error saving profile image:', error);
                return res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error saving profile image" });
            }
        });
    }
    async getDoctors(req, res) {
        try {
            const { name } = req.query;
            const doctors = await userService_1.default.getAllDoctors(name);
            res.status(httpStatus_1.HttpStatus.OK).json(doctors);
        }
        catch (error) {
            console.error('Error fetching doctors:', error);
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching doctors' });
        }
    }
    async getDoctorDetails(req, res) {
        const id = req.params.id;
        try {
            const doctor = await userService_1.default.getDoctorDetails(id);
            res.json(doctor);
        }
        catch (error) {
            console.error('Error fetching doctors11111111:', error);
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching doctors' });
        }
    }
    async getDoctorSlots(req, res) {
        const id = req.params.id;
        try {
            const slots = await userService_1.default.getDoctorSlots(id);
            res.json(slots);
        }
        catch (error) {
            console.error('Error fetching doctors22222222222:', error);
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching doctors' });
        }
    }
}
exports.default = new UserController();
