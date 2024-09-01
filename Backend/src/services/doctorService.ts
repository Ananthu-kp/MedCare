import doctorRepository from "../repositories/doctorRepository";
import bcryptUtil from "../utils/bcryptUtil";
import { DoctorType } from "../Model/doctorModel";
import { sendOtpEmail } from "../config/nodeMailer";

class DoctorService {
    async registerDoctor(doctor: DoctorType): Promise<{ success: boolean; message: string; otp: string }> {
        const existingDoctor = await doctorRepository.findDoctorByEmail(doctor.email);
        if (existingDoctor) {
            return { success: false, message: 'Doctor already exists', otp: '' };
        }

        const savedDoctor = await doctorRepository.createDoctor(doctor);
        console.log(savedDoctor);

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        console.log("your otp ->", otp);
        
        await sendOtpEmail(savedDoctor.email, otp);
        return { success: true, message: 'Doctor registered successfully', otp };
    }

    async verifyOtp(email: string, otp: string): Promise<{ success: boolean; message: string }> {
        const isOtpValid = await doctorRepository.verifyOtp(email, otp);
        if (!isOtpValid) {
          return { success: false, message: "Invalid OTP" };
        }
      
        return { success: true, message: "OTP verified successfully" };
      }

    async resendOtp(email: string): Promise<{ success: boolean; message: string }> {
        const doctor = await doctorRepository.findDoctorByEmail(email);
        if (!doctor) {
            return { success: false, message: "Doctor not found" };
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        console.log("resend otp -> ", otp);
        
        await sendOtpEmail(doctor.email, otp);
        await doctorRepository.saveOtp(email, otp);

        return { success: true, message: "OTP sent successfully" };
    }

    async clearTempDoctorData(email: string): Promise<void> {
        await doctorRepository.clearTempDoctorData(email);
    }

    async getCategories(): Promise<string[]> {
        try {
            return await doctorRepository.getAllCategories();
        } catch (error) {
            throw new Error('Service error while fetching categories');
        }
    }
}

export default new DoctorService();
