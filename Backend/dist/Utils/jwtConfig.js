"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const accessTokenSecret = process.env.JWT_SECRET_ACCESS;
const refreshTokenSecret = process.env.JWT_SECRET_REFRESH;
const accessTokenExpire = process.env.JWT_ACCESS_EXPIRATION;
const refreshTokenExpire = process.env.JWT_REFRESH_EXPIRATION;
const generateAccessToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, accessTokenSecret, { expiresIn: accessTokenExpire });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, refreshTokenSecret, { expiresIn: refreshTokenExpire });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. Invalid token.' });
    }
    jsonwebtoken_1.default.verify(token, accessTokenSecret, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Access denied. Token expired.' });
            }
            else {
                return res.status(401).json({ message: 'Access denied. Invalid token.' });
            }
        }
        else {
            req.user = { id: decoded.userId, email: decoded.email };
            next();
        }
    });
};
exports.verifyToken = verifyToken;
const verifyRefreshToken = (refreshToken) => {
    try {
        return jsonwebtoken_1.default.verify(refreshToken, refreshTokenSecret);
    }
    catch (error) {
        throw new Error('Invalid refresh token');
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
