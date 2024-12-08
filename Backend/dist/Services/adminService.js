"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jwtConfig_1 = require("../Utils/jwtConfig");
const nodeMailer_1 = require("../Config/nodeMailer");
dotenv_1.default.config();
class AdminService {
    _adminRepository;
    constructor(adminRepository) {
        this._adminRepository = adminRepository;
    }
    async login(email, password) {
        try {
            const adminEmail = process.env.ADMIN_EMAIL;
            const adminPassword = process.env.ADMIN_PASS;
            if (adminEmail === email) {
                if (adminPassword === password) {
                    const adminToken = (0, jwtConfig_1.generateAccessToken)(email);
                    return { token: adminToken };
                }
                else {
                    throw new Error("Wrong password");
                }
            }
            else {
                throw new Error("Wrong email");
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.log("Login Service error:", error.message);
            }
            else {
                console.log("Unknown error occurred during login service");
            }
            throw error;
        }
    }
    async getUser(searchQuery) {
        try {
            return await this._adminRepository.getUsers(searchQuery);
        }
        catch (error) {
            console.error('Error fetching users in service:', error);
            throw new Error('Error fetching users');
        }
    }
    async unBlockUser(email) {
        try {
            const response = await this._adminRepository.unBlockUser(email);
            if (response.modifiedCount === 1) {
                return "User unblocked successfully";
            }
            else {
                throw new Error("Can't unblock user");
            }
        }
        catch (error) {
            throw error;
        }
    }
    async blockUser(email) {
        try {
            const response = await this._adminRepository.blockUser(email);
            if (response.modifiedCount === 1) {
                return "User blocked successfully";
            }
            else {
                throw new Error("Can't block user");
            }
        }
        catch (error) {
            throw error;
        }
    }
    async getDoctor(searchQuery) {
        try {
            const doctors = await this._adminRepository.getDoctors(searchQuery);
            return doctors;
        }
        catch (error) {
            console.error('Error fetching doctors in service:', error);
            throw new Error('Error fetching doctors');
        }
    }
    async blockDoctor(email) {
        try {
            const response = await this._adminRepository.blockDoctor(email);
            if (response.modifiedCount === 1) {
                return "Doctor blocked successfully";
            }
            else {
                throw new Error("Can't block doctor");
            }
        }
        catch (error) {
            throw error;
        }
    }
    async unBlockDoctor(email) {
        try {
            const response = await this._adminRepository.unBlockDoctor(email);
            if (response.modifiedCount === 1) {
                return "Doctor unblocked successfully";
            }
            else {
                throw new Error("Can't unblock doctor");
            }
        }
        catch (error) {
            throw error;
        }
    }
    async verifyDoctor(email) {
        try {
            const response = await this._adminRepository.verifyDoctor(email);
            if (response.modifiedCount === 1) {
                await (0, nodeMailer_1.sendVerificationEmail)(email);
                return "Doctor verified successfully";
            }
            else {
                throw new Error("Can't verify doctor");
            }
        }
        catch (error) {
            throw error;
        }
    }
    async rejectDoctor(email) {
        try {
            const response = await this._adminRepository.rejectDoctor(email);
            if (response.deletedCount === 1) {
                await (0, nodeMailer_1.sendRejectionEmail)(email);
                return "Doctor rejected and removed successfully";
            }
            else {
                throw new Error("Can't reject doctor");
            }
        }
        catch (error) {
            throw error;
        }
    }
    async getCategories(searchQuery) {
        try {
            const categories = await this._adminRepository.getCategories(searchQuery);
            return categories;
        }
        catch (error) {
            throw new Error('Error fetching categories');
        }
    }
    async addCategory(name) {
        try {
            const newCategory = await this._adminRepository.addCategory(name);
            return newCategory;
        }
        catch (error) {
            throw new Error('Error adding category');
        }
    }
    async deleteCategory(id) {
        try {
            await this._adminRepository.deleteCategory(id);
        }
        catch (error) {
            throw new Error('Error deleting category');
        }
    }
    async editCategory(id, newName) {
        try {
            const editedCategory = await this._adminRepository.editCategory(id, newName);
            return editedCategory;
        }
        catch (error) {
            throw new Error('Error editing category');
        }
    }
}
exports.default = AdminService;
