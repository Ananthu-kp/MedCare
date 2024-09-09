import { Router } from 'express';
import userController from '../Controllers/userController';

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

export default router;
