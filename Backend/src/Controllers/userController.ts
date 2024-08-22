import { Request, Response } from "express";
import userService from "../services/userService";
import userRepository from "../repositories/userRepository";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtConfig"

class UserController {
    async register(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, phone, password, confirmPassword } = req.body;
    
            if (password !== confirmPassword) {
                res.status(400).json({ success: false, message: "Passwords do not match" });
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
                    res.status(500).json({ message: "Error saving OTP" });
                    return;
                }
            }
    
            res.status(result.success ? 200 : 409).json(result);
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ message: "Error registering user" });
        }
    }

    async verifyOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email, otp } = req.body;
            console.log("Received Data:", { email, otp }); 

            const result = await userService.verifyOtp(email, otp);
            if (result.success) {
                await userRepository.clearTempUserData(email)
            }

            res.status(result.success ? 200 : 400).json(result);
        } catch (error) {
            console.error('Error in verifyOtp:', error);
            res.status(500).json({ message: "Something went wrong, please try again later" });
        }
    }

    async resendOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;

            const user = await userRepository.findUserByEmail(email);
            if (!user) {
                res.status(404).json({ success: false, message: "User not found" });
                return;
            }

            const result = await userService.resendOtp(email);

            res.status(result.success ? 200 : 400).json(result);
        } catch (error) {
            console.error('Error resending OTP:', error);
            res.status(500).json({ message: "Something went wrong, please try again later" });
        }
    }


    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
    
            const user = await userRepository.findUserByEmail(email);
            console.log('User =>', user);
            if (!user) {
                res.status(401).json({ success: false, message: "Invalid credentials" });
                return;
            }
    
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(401).json({ success: false, message: "Invalid credentials" });
                return;
            }
    
            const accessToken = generateAccessToken(user.email.toString());
            const refreshToken = generateRefreshToken(user.email.toString());
    
            res.status(200).json({
                success: true,
                message: "Login successful",
                accessToken,
                refreshToken,
            });
        } catch (error) {
            console.error('Error logging in user:', error);
            res.status(500).json({ message: "Something went wrong, please try again later" });
        }
    }

    
}

export default new UserController();