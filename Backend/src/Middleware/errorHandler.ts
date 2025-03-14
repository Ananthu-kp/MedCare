import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../Utils/httpStatus";

export const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error("Error:", error);

    // Handle specific error types
    if (error.message === "Wrong email") {
        return res
            .status(HttpStatus.UNAUTHORIZED)
            .json({ message: "Email not found" });
    }

    if (error.message === "Wrong password") {
        return res
            .status(HttpStatus.UNAUTHORIZED)
            .json({ message: "Password is incorrect" });
    }

    if (error.message === "Certificate file is required") {
        return res
            .status(HttpStatus.BAD_REQUEST)
            .json({ message: "Please upload a certificate file." });
    }

    // Generic error response
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong, please try again later",
        error: error.message || "Unknown error",
    });
};