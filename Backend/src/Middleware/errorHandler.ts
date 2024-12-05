import { Request, Response, NextFunction } from 'express';

class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = (err instanceof AppError) ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        status: "error",
        message,
    });
};

export { AppError, errorHandler };
