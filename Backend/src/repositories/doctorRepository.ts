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
}

export default new DoctorRepository();