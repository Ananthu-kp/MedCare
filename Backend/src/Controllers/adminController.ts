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


    async getUserController(req: Request, res: Response) {
        try {
            const users = await adminServices.getUserServices();
            res.status(200).json(users)
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: "Internal server error", error: error.message });
            } else {
                res.status(500).json({ message: "Internal server error", error: "An unknown error occurred" });
            }
        }
    };

    async unBlockUserController(req: Request, res: Response) {
        try {
            const email = req.query.email as string
            const serviceResponse = await adminServices.unBlockUserService(email)
            res.status(200).json(serviceResponse)
        } catch (error: any) {
            res.status(500).json("Something went wrong, please try again later");
        }
    }

    async blockUserController(req: Request, res: Response) {
        try {
            const email = req.query.email as string
            const serviceResponse = await adminServices.blockUserService(email)
            res.status(200).json(serviceResponse)
        } catch (error: any) {
            res.status(500).json("Something went wrong, please try again later");
        }
    }


    async getDoctorController(req: Request, res: Response) {
        try {
            const doctors = await adminServices.getDoctorServices();
            res.status(200).json(doctors);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: "Internal server error", error: error.message });
            } else {
                res.status(500).json({ message: "Internal server error", error: "An unknown error occurred" });
            }
        }
    }

    async blockDoctorController(req: Request, res: Response) {
        try {
            const email = req.query.email as string;
            const serviceResponse = await adminServices.blockDoctorService(email);
            res.status(200).json(serviceResponse);
        } catch (error: any) {
            res.status(500).json("Something went wrong, please try again later");
        }
    }

    async unBlockDoctorController(req: Request, res: Response) {
        try {
            const email = req.query.email as string;
            const serviceResponse = await adminServices.unBlockDoctorService(email);
            res.status(200).json(serviceResponse);
        } catch (error: any) {
            res.status(500).json("Something went wrong, please try again later");
        }
    }

    async verifyDoctorController(req: Request, res: Response) {
        try {
            const email = req.query.email as string;
            const serviceResponse = await adminServices.verifyDoctorService(email);
            res.status(200).json(serviceResponse);
        } catch (error: any) {
            console.error('Error in verifyDoctorController:', error.message);
            res.status(500).json("Something went wrong, please try again later");
        }
    }

    async rejectDoctorController(req: Request, res: Response) {
        try {
            const email = req.query.email as string;
            const serviceResponse = await adminServices.rejectDoctorService(email);
            res.status(200).json(serviceResponse);
        } catch (error: any) {
            res.status(500).json("Something went wrong, please try again later");
        }
    }

}

export default AdminController;
