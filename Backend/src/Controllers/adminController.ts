import { Request, Response } from 'express';
import AdminService from '../services/adminService';
import doctorRepository from '../repositories/doctorRepository';

const adminServices = new AdminService();

class AdminController {

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const serviceResponse = await adminServices.login(email, password);
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


    async getUser(req: Request, res: Response) {
        try {
            const users = await adminServices.getUser();
            res.status(200).json(users)
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: "Internal server error", error: error.message });
            } else {
                res.status(500).json({ message: "Internal server error", error: "An unknown error occurred" });
            }
        }
    };

    async unBlockUser(req: Request, res: Response) {
        try {
            const email = req.query.email as string
            const serviceResponse = await adminServices.unBlockUser(email)
            res.status(200).json(serviceResponse)
        } catch (error: any) {
            res.status(500).json("Something went wrong, please try again later");
        }
    }

    async blockUser(req: Request, res: Response) {
        try {
            const email = req.query.email as string
            const serviceResponse = await adminServices.blockUser(email)
            res.status(200).json(serviceResponse)
        } catch (error: any) {
            res.status(500).json("Something went wrong, please try again later");
        }
    }


    async getDoctor(req: Request, res: Response) {
        try {
            const doctors = await adminServices.getDoctor();
            res.status(200).json(doctors);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: "Internal server error", error: error.message });
            } else {
                res.status(500).json({ message: "Internal server error", error: "An unknown error occurred" });
            }
        }
    }

    async blockDoctor(req: Request, res: Response) {
        try {
            const email = req.query.email as string;
            const serviceResponse = await adminServices.blockDoctor(email);
            res.status(200).json(serviceResponse);
        } catch (error: any) {
            res.status(500).json("Something went wrong, please try again later");
        }
    }

    async unBlockDoctor(req: Request, res: Response) {
        try {
            const email = req.query.email as string;
            const serviceResponse = await adminServices.unBlockDoctor(email);
            res.status(200).json(serviceResponse);
        } catch (error: any) {
            res.status(500).json("Something went wrong, please try again later");
        }
    }

    async verifyDoctor(req: Request, res: Response) {
        try {
            const email = req.query.email as string;
            const serviceResponse = await adminServices.verifyDoctor(email);
            res.status(200).json(serviceResponse);
        } catch (error: any) {
            console.error('Error in verifyDoctorController:', error.message);
            res.status(500).json("Something went wrong, please try again later");
        }
    }

    async rejectDoctor(req: Request, res: Response) {
        try {
            const email = req.query.email as string;
            const serviceResponse = await adminServices.rejectDoctor(email);
            res.status(200).json(serviceResponse);
        } catch (error: any) {
            res.status(500).json("Something went wrong, please try again later");
        }
    }


    async getCategories(req: Request, res: Response) {
        try {
            const categories = await adminServices.getCategories();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json("Something went wrong, please try again later");
        }
    }

    async addCategory(req: Request, res: Response) {
        try {
            const { name } = req.body;
            const newCategory = await adminServices.addCategory(name);
            res.status(201).json(newCategory);
        } catch (error) {
            res.status(500).json("Something went wrong, please try again later");
        }
    }

    async deleteCategory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await adminServices.deleteCategory(id);
            res.status(200).json({ message: "Category deleted successfully" });
        } catch (error) {
            res.status(500).json("Something went wrong, please try again later");
        }
    }

    async editCategory(req: Request, res: Response) {
        try {
            const { id } = req.params; 
            const { name } = req.body; 
            const updatedCategory = await adminServices.editCategory(id, name);
            res.status(200).json({ message: "Category edited successfully", updatedCategory });
        } catch (error) {
            res.status(500).json("Something went wrong, please try again later");
        }
    }

}

export default AdminController;
