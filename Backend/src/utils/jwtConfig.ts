import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const accessTokenSecret = process.env.JWT_SECRET_ACCESS!;
const refreshTokenSecret = process.env.JWT_SECRET_REFRESH!;
const accessTokenExpire = process.env.JWT_ACCESS_EXPIRATION || '15m';
const refreshTokenExpire = process.env.JWT_REFRESH_EXPIRATION || '7d';

interface JwtPayload {
    userId: string;
    email: string;
}

interface CustomRequest extends Request {
    user?: JwtPayload;
}

export const generateAccessToken = (userId: string, email: string): string => {
    return jwt.sign({ userId, email }, accessTokenSecret, { expiresIn: accessTokenExpire });
}

export const generateRefreshToken = (userId: string, email: string): string => {
    return jwt.sign({ userId, email }, refreshTokenSecret, { expiresIn: refreshTokenExpire });
}

// Verify Access Token Middleware
export const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false,
            message: 'Access denied. No token provided.' 
        });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    success: false,
                    message: 'Access token expired.',
                    expired: true 
                });
            }
            return res.status(403).json({ 
                success: false,
                message: 'Invalid token.' 
            });
        }

        const payload = decoded as JwtPayload;
        req.user = {
            userId: payload.userId,
            email: payload.email
        };
        next();
    });
};

// Verify Refresh Token
export const verifyRefreshToken = (refreshToken: string): JwtPayload => {
    try {
        const decoded = jwt.verify(refreshToken, refreshTokenSecret) as JwtPayload;
        return decoded;
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};