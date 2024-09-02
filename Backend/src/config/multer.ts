import multer from 'multer';
import path from 'path';

const uploadDir = path.join(__dirname, '..', 'uploads');

const certificateStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads/certificate');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `certificate-${Date.now()}${ext}`);
    }
});

const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `profile-${Date.now()}${ext}`);
    }
});

const allowAllFileFilter = (req: any, file: any, cb: (arg0: null, arg1: boolean) => void) => {
    cb(null, true);
};

export const certificateUpload = multer({
    storage: certificateStorage,
    fileFilter: allowAllFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

export const profileUpload = multer({
    storage: profileStorage,
    fileFilter: allowAllFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});
