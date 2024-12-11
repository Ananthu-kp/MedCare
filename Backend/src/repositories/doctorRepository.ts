import { Doctor, DoctorType } from "../Model/doctorModel";
import Category from "../Model/categoryModel";
import { IDoctorRepository } from "../Interfaces/doctorRepository.interface";

class DoctorRepository implements IDoctorRepository {
    
    async createDoctor(doctor: DoctorType): Promise<DoctorType> {
        return new Doctor(doctor).save();
    }

    async findDoctorByEmail(email: string): Promise<DoctorType | null> {
        return Doctor.findOne({ email });
    }

    async saveOtp(email: string, otp: string): Promise<void> {
        const doctor = await this.findDoctorByEmail(email);
        if (!doctor) {
            throw new Error("Doctor not found when trying to save OTP");
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
        const categories = await Category.find().select("name");
        return categories.map((category) => category.name);
    }

    async findDoctorById(doctorId: string): Promise<DoctorType | null> {
        return Doctor.findOne({ _id: doctorId });
    }

    async updateOfficialDetails(doctorId: string, officialDetails: Partial<DoctorType>): Promise<DoctorType | null> {
        return Doctor.findOneAndUpdate({ _id: doctorId }, officialDetails, { new: true });
    }

    async updatePersonalDetails(doctorId: string, personalDetails: Partial<DoctorType>): Promise<DoctorType | null> {
        return Doctor.findOneAndUpdate({ _id: doctorId }, personalDetails, { new: true });
    }

    async updateDoctorProfileImage(doctorId: string, profileImageUrl: string): Promise<DoctorType | null> {
        return Doctor.findOneAndUpdate({ _id: doctorId }, { profileImg: profileImageUrl }, { new: true });
    }

    async updatePassword(email: string, hashedPassword: string): Promise<void> {
        await Doctor.updateOne({ email }, { password: hashedPassword });
    }

    async updateDoctorAvailability(email: string, availability: boolean): Promise<DoctorType | null> {
        return Doctor.findOneAndUpdate({ email }, { availability }, { new: true });
    }

    async addSlotToDoctor(email: string, slot: any): Promise<DoctorType | null> {
        return Doctor.findOneAndUpdate({ email }, { $push: { slots: slot } }, { new: true });
    }

    async getSlotsForDoctor(email: string): Promise<any[]> {
        const doctor = await Doctor.findOne({ email }).select("slots");
    
        if (doctor) {
            const currentDate = new Date().toISOString().split("T")[0];
            doctor.slots = doctor.slots?.filter((slot) => slot.date >= currentDate) || [];
            await doctor.save();
            return doctor.slots;
        }
    
        return [];
    }
    
}

export default new DoctorRepository();
