"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const httpStatus_1 = require("../Utils/httpStatus");
const errorHandler = (error, req, res, next) => {
    console.error("Error:", error);
    // Handle specific error types
    if (error.message === "Wrong email") {
        return res
            .status(httpStatus_1.HttpStatus.UNAUTHORIZED)
            .json({ message: "Email not found" });
    }
    if (error.message === "Wrong password") {
        return res
            .status(httpStatus_1.HttpStatus.UNAUTHORIZED)
            .json({ message: "Password is incorrect" });
    }
    // Generic error response
    res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong, please try again later",
        error: error.message || "Unknown error",
    });
};
exports.errorHandler = errorHandler;
