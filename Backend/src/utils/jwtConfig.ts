import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const accessTokenSecret = process.env.JWT_SECRET_ACCESS!;
const refreshTokenSecret = process.env.JWT_SECRET_REFRESH!;
const accessTokenExpire = process.env.JWT_ACCESS_EXPIRATION!;
const refreshTokenExpire = process.env.JWT_REFRESH_EXPIRATION!;

interface JwtPayload {
    userId: string;
    email?: string;
}

interface CustomRequest extends Request {
    user?: { id: string; email?: string };
}

export const generateAccessToken = (userId: string): string => {
    return jwt.sign({ userId }, accessTokenSecret, { expiresIn: accessTokenExpire });
}

export const generateRefreshToken = (userId: string): string => {
    return jwt.sign({ userId }, refreshTokenSecret, { expiresIn: refreshTokenExpire });
}

export const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. Invalid token.' });
    }

    jwt.verify(token, accessTokenSecret, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Access denied. Token expired.' });
            } else {
                return res.status(401).json({ message: 'Access denied. Invalid token.' });
            }
        } else {
            req.user = { id: (decoded as JwtPayload).userId, email: (decoded as JwtPayload).email };
            next();
        }
    });
};

export const verifyRefreshToken = (refreshToken: string): string | jwt.JwtPayload => {
    try {
        return jwt.verify(refreshToken, refreshTokenSecret);
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
};
