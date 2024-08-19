import userRepository from "../repositories/userRepository";
import bcryptUtil from "../utils/bcryptUtil";
import { UserType } from "../Model/userModel";
import { sendOtpEmail } from '../config/nodeMailer';

class UserService {
    async registerUser(user: UserType): Promise<{ success: boolean; message: string; otp: string }> {
        const existingUser = await userRepository.findUserByEmail(user.email);
        if (existingUser) {
            return { success: false, message: 'Email already in use', otp: '' };
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
    
}


export default new UserService();
