import { Router } from "express";
import DoctorController from "../Controllers/doctorController";
// import { certificateUpload } from '../config/multer'

const router = Router();

router.post('/register', DoctorController.register);
router.post('/verify-otp', DoctorController.verifyOtp);
router.post('/resend-otp', DoctorController.resendOtp);
router.post('/login', DoctorController.login);

export default router;
