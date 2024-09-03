import { Request, Response } from 'express';
import AdminService from '../services/adminService';
import { HttpStatus } from '../utils/httpStatus';

const adminServices = new AdminService();

class AdminController {

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const serviceResponse = await adminServices.login(email, password);
            res.status(HttpStatus.OK).json(serviceResponse);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Wrong email") {
                    res.status(HttpStatus.UNAUTHORIZED).json({ message: "Email not found" });
                } else if (error.message === "Wrong password") {
                    res.status(HttpStatus.UNAUTHORIZED).json({ message: "Password is incorrect" });
                } else {
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error", error: error.message });
                }
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Unknown error occurred" });
            }
        }
    }

    async getUser(req: Request, res: Response) {
        try {
            const users = await adminServices.getUser();
            res.status(HttpStatus.OK).json(users);
        } catch (error) {
            if (error instanceof Error) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error", error: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error", error: "An unknown error occurred" });
            }
        }
    }

    async unBlockUser(req: Request, res: Response) {
        try {
            const email = req.query.email as string;
            const serviceResponse = await adminServices.unBlockUser(email);
            res.status(HttpStatus.OK).json(serviceResponse);
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Something went wrong, please try again later");
        }
    }

    async blockUser(req: Request, res: Response) {
        try {
            const email = req.query.email as string;
            const serviceResponse = await adminServices.blockUser(email);
            res.status(HttpStatus.OK).json(serviceResponse);
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Something went wrong, please try again later");
        }
    }

    async getDoctor(req: Request, res: Response) {
        try {
            const doctors = await adminServices.getDoctor();
            res.status(HttpStatus.OK).json(doctors);
        } catch (error) {
            if (error instanceof Error) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error", error: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error", error: "An unknown error occurred" });
            }
        }
    }

    async blockDoctor(req: Request, res: Response) {
        try {
            const email = req.query.email as string;
            const serviceResponse = await adminServices.blockDoctor(email);
            res.status(HttpStatus.OK).json(serviceResponse);
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Something went wrong, please try again later");
        }
    }

    async unBlockDoctor(req: Request, res: Response) {
        try {
            const email = req.query.email as string;
            const serviceResponse = await adminServices.unBlockDoctor(email);
            res.status(HttpStatus.OK).json(serviceResponse);
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Something went wrong, please try again later");
        }
    }

    async verifyDoctor(req: Request, res: Response) {
        try {
            const email = req.query.email as string;
            const serviceResponse = await adminServices.verifyDoctor(email);
            res.status(HttpStatus.OK).json(serviceResponse);
        } catch (error: any) {
            console.error('Error in verifyDoctorController:', error.message);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Something went wrong, please try again later");
        }
    }

    async rejectDoctor(req: Request, res: Response) {
        try {
            const email = req.query.email as string;
            const serviceResponse = await adminServices.rejectDoctor(email);
            res.status(HttpStatus.OK).json(serviceResponse);
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Something went wrong, please try again later");
        }
    }

    async getCategories(req: Request, res: Response) {
        try {
            const categories = await adminServices.getCategories();
            res.status(HttpStatus.OK).json(categories);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Something went wrong, please try again later");
        }
    }

    async addCategory(req: Request, res: Response) {
        try {
            const { name } = req.body;
            const newCategory = await adminServices.addCategory(name);
            res.status(HttpStatus.CREATED).json(newCategory);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Something went wrong, please try again later");
        }
    }

    async deleteCategory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await adminServices.deleteCategory(id);
            res.status(HttpStatus.OK).json({ message: "Category deleted successfully" });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Something went wrong, please try again later");
        }
    }

    async editCategory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const updatedCategory = await adminServices.editCategory(id, name);
            res.status(HttpStatus.OK).json({ message: "Category edited successfully", updatedCategory });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Something went wrong, please try again later");
        }
    }
}

export default AdminController;
