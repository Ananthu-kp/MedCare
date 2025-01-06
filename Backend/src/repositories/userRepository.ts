import { Doctor, DoctorType, SlotType } from "../Model/doctorModel";
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
        return User.findOne({ email, tempData: true })
    }

    async clearTempUserData(email: string): Promise<void> {
        await User.updateOne({ email }, { $unset: { otp: 1, tempData: 1, otpCreatedAt: 1 } });
    }

    async findUserByGoogleId(googleId: string): Promise<UserType | null> {
        return User.findOne({ googleId });
    }

    async createGoogleUser(user: UserType): Promise<UserType> {
        const { tempData, otpCreatedAt, ...userData } = user;
        return new User(userData).save();
    }

    async updatePassword(email: string, hashedPassword: string): Promise<void> {
        await User.updateOne({ email }, { password: hashedPassword });
    }

    async updatePersonalDetails(email: string, personalDetails: Partial<UserType>): Promise<UserType | null> {
        return await User.findOneAndUpdate({ email }, personalDetails, { new: true });
    }

    async updateUserProfileImage(email: string, profileImageUrl: string) {
        return await User.findOneAndUpdate(
            { email },
            { profileImg: profileImageUrl }
        );
    }

    async getAllDoctors(name?: string): Promise<DoctorType[]> {
        try {
            const query: any = {
                isBlocked: false,
                isVerified: true,
                availability: true
            };
            if (name) {
                query.name = { $regex: name, $options: 'i' };
            }

            return await Doctor.find(query).exec();
        } catch (error) {
            console.error('Error fetching doctors from the database:', error);
            throw new Error('Error fetching doctors from the database');
        }
    }


    async getDoctorById(id: string): Promise<DoctorType | null> {
        try {
            const doctor = await Doctor.findById(id);
            return doctor;
        } catch (error) {
            console.error('Error fetching doctor:', error);
            return null;
        }
    }

    async getDoctorSlots(id: string): Promise<SlotType[]> {
        try {
            const doctor = await Doctor.findById(id);
            if (!doctor) {
                return [];
            }
            return doctor.slots ?? [];
        } catch (error) {
            console.error('Error fetching doctor slots:', error);
            return [];
        }
    }


    async addPaymentToUser (email: string, paymentData: any): Promise<void> {
        const result = await User.updateOne(
            { email: email }, 
            { $push: { payments: paymentData } }
        );
        if (result.matchedCount === 0) {
            throw new Error('User  not found');
        }
    
        if (result.modifiedCount === 0) {
            throw new Error('Payment not added, user may not have changed');
        }
    }

}

export default new UserRepository();
