import { IAdminRepository } from "../Interfaces/adminRepository.interface";
import { IAdminService } from "../Interfaces/adminService.interface";
import { generateAccessToken, generateRefreshToken } from "../Utils/jwtConfig";

class AdminService implements IAdminService {
    private adminRepository: IAdminRepository;

    constructor(adminRepository: IAdminRepository) {
        this.adminRepository = adminRepository;
    }

    async login(email: string, password: string): Promise<{ token: string; refreshToken: string }> {
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASS) {
            throw new Error('Invalid credentials');
        }

        const accessToken = generateAccessToken(email, email); 
        const refreshToken = generateRefreshToken(email, email);

        return {
            token: accessToken,
            refreshToken: refreshToken
        };
    }

    async getUser(searchQuery?: string): Promise<any[]> {
        return await this.adminRepository.getUsers(searchQuery);
    }

    async blockUser(email: string): Promise<string> {
        await this.adminRepository.blockUser(email);
        return 'User blocked successfully';
    }

    async unBlockUser(email: string): Promise<string> {
        await this.adminRepository.unBlockUser(email);
        return 'User unblocked successfully';
    }

    async getDoctor(searchQuery?: string): Promise<any[]> {
        return await this.adminRepository.getDoctors(searchQuery);
    }

    async blockDoctor(email: string): Promise<string> {
        await this.adminRepository.blockDoctor(email);
        return 'Doctor blocked successfully';
    }

    async unBlockDoctor(email: string): Promise<string> {
        await this.adminRepository.unBlockDoctor(email);
        return 'Doctor unblocked successfully';
    }

    async verifyDoctor(email: string): Promise<string> {
        const doctor = await this.adminRepository.findDoctorByEmail(email);
        if (!doctor) {
            throw new Error('Doctor not found');
        }
        await this.adminRepository.verifyDoctor(email);
        return 'Doctor verified successfully';
    }

    async rejectDoctor(email: string): Promise<string> {
        await this.adminRepository.rejectDoctor(email);
        return 'Doctor rejected successfully';
    }

    async getCategories(searchQuery?: string): Promise<any[]> {
        return await this.adminRepository.getCategories(searchQuery);
    }

    async addCategory(name: string): Promise<any> {
        return await this.adminRepository.addCategory(name);
    }

    async deleteCategory(id: string): Promise<void> {
        await this.adminRepository.deleteCategory(id);
    }

    async editCategory(id: string, newName: string): Promise<any> {
        return await this.adminRepository.editCategory(id, newName);
    }
}

export default AdminService;