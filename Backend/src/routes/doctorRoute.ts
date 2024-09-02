import { Router } from "express";
import DoctorController from "../Controllers/doctorController";
import { verifyToken } from "../utils/jwtConfig";
// import { certificateUpload } from '../config/multer'

const router = Router();

router.post('/register', DoctorController.register);
router.post('/verify-otp', DoctorController.verifyOtp);
router.post('/resend-otp', DoctorController.resendOtp);
router.post('/login', DoctorController.login);
router.get('/categories', DoctorController.getCategories);
router.get('/doctor', verifyToken,DoctorController.getDoctorProfile);
router.put('/doctor/official', verifyToken, DoctorController.updateOfficialDetails);
router.put('/doctor/personal', verifyToken, DoctorController.updatePersonalDetails);
router.put('/upload-profile-image', verifyToken, DoctorController.uploadProfileImage)

export default router;
