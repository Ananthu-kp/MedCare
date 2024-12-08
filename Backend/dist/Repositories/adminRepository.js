"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = require("../Model/userModel");
const doctorModel_1 = require("../Model/doctorModel");
const categoryModel_1 = __importDefault(require("../Model/categoryModel"));
class AdminRepository {
    async getUsers(searchQuery) {
        try {
            const filter = searchQuery ? { name: { $regex: searchQuery, $options: 'i' } } : {};
            return await userModel_1.User.find(filter).exec();
        }
        catch (error) {
            console.error('Error fetching users', error);
            throw new Error('Error fetching users');
        }
    }
    async unBlockUser(email) {
        try {
            return await userModel_1.User.updateOne({ email }, { isBlocked: false });
        }
        catch (error) {
            console.log("Error from database:", error);
            throw error;
        }
    }
    async blockUser(email) {
        try {
            return await userModel_1.User.updateOne({ email }, { isBlocked: true });
        }
        catch (error) {
            console.log("Error from database:", error);
            throw error;
        }
    }
    async getDoctors(searchQuery) {
        try {
            const filter = searchQuery ? { name: { $regex: searchQuery, $options: 'i' } } : {};
            const doctors = await doctorModel_1.Doctor.find(filter).exec();
            return doctors;
        }
        catch (error) {
            console.error('Error fetching doctors', error);
            throw new Error('Error fetching doctors');
        }
    }
    async findDoctorByEmail(email) {
        try {
            return await doctorModel_1.Doctor.findOne({ email }).exec();
        }
        catch (error) {
            console.error('Error finding doctor by email', error);
            throw new Error('Error finding doctor by email');
        }
    }
    async verifyDoctor(email) {
        try {
            return await doctorModel_1.Doctor.updateOne({ email }, { isVerified: true });
        }
        catch (error) {
            console.log("Error from database:", error);
            throw error;
        }
    }
    async blockDoctor(email) {
        try {
            return await doctorModel_1.Doctor.updateOne({ email }, { isBlocked: true });
        }
        catch (error) {
            console.log("Error from database:", error);
            throw error;
        }
    }
    async unBlockDoctor(email) {
        try {
            return await doctorModel_1.Doctor.updateOne({ email }, { isBlocked: false });
        }
        catch (error) {
            console.log("Error from database:", error);
            throw error;
        }
    }
    async rejectDoctor(email) {
        try {
            return await doctorModel_1.Doctor.deleteOne({ email });
        }
        catch (error) {
            console.log("Error from database:", error);
            throw error;
        }
    }
    async getCategories(searchQuery) {
        try {
            const filter = searchQuery ? { name: { $regex: searchQuery, $options: 'i' } } : {};
            return await categoryModel_1.default.find(filter);
        }
        catch (error) {
            console.log("Error from database:", error);
            throw error;
        }
    }
    async addCategory(name) {
        try {
            return await categoryModel_1.default.create({ name });
        }
        catch (error) {
            console.log("Error from database:", error);
            throw error;
        }
    }
    async deleteCategory(id) {
        try {
            return await categoryModel_1.default.findByIdAndDelete(id);
        }
        catch (error) {
            console.log("Error from database:", error);
            throw error;
        }
    }
    async editCategory(id, newName) {
        try {
            const updatedCategory = await categoryModel_1.default.findByIdAndUpdate(id, { name: newName }, { new: true });
            if (!updatedCategory) {
                throw new Error("Category not found");
            }
            return updatedCategory;
        }
        catch (error) {
            console.log("Error from database:", error);
            throw error;
        }
    }
}
exports.default = AdminRepository;
