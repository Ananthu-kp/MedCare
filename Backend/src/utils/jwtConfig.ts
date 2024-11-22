import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

// Secrets and expirations from environment variables
const accessTokenSecret = process.env.JWT_SECRET_ACCESS!;
const refreshTokenSecret = process.env.JWT_SECRET_REFRESH!;
const accessTokenExpire = process.env.JWT_ACCESS_EXPIRATION!;
const refreshTokenExpire = process.env.JWT_REFRESH_EXPIRATION!;
const accessTokenCookieName = process.env.ACCESS_TOKEN_COOKIE_NAME!;
const refreshTokenCookieName = process.env.REFRESH_TOKEN_COOKIE_NAME!;

interface JwtPayload {
    userId: string;
    email?: string;
}

interface CustomRequest extends Request {
    user?: { id: string; email?: string };
}

// Generate access token
export const generateAccessToken = (userId: string): string => {
    return jwt.sign({ userId }, accessTokenSecret, { expiresIn: accessTokenExpire });
};

// Generate refresh token
export const generateRefreshToken = (userId: string): string => {
    return jwt.sign({ userId }, refreshTokenSecret, { expiresIn: refreshTokenExpire });
};

// Verify tokens and handle refresh logic
export const verifyToken = (expectedRole: string) => {
    return async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const accessToken = req.cookies[accessTokenCookieName];

            if (!accessToken) {
                return handleRefreshToken(req, res, next, expectedRole);
            }

            jwt.verify(accessToken, accessTokenSecret, (err, decoded) => {
                if (err) {
                    return handleRefreshToken(req, res, next, expectedRole);
                } else {
                    const { userId } = decoded as JwtPayload;
                    req.user = { id: userId };
                    next();
                }
            });
        } catch (error) {
            res.status(401).json({ message: "Access denied. Invalid token." });
        }
    };
};

// Handle refresh token logic
const handleRefreshToken = async (req: CustomRequest, res: Response, next: NextFunction, expectedRole: string) => {
    const refreshToken = req.cookies[refreshTokenCookieName];

    if (!refreshToken) {
        return res.status(401).json({ message: "Access denied. No refresh token provided." });
    }

    jwt.verify(refreshToken, refreshTokenSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Access denied. Invalid refresh token." });
        }

        const { userId } = decoded as JwtPayload;

        // Generate new tokens
        const newAccessToken = generateAccessToken(userId);
        res.cookie(accessTokenCookieName, newAccessToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: parseInt(accessTokenExpire) * 1000,
        });

        req.user = { id: userId };
        next();
    });
};

// Middleware for verifying refresh tokens manually if needed
export const verifyRefreshToken = (refreshToken: string): string | jwt.JwtPayload => {
    try {
        return jwt.verify(refreshToken, refreshTokenSecret);
    } catch (error) {
        throw new Error("Invalid refresh token");
    }
};
