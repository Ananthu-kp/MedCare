import { Router } from "express";
import DoctorController from "../Controllers/doctorController";
import { verifyToken } from "../utils/jwtConfig";

const router = Router();

router.post('/register', DoctorController.register);
router.post('/verify-otp', DoctorController.verifyOtp);
router.post('/resend-otp', DoctorController.resendOtp);
router.post('/login', DoctorController.login);
router.post('/forgot-password', DoctorController.otpForPassReset);
router.post('/verifyDoctor-otp', DoctorController.verifyForgotOtp);
router.post('/resendDoctor-otp', DoctorController.resendForgotOtp);
router.post('/recover-password', DoctorController.resetPassword);
router.get('/categories', DoctorController.getCategories);
router.get('/doctor', verifyToken,DoctorController.getDoctorProfile);
router.put('/doctor/official', verifyToken, DoctorController.updateOfficialDetails);
router.put('/doctor/personal', verifyToken, DoctorController.updatePersonalDetails);
router.put('/upload-profile-image', verifyToken, DoctorController.uploadProfileImage);
router.put('/availability', verifyToken, DoctorController.updateAvailability)


export default router;
