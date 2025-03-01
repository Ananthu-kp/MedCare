import userRepository from "../Repositories/userRepository";
import bcryptUtil from "../Utils/bcryptUtil";
import { UserType } from "../Model/userModel";
import { sendOtpEmail } from '../Config/nodeMailer';
import { generateAccessToken, generateRefreshToken } from "../Utils/jwtConfig";
import { DoctorType, SlotType } from "../Model/doctorModel";
import stripe from "../Config/stripeConfig";

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

    async loginWithGoogle(profile: any): Promise<{ success: boolean; message: string; accessToken?: string; refreshToken?: string }> {
        const user = await userRepository.findUserByEmail(profile.email);

        if (!user) {
            const newUser: UserType = {
                email: profile.email,
                name: profile.name,
                googleId: profile.id,
                password: await bcryptUtil.hashPassword('randompassword' + Date.now()),
                isBlocked: false,
                phone: '',
            };

            delete newUser.tempData;
            delete newUser.otpCreatedAt;

            await userRepository.createGoogleUser(newUser);
            return this.generateTokens(newUser);
        }

        if (user.isBlocked) {
            return { success: false, message: "Your account has been blocked" };
        }

        return this.generateTokens(user);
    }


    private generateTokens(user: UserType) {
        const accessToken = generateAccessToken(user.email.toString());
        const refreshToken = generateRefreshToken(user.email.toString());

        return { success: true, message: "Login successful", accessToken, refreshToken };
    }


    async requestOtpForPasswordReset(email: string): Promise<{ success: boolean; message: string; otp?: string }> {
        const user = await userRepository.findUserByEmail(email)
        if (!user) {
            return { success: false, message: 'User not found' };
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        console.log('Password reset otp ->', otp)

        try {
            user.otp = otp;
            await sendOtpEmail(email, otp);
            return { success: true, message: 'OTP sent to your email', otp }
        } catch (error) {
            console.error('Failed to send OTP:', error);
            return { success: false, message: 'Failed to send OTP' };
        }
    }

    async verifyForgotOtp(email: string, otp: string): Promise<{ success: boolean; message: string }> {
        const user = await userRepository.findUserByEmail(email);
        if (!user) {
            return { success: false, message: 'User not found' }
        }
        return { success: true, message: 'OTP verified successfully' }
    }

    async resendForgotOtp(email: string): Promise<{ success: boolean; message: string, otp?: string }> {
        const user = await userRepository.findUserByEmail(email);

        if (!user) {
            return { success: false, message: 'User not found' }
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        console.log("Resend otp =>", otp)

        try {
            await sendOtpEmail(email, otp, true);
            return { success: true, message: 'OTP resent to your email', otp }
        } catch (error) {
            console.error('Failed to send OTP:', error);
            return { success: false, message: 'Failed to send OTP' };
        }
    }

    async updatePassword(email: string, newPassword: string): Promise<{ success: boolean; message: string }> {
        if (!newPassword) {
            return { success: false, message: 'Password cannot be empty' };
        }

        try {
            const hashedPassword = await bcryptUtil.hashPassword(newPassword);
            await userRepository.updatePassword(email, hashedPassword);
            return { success: true, message: 'Password updated successfully' };
        } catch (error) {
            console.error('Error updating password:', error);
            return { success: false, message: 'Failed to update password' };
        }
    }

    async getUserProfile(email: string): Promise<UserType | null> {
        return await userRepository.findUserByEmail(email);
    }

    async updatePersonalDetails(email: string, personalDetails: Partial<UserType>): Promise<UserType | null> {
        return await userRepository.updatePersonalDetails(email, personalDetails);
    }

    async updateUserProfileImage(email: string, profileImageUrl: string) {
        try {
            const updatedUser = await userRepository.updateUserProfileImage(email, profileImageUrl);
            return { success: true, doctor: updatedUser };
        } catch (error) {
            console.error('Error updating doctor profile image:', error);
            return { success: false };
        }
    }

    async getAllDoctors(name?: string): Promise<DoctorType[]> {
        try {
            return await userRepository.getAllDoctors(name);
        } catch (error) {
            console.error('Error in getAllDoctors service:', error);
            throw new Error('Error getting all doctors');
        }
    }

    async getDoctorDetails(id: string): Promise<DoctorType | null> {
        return userRepository.getDoctorById(id);
    }

    async getDoctorSlots(id: string): Promise<SlotType[]> {
        return userRepository.getDoctorSlots(id);
    }

    async createCheckoutSession(amount: number, currency: string, userId: string, bookingTime: string): Promise<{ sessionId: string; url: string }> {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: currency,
                        product_data: {
                            name: 'Doctor Consultation',
                        },
                        unit_amount: amount * 100, 
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}cancel`,
            metadata: {
                userId,
                bookingTime,
            },
        });

        // Ensure session.url is not null
        if (!session.url) {
            throw new Error('Failed to create checkout session: URL is null');
        }

        return { sessionId: session.id, url: session.url };
    }


}


export default new UserService();
