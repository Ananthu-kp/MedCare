import { Router } from 'express';
import userController from '../Controllers/userController';
import { verifyToken } from '../utils/jwtConfig';

const router = Router();

router.post('/signup', userController.register);
router.post('/otp', userController.verifyOtp);
router.post('/resend-otp', userController.resendOtp);
router.post('/login', userController.login);
router.post('/google-login', userController.googleLogin);
router.post('/forgot-password', userController.otpForPassReset)
router.post('/verifyForget-otp', userController.verifyForgotOtp)
router.post('/verifyResend-otp', userController.resendForgotOtp)
router.post('/recover-password', userController.resetPassword)
router.get('/profile', verifyToken, userController.getUserProfile)
router.put('/personal', verifyToken, userController.updatePersonalDetails)
router.put('/upload-profile-image', verifyToken, userController.uploadProfileImage)
router.get('/selectDoctor', userController.getDoctors)
router.get('/doctor/:id', userController.getDoctorDetails);
router.get('/slots/:doctorId', userController.getDoctorAvailableSlots);

export default router;
