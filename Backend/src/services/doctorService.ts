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

    async getDoctorProfile(doctorId: string): Promise<DoctorType | null> {
        return await doctorRepository.findDoctorById(doctorId);
    }

    async updateOfficialDetails(doctorId: string, officialDetails: Partial<DoctorType>): Promise<DoctorType | null> {
        return await doctorRepository.updateOfficialDetails(doctorId, officialDetails);
    }

    async updatePersonalDetails(doctorId: string, personalDetails: Partial<DoctorType>): Promise<DoctorType | null> {
        return await doctorRepository.updatePersonalDetails(doctorId, personalDetails);
    }

    async updateDoctorProfileImage(doctorId: string, profileImageUrl: string) {
        try {
            const updatedDoctor = await doctorRepository.updateDoctorProfileImage(doctorId, profileImageUrl);
            return { success: true, doctor: updatedDoctor };
        } catch (error) {
            console.error('Error updating doctor profile image:', error);
            return { success: false };
        }
    }

    async requestOtpForPasswordReset(email: string): Promise<{ success: boolean; message: string; otp?: string }> {
        const doctor = await doctorRepository.findDoctorByEmail(email)
        if (!doctor) {
            return { success: false, message: 'Doctor not found' };
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        console.log("Password Reset OTP: ", otp)

        try {
            doctor.otp = otp;
            await sendOtpEmail(email, otp);
            return { success: true, message: 'OTP sent to your email', otp}
        } catch (error) {
            console.error('Failed to send OTP:', error);
            return { success: false, message: 'Failed to send OTP' };
        }
    }

    async verifyForgotOtp(email: string, otp: string): Promise<{ success: boolean; message: string }> {
        const doctor = await doctorRepository.findDoctorByEmail(email);
        if (!doctor) {
            return { success: false, message: 'Doctor not found' }
        }
        return { success: true, message: 'OTP verified successfully'}
    }

    async resendForgotOtp(email: string): Promise<{ success: boolean; message: string, otp?: string }> {
        const doctor = await doctorRepository.findDoctorByEmail(email);

        if (!doctor) {
            return { success: false, message: 'Doctor not found' }
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
            await doctorRepository.updatePassword(email, hashedPassword);
            return { success: true, message: 'Password updated successfully' };
        } catch (error) {
            console.error('Error updating password:', error);
            return { success: false, message: 'Failed to update password' };
        }
    }

    async updateAvailability(doctorId: string, availability: boolean) {
        console.log("111111111111111111")
        const updatedDoctor = await doctorRepository.updateDoctorAvailability(doctorId, availability);
        console.log("hiiiii",updatedDoctor)
        if (!updatedDoctor) {
          throw new Error('Failed to update availability');
        }
        return updatedDoctor;
      }

}
 
export default new DoctorService();
