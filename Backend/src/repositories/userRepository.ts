import { User, UserType } from "../Model/userModel";

class UserRepository {
    async createUser(user: UserType): Promise<UserType> {
        return new User(user).save();
    }

    async findUserByEmail(email: string): Promise<UserType | null> {
        return User.findOne({ email });
    }

    async saveOtp(email: string, otp: string): Promise<void> {
        const user = await this.findUserByEmail(email);
        if (!user) {
            throw new Error('User not found when trying to save OTP');
        }
    
        await User.updateOne({ email }, { otp, tempData: true, otpCreatedAt: new Date() });
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        const user = await User.findOne({ email, otp, tempData: true });
        return !!user;
    }

    async findTempUserByEmail(email: string): Promise<UserType | null> {
        return User.findOne({ email, tempData: true})
    }

    async clearTempUserData(email: string): Promise<void> {
        await User.updateOne({ email }, { $unset: { otp: 1, tempData: 1 } });
    }
}

export default new UserRepository();
