import { Request, Response } from 'express';
import { IAdminService } from '../Interfaces/adminService.interface'
import { HttpStatus } from '../utils/httpStatus';


class AdminController {
    private _adminService: IAdminService;

    constructor(_adminService: IAdminService) {
        this._adminService = _adminService;
    }

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            const serviceResponse = await this._adminService.login(email, password);
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

    getUser = async (req: Request, res: Response) => {
        try {
            const searchQuery = req.query.name as string
            const users = await this._adminService.getUser(searchQuery);
            res.status(HttpStatus.OK).json(users);
        } catch (error) {
            if (error instanceof Error) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error", error: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error", error: "An unknown error occurred" });
            }
        }
    }

    unBlockUser = async (req: Request, res: Response) => {
        try {
            const email = req.query.email as string;
            const serviceResponse = await this._adminService.unBlockUser(email);
            res.status(HttpStatus.OK).json(serviceResponse);
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Something went wrong, please try again later");
        }
    }

    blockUser = async (req: Request, res: Response) => {
        try {
            const email = req.query.email as string;
            const serviceResponse = await this._adminService.blockUser(email);
            res.status(HttpStatus.OK).json(serviceResponse);
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Something went wrong, please try again later");
        }
    }

    getDoctor = async (req: Request, res: Response) => {
        try {
            const searchQuery = req.query.name as string
            const doctors = await this._adminService.getDoctor(searchQuery);
            res.status(HttpStatus.OK).json(doctors);
        } catch (error) {
            if (error instanceof Error) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error", error: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error", error: "An unknown error occurred" });
            }
        }
    }

    blockDoctor = async (req: Request, res: Response) => {
        try {
            const email = req.query.email as string;
            const serviceResponse = await this._adminService.blockDoctor(email);
            res.status(HttpStatus.OK).json(serviceResponse);
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Something went wrong, please try again later");
        }
    }

    unBlockDoctor = async (req: Request, res: Response) => {
        try {
            const email = req.query.email as string;
            const serviceResponse = await this._adminService.unBlockDoctor(email);
            res.status(HttpStatus.OK).json(serviceResponse);
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Something went wrong, please try again later");
        }
    }

    verifyDoctor = async (req: Request, res: Response) => {
        try {
            const email = req.query.email as string;
            const serviceResponse = await this._adminService.verifyDoctor(email);
            res.status(HttpStatus.OK).json(serviceResponse);
        } catch (error: any) {
            console.error('Error in verifyDoctorController:', error.message);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Something went wrong, please try again later");
        }
    }

    rejectDoctor = async (req: Request, res: Response) => {
        try {
            const email = req.query.email as string;
            const serviceResponse = await this._adminService.rejectDoctor(email);
            res.status(HttpStatus.OK).json(serviceResponse);
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Something went wrong, please try again later");
        }
    }

    getCategories = async (req: Request, res: Response) => {
        try {
            const searchQuery = req.query.name as string
            const categories = await this._adminService.getCategories(searchQuery);
            res.status(HttpStatus.OK).json(categories);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Something went wrong, please try again later");
        }
    }

    addCategory = async (req: Request, res: Response) => {
        try {
            const { name } = req.body;
            const newCategory = await this._adminService.addCategory(name);
            if (newCategory)
            res.status(HttpStatus.CREATED).json(newCategory);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Something went wrong, please try again later");
        }
    }

    deleteCategory = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await this._adminService.deleteCategory(id);
            res.status(HttpStatus.OK).json({ message: "Category deleted successfully" });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Something went wrong, please try again later");
        }
    }

    editCategory = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const updatedCategory = await this._adminService.editCategory(id, name);
            res.status(HttpStatus.OK).json({ message: "Category edited successfully", updatedCategory });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Something went wrong, please try again later");
        }
    }


}

export default AdminController;
