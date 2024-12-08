"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileUpload = exports.certificateUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uploadDir = path_1.default.join(__dirname, '..', 'uploads');
const certificateStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads/certificate');
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        cb(null, `certificate-${Date.now()}${ext}`);
    }
});
const profileStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public');
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        cb(null, `profile-${Date.now()}${ext}`);
    }
});
const allowAllFileFilter = (req, file, cb) => {
    cb(null, true);
};
exports.certificateUpload = (0, multer_1.default)({
    storage: certificateStorage,
    fileFilter: allowAllFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});
exports.profileUpload = (0, multer_1.default)({
    storage: profileStorage,
    fileFilter: allowAllFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});
