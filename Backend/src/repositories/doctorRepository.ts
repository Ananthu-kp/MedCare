import Category from "../Model/categoryModel";
import { Doctor, DoctorType } from "../Model/doctorModel";

class DoctorRepository {
    async createDoctor(doctor: DoctorType): Promise<DoctorType> {
        return new Doctor(doctor).save();
    }

    async findDoctorByEmail(email: string): Promise<DoctorType | null> {
        return Doctor.findOne({ email });
    }

    async saveOtp(email: string, otp: string): Promise<void> {
        const doctor = await this.findDoctorByEmail(email);
        if (!doctor) {
            throw new Error('Doctor not found when trying to save OTP');
        }

        await Doctor.updateOne({ email }, { otp, tempData: true, otpCreatedAt: new Date() });
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        const doctor = await Doctor.findOne({ email, otp, tempData: true });
        return !!doctor;
    }

    async clearTempDoctorData(email: string): Promise<void> {
        await Doctor.updateOne({ email }, { $unset: { otp: 1, tempData: 1, otpCreatedAt: 1 } });
    }

    async getAllCategories(): Promise<string[]> {
        try {
            const categories = await Category.find().select('name');
            return categories.map(category => category.name);

        } catch (error) {
            throw new Error('Error fetching categories from the database.');
        }
    }

    async findDoctorById(doctorId: string): Promise<DoctorType | null> {
        return await Doctor.findOne({ email: doctorId });
    }

    async updateOfficialDetails(doctorId: string, officialDetails: Partial<DoctorType>): Promise<DoctorType | null> {
        return await Doctor.findOneAndUpdate({ email: doctorId }, officialDetails, { new: true });
    }

    async updatePersonalDetails(doctorId: string, personalDetails: Partial<DoctorType>): Promise<DoctorType | null> {
        return await Doctor.findOneAndUpdate({ email: doctorId }, personalDetails, { new: true });
    }

    async updateDoctorProfileImage(doctorId: string, profileImageUrl: string) {
        return await Doctor.findOneAndUpdate(
            { email: doctorId },
            { profileImg: profileImageUrl }
        );
    }

    async updatePassword(email: string, hashedPassword: string): Promise<void> {
        await Doctor.updateOne({ email }, { password: hashedPassword });
    }

    async updateDoctorAvailability(doctorId: string, availability: boolean) {
        return Doctor.findByIdAndUpdate(
            doctorId,
            { availability },
            { new: true }
        );
    }

}


export default new DoctorRepository();
