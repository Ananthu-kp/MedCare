import dotenv from 'dotenv';
import { generateAccessToken } from "../utils/jwtConfig";
import AdminRepository from '../repositories/adminRepository';

dotenv.config();

class AdminService {
    private adminRepository: AdminRepository

    constructor() {
        this.adminRepository = new AdminRepository()
    }


    async loginService(email: string, password: string) {
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


    async getUserServices() {
        try {
            const users = await this.adminRepository.getUsers();
            return users;
        } catch (error) {
            console.error('Error fetching users in service:', error)
            throw new Error('Error fetching users')
        }
    }

    async unBlockUserService(email: string) {
        try {
            const response = await this.adminRepository.unBlockUserRepository(email);
            if (response.modifiedCount === 1) {
                return "User unblocked successfully"
            } else {
                throw new Error("Can't unblock user")
            }
        } catch (error) {
            throw error;
        }
    }

    async blockUserService(email: string) {
        try {
            const response = await this.adminRepository.blockUserRespository(email);
            if (response.modifiedCount === 1) {
                return "User blocked successfully"
            } else {
                throw new Error("Can't block user")
            }
        } catch (error) {
            throw error;
        }
    }


    async getDoctorServices() {
        try {
            const doctors = await this.adminRepository.getDoctors();
            return doctors;
        } catch (error) {
            console.error('Error fetching doctors in service:', error);
            throw new Error('Error fetching doctors');
        }
    }

    async blockDoctorService(email: string) {
        try {
            const response = await this.adminRepository.blockDoctorRepository(email);
            if (response.modifiedCount === 1) {
                return "Doctor blocked successfully";
            } else {
                throw new Error("Can't block doctor");
            }
        } catch (error) {
            throw error;
        }
    }

    async unBlockDoctorService(email: string) {
        try {
            const response = await this.adminRepository.unBlockDoctorRepository(email);
            if (response.modifiedCount === 1) {
                return "Doctor unblocked successfully";
            } else {
                throw new Error("Can't unblock doctor");
            }
        } catch (error) {
            throw error;
        }
    }

    async verifyDoctorService(email: string) {
        try {
            const response = await this.adminRepository.verifyDoctorRepository(email);
            if (response.modifiedCount === 1) {
                return "Doctor verified successfully";
            } else {
                throw new Error("Can't verify doctor");
            }
        } catch (error) {
            throw error;
        }
    }

    async rejectDoctorService(email: string) {
        try {
            const response = await this.adminRepository.rejectDoctorRepository(email);
            if (response.deletedCount === 1) {
                return "Doctor rejected and removed successfully";
            } else {
                throw new Error("Can't reject doctor");
            }
        } catch (error) {
            throw error;
        }
    }


}

export default AdminService;
