import { Request, Response } from "express";
import userService from "../services/userService";
import userRepository from "../repositories/userRepository";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtConfig";
import { HttpStatus } from "../utils/httpStatus";
import { profileUpload } from "../config/multer";

class UserController {
    async register(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, phone, password, confirmPassword } = req.body;

            if (password !== confirmPassword) {
                res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Passwords do not match" });
                return;
            }

            const result = await userService.registerUser({
                name, email, phone, password,
                otp: ""
            });

            if (result.success) {
                try {
                    await userRepository.saveOtp(email, result.otp);
                } catch (error) {
                    console.error('Error saving OTP:', error);
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error saving OTP" });
                    return;
                }
            }

            res.status(result.success ? HttpStatus.OK : HttpStatus.CONFLICT).json(result);
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error registering user" });
        }
    }

    async verifyOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email, otp } = req.body;
            console.log("Received Data:", { email, otp });

            const result = await userService.verifyOtp(email, otp);
            if (result.success) {
                await userRepository.clearTempUserData(email);
            }

            res.status(result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(result);
        } catch (error) {
            console.error('Error in verifyOtp:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
        }
    }

    async resendOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;

            const result = await userService.resendOtp(email);

            res.status(result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(result);
        } catch (error) {
            console.error('Error resending OTP:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            const user = await userRepository.findUserByEmail(email);
            console.log('User =>', user);
            if (!user) {
                res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: "Invalid credentials" });
                return;
            }

            if (user.isBlocked) {
                res.status(HttpStatus.FORBIDDEN).json({ success: false, message: "Your account has been blocked" });
                return;
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: "Invalid credentials" });
                return;
            }

            const accessToken = generateAccessToken(user.email.toString());
            const refreshToken = generateRefreshToken(user.email.toString());

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Login successful",
                accessToken,
                refreshToken,
            });
        } catch (error) {
            console.error('Error logging in user:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
        }
    }

    async googleLogin(req: Request, res: Response): Promise<void> {
        try {
            const { profile } = req.body;

            const result = await userService.loginWithGoogle(profile);

            res.status(result.success ? HttpStatus.OK : HttpStatus.FORBIDDEN).json(result);
        } catch (error) {
            console.error('Error in Google login:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
        }
    }

    async otpForPassReset(req: Request, res: Response) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: "Email is required" });
            }
            const result = await userService.requestOtpForPasswordReset(email)
            res.status(result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(result)
        } catch (error) {
            console.error('Error in reset password:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
        }
    }

    async verifyForgotOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email, otp } = req.body;

            const result = await userService.verifyForgotOtp(email, otp);
            res.status(result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(result)
        } catch (error) {
            console.error('Error in verifyForgotOtp:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
        }
    }

    async resendForgotOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            const result = await userService.resendForgotOtp(email)

            res.status(result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(result)
        } catch (error) {
            console.error('Error in resendForgotOtp:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
        }
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email, otp, newPassword } = req.body;
    
            const otpResult = await userService.verifyForgotOtp(email, otp);
            if (!otpResult.success) {
                res.status(HttpStatus.BAD_REQUEST).json(otpResult);
                return;
            }
    
            const result = await userService.updatePassword(email, newPassword);
            res.status(result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(result);
    
        } catch (error) {
            console.error('Error resetting password:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
        }
    }

    async getUserProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user.id;
            const userProfile = await userService.getUserProfile(userId);
            if (!userProfile) {
                res.status(HttpStatus.NOT_FOUND).json({ message: 'Doctor not found' });
                return;
            }
            res.status(HttpStatus.OK).json(userProfile);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
        }
    }

    async updatePersonalDetails(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user.id;
            const personalDetails = req.body;
            const updatedUser = await userService.updatePersonalDetails(userId, personalDetails);
            res.status(HttpStatus.OK).json(updatedUser);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
        }
    };

    async uploadProfileImage(req: Request, res: Response): Promise<void> {
        profileUpload.single('profileImage')(req, res, async (err: any) => {
            if (err) {
                console.error('Multer Error:', err);
                return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Error uploading file", error: err.message });
            }

            const profileImage = req.file;
            if (!profileImage) {
                return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Profile image file is required" });
            }

            try {
                const userId = (req as any).user.id;
                const profileImageUrl = profileImage.filename;

                const result = await userService.updateUserProfileImage(userId, profileImageUrl);

                if (result.success) {
                    return res.status(HttpStatus.OK).json({ success: true, profileImageUrl });
                } else {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to update profile image" });
                }
            } catch (error) {
                console.error('Error saving profile image:', error);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error saving profile image" });
            }
        });
    }
    
}

export default new UserController();
