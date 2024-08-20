import { Router } from 'express';
import userController from '../Controllers/userController';

const router = Router();

router.post('/signup', userController.register);
router.post('/otp', userController.verifyOtp);
router.post('/resend-otp', userController.resendOtp);
router.post('/login', userController.login);

export default router;
