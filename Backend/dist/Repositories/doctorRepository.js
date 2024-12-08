"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const categoryModel_1 = __importDefault(require("../Model/categoryModel"));
const doctorModel_1 = require("../Model/doctorModel");
class DoctorRepository {
    async createDoctor(doctor) {
        return new doctorModel_1.Doctor(doctor).save();
    }
    async findDoctorByEmail(email) {
        return doctorModel_1.Doctor.findOne({ email });
    }
    async saveOtp(email, otp) {
        const doctor = await this.findDoctorByEmail(email);
        if (!doctor) {
            throw new Error('Doctor not found when trying to save OTP');
        }
        await doctorModel_1.Doctor.updateOne({ email }, { otp, tempData: true, otpCreatedAt: new Date() });
    }
    async verifyOtp(email, otp) {
        const doctor = await doctorModel_1.Doctor.findOne({ email, otp, tempData: true });
        return !!doctor;
    }
    async clearTempDoctorData(email) {
        await doctorModel_1.Doctor.updateOne({ email }, { $unset: { otp: 1, tempData: 1, otpCreatedAt: 1 } });
    }
    async getAllCategories() {
        try {
            const categories = await categoryModel_1.default.find().select('name');
            return categories.map(category => category.name);
        }
        catch (error) {
            throw new Error('Error fetching categories from the database.');
        }
    }
    async findDoctorById(doctorId) {
        return await doctorModel_1.Doctor.findOne({ email: doctorId });
    }
    async updateOfficialDetails(doctorId, officialDetails) {
        return await doctorModel_1.Doctor.findOneAndUpdate({ email: doctorId }, officialDetails, { new: true });
    }
    async updatePersonalDetails(doctorId, personalDetails) {
        return await doctorModel_1.Doctor.findOneAndUpdate({ email: doctorId }, personalDetails, { new: true });
    }
    async updateDoctorProfileImage(doctorId, profileImageUrl) {
        return await doctorModel_1.Doctor.findOneAndUpdate({ email: doctorId }, { profileImg: profileImageUrl });
    }
    async updatePassword(email, hashedPassword) {
        await doctorModel_1.Doctor.updateOne({ email }, { password: hashedPassword });
    }
    async updateDoctorAvailability(email, availability) {
        try {
            const updatedDoctor = await doctorModel_1.Doctor.findOneAndUpdate({ email }, { availability }, { new: true });
            if (!updatedDoctor) {
                console.error('No doctor found with the given ID');
            }
            return updatedDoctor;
        }
        catch (error) {
            console.error('Error in updateDoctorAvailability repository:', error);
            throw error;
        }
    }
    async addSlotToDoctor(email, slot) {
        return doctorModel_1.Doctor.findOneAndUpdate({ email }, { $push: { slots: slot } }, { new: true });
    }
    async getSlotsForDoctor(email) {
        const doctor = await doctorModel_1.Doctor.findOne({ email }).select('slots');
        if (doctor) {
            const currentDate = new Date().toISOString().split('T')[0];
            doctor.slots = doctor.slots?.filter(slot => slot.date >= currentDate);
            await doctor.save();
        }
        return doctor ? doctor.slots : [];
    }
}
exports.default = new DoctorRepository();
