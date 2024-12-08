"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dbConnection = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URL);
        console.log("Database connected");
    }
    catch (error) {
        console.error("Database connection failed", error);
    }
};
exports.default = dbConnection;
