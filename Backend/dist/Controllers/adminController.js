"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatus_1 = require("../Utils/httpStatus");
class AdminController {
    _adminService;
    constructor(_adminService) {
        this._adminService = _adminService;
    }
    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const serviceResponse = await this._adminService.login(email, password);
            res.status(httpStatus_1.HttpStatus.OK).json(serviceResponse);
        }
        catch (error) {
            next(error);
        }
    };
    getUser = async (req, res, next) => {
        try {
            const searchQuery = req.query.name;
            const users = await this._adminService.getUser(searchQuery);
            res.status(httpStatus_1.HttpStatus.OK).json(users);
        }
        catch (error) {
            next(error);
        }
    };
    unBlockUser = async (req, res, next) => {
        try {
            const email = req.query.email;
            const serviceResponse = await this._adminService.unBlockUser(email);
            res.status(httpStatus_1.HttpStatus.OK).json(serviceResponse);
        }
        catch (error) {
            next(error);
        }
    };
    blockUser = async (req, res, next) => {
        try {
            const email = req.query.email;
            const serviceResponse = await this._adminService.blockUser(email);
            res.status(httpStatus_1.HttpStatus.OK).json(serviceResponse);
        }
        catch (error) {
            next(error);
        }
    };
    getDoctor = async (req, res, next) => {
        try {
            const searchQuery = req.query.name;
            const doctors = await this._adminService.getDoctor(searchQuery);
            res.status(httpStatus_1.HttpStatus.OK).json(doctors);
        }
        catch (error) {
            next(error);
        }
    };
    blockDoctor = async (req, res, next) => {
        try {
            const email = req.query.email;
            const serviceResponse = await this._adminService.blockDoctor(email);
            res.status(httpStatus_1.HttpStatus.OK).json(serviceResponse);
        }
        catch (error) {
            next(error);
        }
    };
    unBlockDoctor = async (req, res, next) => {
        try {
            const email = req.query.email;
            const serviceResponse = await this._adminService.unBlockDoctor(email);
            res.status(httpStatus_1.HttpStatus.OK).json(serviceResponse);
        }
        catch (error) {
            next(error);
        }
    };
    verifyDoctor = async (req, res, next) => {
        try {
            const email = req.query.email;
            const serviceResponse = await this._adminService.verifyDoctor(email);
            res.status(httpStatus_1.HttpStatus.OK).json(serviceResponse);
        }
        catch (error) {
            console.error('Error in verifyDoctorController:', error.message);
            next(error);
        }
    };
    rejectDoctor = async (req, res, next) => {
        try {
            const email = req.query.email;
            const serviceResponse = await this._adminService.rejectDoctor(email);
            res.status(httpStatus_1.HttpStatus.OK).json(serviceResponse);
        }
        catch (error) {
            next(error);
        }
    };
    getCategories = async (req, res, next) => {
        try {
            const searchQuery = req.query.name;
            const categories = await this._adminService.getCategories(searchQuery);
            res.status(httpStatus_1.HttpStatus.OK).json(categories);
        }
        catch (error) {
            next(error);
        }
    };
    addCategory = async (req, res, next) => {
        try {
            const { name } = req.body;
            const newCategory = await this._adminService.addCategory(name);
            if (newCategory)
                res.status(httpStatus_1.HttpStatus.CREATED).json(newCategory);
        }
        catch (error) {
            next(error);
        }
    };
    deleteCategory = async (req, res, next) => {
        try {
            const { id } = req.params;
            await this._adminService.deleteCategory(id);
            res.status(httpStatus_1.HttpStatus.OK).json({ message: "Category deleted successfully" });
        }
        catch (error) {
            next(error);
        }
    };
    editCategory = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const updatedCategory = await this._adminService.editCategory(id, name);
            res.status(httpStatus_1.HttpStatus.OK).json({ message: "Category edited successfully", updatedCategory });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = AdminController;
