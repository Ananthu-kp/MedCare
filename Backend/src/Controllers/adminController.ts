import { NextFunction, Request, Response } from 'express';
import { IAdminService } from '../Interfaces/adminService.interface'
import { HttpStatus } from '../Utils/httpStatus';


class AdminController {
    private _adminService: IAdminService;

    constructor(_adminService: IAdminService) {
        this._adminService = _adminService;
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;

            const serviceResponse = await this._adminService.login(email, password);
            res.status(HttpStatus.OK).json(serviceResponse);
        } catch (error) {
            next(error)
        }
    }

    getUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const searchQuery = req.query.name as string
            const users = await this._adminService.getUser(searchQuery);
            res.status(HttpStatus.OK).json(users);
        } catch (error) {
            next(error)
        }
    }

    unBlockUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const email = req.query.email as string;
            const serviceResponse = await this._adminService.unBlockUser(email);
            res.status(HttpStatus.OK).json(serviceResponse);
        } catch (error: any) {
            next(error)
        }
    }

    blockUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const email = req.query.email as string;
            const serviceResponse = await this._adminService.blockUser(email);
            res.status(HttpStatus.OK).json(serviceResponse);
        } catch (error: any) {
            next(error)
        }
    }

    getDoctor = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const searchQuery = req.query.name as string
            const doctors = await this._adminService.getDoctor(searchQuery);
            res.status(HttpStatus.OK).json(doctors);
        } catch (error) {
            next(error)
        }
    }

    blockDoctor = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const email = req.query.email as string;
            const serviceResponse = await this._adminService.blockDoctor(email);
            res.status(HttpStatus.OK).json(serviceResponse);
        } catch (error: any) {
            next(error)
        }
    }

    unBlockDoctor = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const email = req.query.email as string;
            const serviceResponse = await this._adminService.unBlockDoctor(email);
            res.status(HttpStatus.OK).json(serviceResponse);
        } catch (error: any) {
            next(error)
        }
    }

    verifyDoctor = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const email = req.query.email as string;
            const serviceResponse = await this._adminService.verifyDoctor(email);
            res.status(HttpStatus.OK).json(serviceResponse);
        } catch (error: any) {
            console.error('Error in verifyDoctorController:', error.message);
            next(error)
        }
    }

    rejectDoctor = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const email = req.query.email as string;
            const serviceResponse = await this._adminService.rejectDoctor(email);
            res.status(HttpStatus.OK).json(serviceResponse);
        } catch (error: any) {
            next(error)
        }
    }

    getCategories = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const searchQuery = req.query.name as string
            const categories = await this._adminService.getCategories(searchQuery);
            res.status(HttpStatus.OK).json(categories);
        } catch (error) {
            next(error)
        }
    }

    addCategory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name } = req.body;
            const newCategory = await this._adminService.addCategory(name);
            if (newCategory)
            res.status(HttpStatus.CREATED).json(newCategory);
        } catch (error) {
            next(error)
        }
    }

    deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            await this._adminService.deleteCategory(id);
            res.status(HttpStatus.OK).json({ message: "Category deleted successfully" });
        } catch (error) {
            next(error)
        }
    }

    editCategory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const updatedCategory = await this._adminService.editCategory(id, name);
            res.status(HttpStatus.OK).json({ message: "Category edited successfully", updatedCategory });
        } catch (error) {
            next(error)
        }
    }


}

export default AdminController;
