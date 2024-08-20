import userRepository from "../repositories/userRepository";
import bcryptUtil from "../utils/bcryptUtil";
import { UserType } from "../Model/userModel";
import { sendOtpEmail } from '../config/nodeMailer';

class UserService {
    async registerUser(user: UserType): Promise<{ success: boolean; message: string; otp: string }> {
        const existingUser = await userRepository.findUserByEmail(user.email);
        if (existingUser) {
            return { success: false, message: 'User already exists', otp: '' };
        }

        user.password = await bcryptUtil.hashPassword(user.password);


        const savedUser = await userRepository.createUser(user);
        console.log('user created', savedUser);

        if (!savedUser) {
            return { success: false, message: 'Failed to register user', otp: '' };
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        console.log('your otp', otp);


        try {
            await sendOtpEmail(user.email, otp);
            return { success: true, message: 'OTP sent to your email', otp };
        } catch (error) {
            return { success: false, message: 'Failed to send OTP', otp: '' };
        }
    }


    async verifyOtp(email: string, otp: string): Promise<{ success: boolean; message: string }> {
        const user = await userRepository.findTempUserByEmail(email);
        if (!user) {
            return { success: false, message: 'User not found' }
        }

        if (user.otp !== otp) {
            return { success: false, message: 'Invalid OTP' }
        }

        await userRepository.clearTempUserData(email);
        return { success: true, message: 'User verified and registered successfully' }
    }


    async resendOtp(email: string): Promise<{ success: boolean; message: string }> {
        const user = await userRepository.findTempUserByEmail(email);
        if (!user) {
            return { success: false, message: 'User not found' }
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        console.log('Resent otp', otp);

        try {
            await sendOtpEmail(email, otp, true);
            await userRepository.saveOtp(email, otp)
            return { success: true, message: 'OTP resent to your email' };
        } catch (error) {
            console.error('Failed to resend OTP:', error);
            return { success: false, message: 'Failed to resend OTP' };
        }
    }

}


export default new UserService();
