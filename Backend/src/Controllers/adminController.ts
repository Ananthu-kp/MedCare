import { Request, Response } from 'express';
import AdminService from '../services/adminService';

const adminServices = new AdminService();

class AdminController {

    async loginController(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const serviceResponse = await adminServices.loginService(email, password);
            res.status(200).json(serviceResponse);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Wrong email") {
                    res.status(401).json({ message: "Email not found" });
                } else if (error.message === "Wrong password") {
                    res.status(401).json({ message: "Password is incorrect" });
                } else {
                    res.status(500).json({ message: "Internal server error", error: error.message });
                }
            } else {
                res.status(500).json({ message: "Unknown error occurred" });
            }
        }
    }
}

export default AdminController;
