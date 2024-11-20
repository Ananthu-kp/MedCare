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

// Generate Access Token
export const generateAccessToken = (userId: string): string => {
    return jwt.sign({ userId }, accessTokenSecret, { expiresIn: accessTokenExpire });
};

// Generate Refresh Token
export const generateRefreshToken = (userId: string): string => {
    return jwt.sign({ userId }, refreshTokenSecret, { expiresIn: refreshTokenExpire });
};

// Verify Access Token Middleware
export const verifyToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
    const token = req.cookies?.accessToken; // Use cookies instead of headers

    if (!token) {
        res.status(401).json({ message: "Access denied. No token provided." });
        return
    }

    jwt.verify(token, accessTokenSecret, (err, decoded) => {
        if (err) {
            const message = err.name === "TokenExpiredError"
                ? "Access denied. Token expired."
                : "Access denied. Invalid token.";
            return res.status(401).json({ message });
        }

        req.user = { id: (decoded as JwtPayload).userId, email: (decoded as JwtPayload).email };
        next();
    });
};

// Verify Refresh Token
export const verifyRefreshToken = (refreshToken: string): string | jwt.JwtPayload => {
    try {
        return jwt.verify(refreshToken, refreshTokenSecret);
    } catch (err) {
        throw new Error("Invalid refresh token");
    }
};

// Simulated function to check if a token is blacklisted
async function checkIfTokenIsBlacklisted(token: string): Promise<boolean> {
    // Example logic: Replace with actual database or in-memory store check
    const blacklist = new Set<string>([
        "revoked-token-example-1",
        "revoked-token-example-2",
    ]);

    return blacklist.has(token);
}

// Token Revocation (Example Blacklist Logic)
export const isTokenRevoked = async (token: string): Promise<boolean> => {
    // Check against a database or in-memory store for revoked tokens
    const isRevoked = await checkIfTokenIsBlacklisted(token);
    return isRevoked;
};
