import dotenv from 'dotenv';
import { generateAccessToken } from "../utils/jwtConfig";

dotenv.config();

class AdminService {
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
}

export default AdminService;
