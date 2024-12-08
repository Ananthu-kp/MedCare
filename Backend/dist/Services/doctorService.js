"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const doctorRepository_1 = __importDefault(require("../Repositories/doctorRepository"));
const bcryptUtil_1 = __importDefault(require("../Utils/bcryptUtil"));
const nodeMailer_1 = require("../Config/nodeMailer");
class DoctorService {
    async registerDoctor(doctor) {
        const existingDoctor = await doctorRepository_1.default.findDoctorByEmail(doctor.email);
        if (existingDoctor) {
            return { success: false, message: 'Doctor already exists', otp: '' };
        }
        const savedDoctor = await doctorRepository_1.default.createDoctor(doctor);
        console.log(savedDoctor);
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        console.log("your otp ->", otp);
        await (0, nodeMailer_1.sendOtpEmail)(savedDoctor.email, otp);
        return { success: true, message: 'Doctor registered successfully', otp };
    }
    async verifyOtp(email, otp) {
        const isOtpValid = await doctorRepository_1.default.verifyOtp(email, otp);
        if (!isOtpValid) {
            return { success: false, message: "Invalid OTP" };
        }
        return { success: true, message: "OTP verified successfully" };
    }
    async resendOtp(email) {
        const doctor = await doctorRepository_1.default.findDoctorByEmail(email);
        if (!doctor) {
            return { success: false, message: "Doctor not found" };
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        console.log("resend otp -> ", otp);
        await (0, nodeMailer_1.sendOtpEmail)(doctor.email, otp, true);
        await doctorRepository_1.default.saveOtp(email, otp);
        return { success: true, message: "OTP sent successfully" };
    }
    async clearTempDoctorData(email) {
        await doctorRepository_1.default.clearTempDoctorData(email);
    }
    async getCategories() {
        try {
            return await doctorRepository_1.default.getAllCategories();
        }
        catch (error) {
            throw new Error('Service error while fetching categories');
        }
    }
    async getDoctorProfile(doctorId) {
        return await doctorRepository_1.default.findDoctorById(doctorId);
    }
    async updateOfficialDetails(doctorId, officialDetails) {
        return await doctorRepository_1.default.updateOfficialDetails(doctorId, officialDetails);
    }
    async updatePersonalDetails(doctorId, personalDetails) {
        return await doctorRepository_1.default.updatePersonalDetails(doctorId, personalDetails);
    }
    async updateDoctorProfileImage(doctorId, profileImageUrl) {
        try {
            const updatedDoctor = await doctorRepository_1.default.updateDoctorProfileImage(doctorId, profileImageUrl);
            return { success: true, doctor: updatedDoctor };
        }
        catch (error) {
            console.error('Error updating doctor profile image:', error);
            return { success: false };
        }
    }
    async requestOtpForPasswordReset(email) {
        const doctor = await doctorRepository_1.default.findDoctorByEmail(email);
        if (!doctor) {
            return { success: false, message: 'Doctor not found' };
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        console.log("Password Reset OTP: ", otp);
        try {
            doctor.otp = otp;
            await (0, nodeMailer_1.sendOtpEmail)(email, otp);
            return { success: true, message: 'OTP sent to your email', otp };
        }
        catch (error) {
            console.error('Failed to send OTP:', error);
            return { success: false, message: 'Failed to send OTP' };
        }
    }
    async verifyForgotOtp(email, otp) {
        const doctor = await doctorRepository_1.default.findDoctorByEmail(email);
        if (!doctor) {
            return { success: false, message: 'Doctor not found' };
        }
        return { success: true, message: 'OTP verified successfully' };
    }
    async resendForgotOtp(email) {
        const doctor = await doctorRepository_1.default.findDoctorByEmail(email);
        if (!doctor) {
            return { success: false, message: 'Doctor not found' };
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        console.log("Resend otp =>", otp);
        try {
            await (0, nodeMailer_1.sendOtpEmail)(email, otp, true);
            return { success: true, message: 'OTP resent to your email', otp };
        }
        catch (error) {
            console.error('Failed to send OTP:', error);
            return { success: false, message: 'Failed to send OTP' };
        }
    }
    async updatePassword(email, newPassword) {
        if (!newPassword) {
            return { success: false, message: 'Password cannot be empty' };
        }
        try {
            const hashedPassword = await bcryptUtil_1.default.hashPassword(newPassword);
            await doctorRepository_1.default.updatePassword(email, hashedPassword);
            return { success: true, message: 'Password updated successfully' };
        }
        catch (error) {
            console.error('Error updating password:', error);
            return { success: false, message: 'Failed to update password' };
        }
    }
    async updateAvailability(email, availability) {
        try {
            const updatedDoctor = await doctorRepository_1.default.updateDoctorAvailability(email, availability);
            if (!updatedDoctor) {
                throw new Error('Failed to update availability');
            }
            return updatedDoctor;
        }
        catch (error) {
            console.error('Error in updateAvailability service:', error);
            throw error;
        }
    }
    async addSlots(email, slot) {
        return doctorRepository_1.default.addSlotToDoctor(email, slot);
    }
    async getSlots(email) {
        const slots = await doctorRepository_1.default.getSlotsForDoctor(email);
        return slots || [];
    }
}
exports.default = new DoctorService();
