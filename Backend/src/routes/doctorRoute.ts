import { Router } from "express";
import DoctorController from "../Controllers/doctorController";
import { verifyToken } from "../Utils/jwtConfig";
import DoctorRepository from "../Repositories/doctorRepository";
import DoctorService from "../Services/doctorService";

const router = Router();

const doctorService = new DoctorService(DoctorRepository)
const doctorController = new DoctorController(doctorService);

router.post('/register', doctorController.register);
router.post('/verify-otp', doctorController.verifyOtp);
router.post('/resend-otp', doctorController.resendOtp);
router.post('/login', doctorController.login);
router.post('/forgot-password', doctorController.otpForPassReset);
router.post('/verifyDoctor-otp', doctorController.verifyForgotOtp);
router.post('/resendDoctor-otp', doctorController.resendForgotOtp);
router.post('/recover-password', doctorController.resetPassword);
router.get('/categories', doctorController.getCategories);
router.get('/doctor', verifyToken,doctorController.getDoctorProfile);
router.put('/doctor/official', verifyToken, doctorController.updateOfficialDetails);
router.put('/doctor/personal', verifyToken, doctorController.updatePersonalDetails);
router.put('/upload-profile-image', verifyToken, doctorController.uploadProfileImage);
router.put('/availability', doctorController.updateAvailability);
router.get('/slots/:email', verifyToken, doctorController.getSlots);
router.post('/slots', verifyToken, doctorController.addSlot)


export default router;
