import dotenv from 'dotenv';
import { generateAccessToken } from "../utils/jwtConfig";
import AdminRepository from '../repositories/adminRepository';

dotenv.config();

class AdminService {
    private _adminRepository: AdminRepository

    constructor() {
        this._adminRepository = new AdminRepository()
    }


    async login(email: string, password: string) {
        try {

            const doctor = await this._adminRepository.findDoctorByEmail(email);

            if (!doctor) {
                throw new Error("Wrong email")
            }
            if (doctor.isBlocked) {
                throw new Error("Account is blocked")
            }
            
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


    async getUser() {
        try {
            const users = await this._adminRepository.getUsers();
            return users;
        } catch (error) {
            console.error('Error fetching users in service:', error)
            throw new Error('Error fetching users')
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


    async getDoctor() {
        try {
            const doctors = await this._adminRepository.getDoctors();
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
