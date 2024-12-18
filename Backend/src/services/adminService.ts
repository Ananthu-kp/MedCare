import dotenv from 'dotenv';
import { generateAccessToken } from "../Utils/jwtConfig";
import { IAdminService } from '../Interfaces/adminService.interface';
import { IAdminRepository } from '../Interfaces/adminRepository.interface';
import { sendRejectionEmail, sendVerificationEmail } from '../Config/nodeMailer';

dotenv.config();

class AdminService implements IAdminService {
    private _adminRepository: IAdminRepository

    constructor(adminRepository: IAdminRepository) {
        this._adminRepository = adminRepository
    }


    async login(email: string, password: string) {
        try {
            const adminEmail = process.env.ADMIN_EMAIL;
            const adminPassword = process.env.ADMIN_PASS;

            if (adminEmail === email) {
                if (adminPassword === password) {
                    const adminToken = generateAccessToken(email);
                    return { token: adminToken };
                } else {
                    throw new Error("Wrong password");
                }
            } else {
                throw new Error("Wrong email");
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log("Login Service error:", error.message);
            } else {
                console.log("Unknown error occurred during login service");
            }
            throw error;
        }
    }


    async getUser(searchQuery?: string): Promise<any[]> {
        try {
            return await this._adminRepository.getUsers(searchQuery);
        } catch (error) {
            console.error('Error fetching users in service:', error);
            throw new Error('Error fetching users');
        }
    }

    async unBlockUser(email: string) {
        try {
            const response = await this._adminRepository.unBlockUser(email);
            if (response.modifiedCount === 1) {
                return "User unblocked successfully"
            } else {
                throw new Error("Can't unblock user")
            }
        } catch (error) {
            throw error;
        }
    }

    async blockUser(email: string) {
        try {
            const response = await this._adminRepository.blockUser(email);
            if (response.modifiedCount === 1) {
                return "User blocked successfully"
            } else {
                throw new Error("Can't block user")
            }
        } catch (error) {
            throw error;
        }
    }


    async getDoctor(searchQuery?: string): Promise<any[]> {
        try {
            const doctors = await this._adminRepository.getDoctors(searchQuery);
            return doctors;
        } catch (error) {
            console.error('Error fetching doctors in service:', error);
            throw new Error('Error fetching doctors');
        }
    }

    async blockDoctor(email: string) {
        try {
            const response = await this._adminRepository.blockDoctor(email);
            if (response.modifiedCount === 1) {
                return "Doctor blocked successfully";
            } else {
                throw new Error("Can't block doctor");
            }
        } catch (error) {
            throw error;
        }
    }

    async unBlockDoctor(email: string) {
        try {
            const response = await this._adminRepository.unBlockDoctor(email);
            if (response.modifiedCount === 1) {
                return "Doctor unblocked successfully";
            } else {
                throw new Error("Can't unblock doctor");
            }
        } catch (error) {
            throw error;
        }
    }

    async verifyDoctor(email: string) {
        try {
            const response = await this._adminRepository.verifyDoctor(email);
            if (response.modifiedCount === 1) {
                await sendVerificationEmail(email);
                return "Doctor verified successfully";
            } else {
                throw new Error("Can't verify doctor");
            }
        } catch (error) {
            throw error;
        }
    }

    async rejectDoctor(email: string) {
        try {
            const response = await this._adminRepository.rejectDoctor(email);
            if (response.deletedCount === 1) {
                await sendRejectionEmail(email);
                return "Doctor rejected and removed successfully";
            } else {
                throw new Error("Can't reject doctor");
            }
        } catch (error) {
            throw error;
        }
    }



    async getCategories(searchQuery?: string) {
        try {
            const categories = await this._adminRepository.getCategories(searchQuery);
            return categories;
        } catch (error) {
            throw new Error('Error fetching categories');
        }
    }

    async addCategory(name: string) {
        try {
            const newCategory = await this._adminRepository.addCategory(name);
            return newCategory;
        } catch (error) {
            throw new Error('Error adding category');
        }
    }

    async deleteCategory(id: string) {
        try {
            await this._adminRepository.deleteCategory(id);
        } catch (error) {
            throw new Error('Error deleting category');
        }
    }

    async editCategory(id: string, newName: string) {
        try {
            const editedCategory = await this._adminRepository.editCategory(id, newName);
            return editedCategory;
        } catch (error) {
            throw new Error('Error editing category');
        }
    }

}

export default AdminService;
