import { Router, } from 'express';
import express from "express";
import userController from '../Controllers/userController';
import { verifyToken } from '../Utils/jwtConfig';

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
router.get('/doctors/:id', userController.getDoctorDetails);
router.get('/slot/:id', userController.getDoctorSlots);
router.post('/create-payment-intent', verifyToken, userController.createPayment);
router.post('/stripe-webhook', express.raw({ type: 'application/json' }), userController.handleStripeWebhook);

export default router;
