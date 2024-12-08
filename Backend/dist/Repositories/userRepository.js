"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const doctorModel_1 = require("../Model/doctorModel");
const userModel_1 = require("../Model/userModel");
class UserRepository {
    async createUser(user) {
        return new userModel_1.User(user).save();
    }
    async findUserByEmail(email) {
        return userModel_1.User.findOne({ email });
    }
    async saveOtp(email, otp) {
        const user = await this.findUserByEmail(email);
        if (!user) {
            throw new Error('User not found when trying to save OTP');
        }
        await userModel_1.User.updateOne({ email }, { otp, tempData: true, otpCreatedAt: new Date() });
    }
    async verifyOtp(email, otp) {
        const user = await userModel_1.User.findOne({ email, otp, tempData: true });
        return !!user;
    }
    async findTempUserByEmail(email) {
        return userModel_1.User.findOne({ email, tempData: true });
    }
    async clearTempUserData(email) {
        await userModel_1.User.updateOne({ email }, { $unset: { otp: 1, tempData: 1, otpCreatedAt: 1 } });
    }
    async findUserByGoogleId(googleId) {
        return userModel_1.User.findOne({ googleId });
    }
    async createGoogleUser(user) {
        const { tempData, otpCreatedAt, ...userData } = user;
        return new userModel_1.User(userData).save();
    }
    async updatePassword(email, hashedPassword) {
        await userModel_1.User.updateOne({ email }, { password: hashedPassword });
    }
    async updatePersonalDetails(email, personalDetails) {
        return await userModel_1.User.findOneAndUpdate({ email }, personalDetails, { new: true });
    }
    async updateUserProfileImage(email, profileImageUrl) {
        return await userModel_1.User.findOneAndUpdate({ email }, { profileImg: profileImageUrl });
    }
    async getAllDoctors(name) {
        try {
            const query = {
                isBlocked: false,
                isVerified: true,
                availability: true
            };
            if (name) {
                query.name = { $regex: name, $options: 'i' };
            }
            return await doctorModel_1.Doctor.find(query).exec();
        }
        catch (error) {
            console.error('Error fetching doctors from the database:', error);
            throw new Error('Error fetching doctors from the database');
        }
    }
    async getDoctorById(id) {
        try {
            const doctor = await doctorModel_1.Doctor.findById(id);
            return doctor;
        }
        catch (error) {
            console.error('Error fetching doctor:', error);
            return null;
        }
    }
    async getDoctorSlots(id) {
        try {
            const doctor = await doctorModel_1.Doctor.findById(id);
            if (!doctor) {
                return [];
            }
            return doctor.slots ?? [];
        }
        catch (error) {
            console.error('Error fetching doctor slots:', error);
            return [];
        }
    }
}
exports.default = new UserRepository();
