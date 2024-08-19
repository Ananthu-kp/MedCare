import { Router } from 'express';
import userController from '../Controllers/userController';

const router = Router();

router.post('/signup', userController.register);
router.post('/otp', userController.verifyOtp);

export default router;
