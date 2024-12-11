import { IDoctorRepository } from "../Interfaces/doctorRepository.interface";
import bcryptUtil from "../Utils/bcryptUtil";
import { DoctorType } from "../Model/doctorModel";
import { sendOtpEmail } from "../Config/nodeMailer";

class DoctorService {
    private _doctorRepository: IDoctorRepository;

    constructor(doctorRepository: IDoctorRepository) {
        this._doctorRepository = doctorRepository
    }
    
    async registerDoctor(doctor: DoctorType): Promise<{ success: boolean; message: string; otp: string }> {
        const existingDoctor = await this._doctorRepository.findDoctorByEmail(doctor.email);
        if (existingDoctor) {
            return { success: false, message: 'Doctor already exists', otp: '' };
        }

        const savedDoctor = await this._doctorRepository.createDoctor(doctor);
        console.log(savedDoctor);

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        console.log("your otp ->", otp);

        await sendOtpEmail(savedDoctor.email, otp);
        return { success: true, message: 'Doctor registered successfully', otp };
    }

    async verifyOtp(email: string, otp: string): Promise<{ success: boolean; message: string }> {
        const isOtpValid = await this._doctorRepository.verifyOtp(email, otp);
        if (!isOtpValid) {
            return { success: false, message: "Invalid OTP" };
        }

        return { success: true, message: "OTP verified successfully" };
    }

    async resendOtp(email: string): Promise<{ success: boolean; message: string }> {
        const doctor = await this._doctorRepository.findDoctorByEmail(email);
        if (!doctor) {
            return { success: false, message: "Doctor not found" };
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        console.log("resend otp -> ", otp);

        await sendOtpEmail(doctor.email, otp, true);
        await this._doctorRepository.saveOtp(email, otp);

        return { success: true, message: "OTP sent successfully" };
    }

    async clearTempDoctorData(email: string): Promise<void> {
        await this._doctorRepository.clearTempDoctorData(email);
    }

    async getCategories(): Promise<string[]> {
        try {
            return await this._doctorRepository.getAllCategories();
        } catch (error) {
            throw new Error('Service error while fetching categories');
        }
    }

    async getDoctorProfile(doctorId: string): Promise<DoctorType | null> {
        return await this._doctorRepository.findDoctorById(doctorId);
    }

    async updateOfficialDetails(doctorId: string, officialDetails: Partial<DoctorType>): Promise<DoctorType | null> {
        return await this._doctorRepository.updateOfficialDetails(doctorId, officialDetails);
    }

    async updatePersonalDetails(doctorId: string, personalDetails: Partial<DoctorType>): Promise<DoctorType | null> {
        return await this._doctorRepository.updatePersonalDetails(doctorId, personalDetails);
    }

    async updateDoctorProfileImage(doctorId: string, profileImageUrl: string) {
        try {
            const updatedDoctor = await this._doctorRepository.updateDoctorProfileImage(doctorId, profileImageUrl);
            return { success: true, doctor: updatedDoctor };
        } catch (error) {
            console.error('Error updating doctor profile image:', error);
            return { success: false };
        }
    }

    async requestOtpForPasswordReset(email: string): Promise<{ success: boolean; message: string; otp?: string }> {
        const doctor = await this._doctorRepository.findDoctorByEmail(email)
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
        const doctor = await this._doctorRepository.findDoctorByEmail(email);
        if (!doctor) {
            return { success: false, message: 'Doctor not found' }
        }
        return { success: true, message: 'OTP verified successfully'}
    }

    async resendForgotOtp(email: string): Promise<{ success: boolean; message: string, otp?: string }> {
        const doctor = await this._doctorRepository.findDoctorByEmail(email);

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
            await this._doctorRepository.updatePassword(email, hashedPassword);
            return { success: true, message: 'Password updated successfully' };
        } catch (error) {
            console.error('Error updating password:', error);
            return { success: false, message: 'Failed to update password' };
        }
    }

    async updateAvailability(email: string, availability: boolean) {
        try {
            const updatedDoctor = await this._doctorRepository.updateDoctorAvailability(email, availability);
            if (!updatedDoctor) {
                throw new Error('Failed to update availability');
            }
            return updatedDoctor;
        } catch (error) {
            console.error('Error in updateAvailability service:', error);
            throw error;
        }
    }

    async addSlots(email: string, slot: any) {
        return this._doctorRepository.addSlotToDoctor(email, slot);
    }

    async getSlots(email: string) {
        const slots = await this._doctorRepository.getSlotsForDoctor(email);
        return slots || [];
    }
    
}
 
export default  DoctorService;
