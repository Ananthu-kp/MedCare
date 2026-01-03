import { Request, Response } from "express";
import userService from "../Services/userService";
import userRepository from "../Repositories/userRepository";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../Utils/jwtConfig";
import { HttpStatus } from "../Utils/httpStatus";
import { profileUpload } from "../Config/multer";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

class UserController {
    async register(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, phone, password, confirmPassword } = req.body;

            if (password !== confirmPassword) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Passwords do not match"
                });
                return;
            }

            const result = await userService.registerUser({
                name, email, phone, password, otp: ""
            });

            // Save OTP only if registration succeeded
            if (result.success) {
                try {
                    await userRepository.saveOtp(email, result.otp);
                    res.status(HttpStatus.OK).json({
                        success: true,
                        message: 'Registration successful! Please check your email for OTP.'
                    });
                } catch (error) {
                    console.error('Error saving OTP:', error);
                    await userRepository.deleteUserByEmail(email);
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "Error saving OTP. Please try again."
                    });
                }
            } else {
                // Registration failed
                res.status(HttpStatus.CONFLICT).json(result);
            }
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error registering user"
            });
        }
    }

    async verifyOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email, otp } = req.body;

            const result = await userService.verifyOtp(email, otp);
            if (result.success) {
                await userRepository.clearTempUserData(email);
            }

            res.status(result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(result);
        } catch (error) {
            console.error('Error in verifyOtp:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Something went wrong, please try again later"
            });
        }
    }

    async resendOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            const result = await userService.resendOtp(email);
            res.status(result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(result);
        } catch (error) {
            console.error('Error resending OTP:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Something went wrong, please try again later"
            });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            const user = await userRepository.findUserByEmail(email);
            if (!user) {
                res.status(HttpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: "Invalid credentials"
                });
                return;
            }

            if (user.isBlocked) {
                res.status(HttpStatus.FORBIDDEN).json({
                    success: false,
                    message: "Your account has been blocked"
                });
                return;
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(HttpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: "Invalid credentials"
                });
                return;
            }

            const accessToken = generateAccessToken(user._id.toString(), user.email);
            const refreshToken = generateRefreshToken(user._id.toString(), user.email);

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Login successful",
                accessToken,
                refreshToken,
                userData: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    phone: user.phone,
                    profileImg: user.profileImg
                }
            });
        } catch (error) {
            console.error('Error logging in user:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Something went wrong, please try again later"
            });
        }
    }

    async googleLogin(req: Request, res: Response): Promise<void> {
        try {
            const { profile } = req.body;
            const result = await userService.loginWithGoogle(profile);
            res.status(result.success ? HttpStatus.OK : HttpStatus.FORBIDDEN).json(result);
        } catch (error) {
            console.error('Error in Google login:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Something went wrong, please try again later"
            });
        }
    }

    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                res.status(HttpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: 'Refresh token required'
                });
                return;
            }

            const decoded = verifyRefreshToken(refreshToken);

            const user = await userRepository.findUserByEmail(decoded.email);
            if (!user) {
                res.status(HttpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }

            if (user.isBlocked) {
                res.status(HttpStatus.FORBIDDEN).json({
                    success: false,
                    message: 'Account has been blocked'
                });
                return;
            }

            // Generate new tokens
            const newAccessToken = generateAccessToken(user._id.toString(), user.email);
            const newRefreshToken = generateRefreshToken(user._id.toString(), user.email);

            res.status(HttpStatus.OK).json({
                success: true,
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            });
        } catch (error) {
            console.error('Error refreshing token:', error);
            res.status(HttpStatus.UNAUTHORIZED).json({
                success: false,
                message: 'Invalid or expired refresh token'
            });
        }
    }

    async otpForPassReset(req: Request, res: Response) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: "Email is required"
                });
            }
            const result = await userService.requestOtpForPasswordReset(email);
            res.status(result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(result);
        } catch (error) {
            console.error('Error in reset password:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Something went wrong, please try again later"
            });
        }
    }

    async verifyForgotOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email, otp } = req.body;
            const result = await userService.verifyForgotOtp(email, otp);
            res.status(result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(result);
        } catch (error) {
            console.error('Error in verifyForgotOtp:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Something went wrong, please try again later"
            });
        }
    }

    async resendForgotOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            const result = await userService.resendForgotOtp(email);
            res.status(result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(result);
        } catch (error) {
            console.error('Error in resendForgotOtp:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Something went wrong, please try again later"
            });
        }
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email, newPassword } = req.body;

            if (!email) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'Email is required'
                });
                return;
            }

            if (!newPassword) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'New password is required'
                });
                return;
            }

            const result = await userService.updatePassword(email, newPassword);
            res.status(result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(result);
        } catch (error) {
            console.error('Error resetting password:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Something went wrong, please try again later"
            });
        }
    }

    async getUserProfile(req: Request, res: Response): Promise<void> {
        try {
            const userEmail = (req as any).user.email;
            const userProfile = await userService.getUserProfile(userEmail);
            if (!userProfile) {
                res.status(HttpStatus.NOT_FOUND).json({
                    message: 'User not found'
                });
                return;
            }
            res.status(HttpStatus.OK).json(userProfile);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Server error'
            });
        }
    }

    async updatePersonalDetails(req: Request, res: Response): Promise<void> {
        try {
            const userEmail = (req as any).user.email;
            const personalDetails = req.body;
            const updatedUser = await userService.updatePersonalDetails(userEmail, personalDetails);
            res.status(HttpStatus.OK).json(updatedUser);
        } catch (error) {
            console.error('Error updating personal details:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Server error'
            });
        }
    }

    async uploadProfileImage(req: Request, res: Response): Promise<void> {
        profileUpload.single('profileImage')(req, res, async (err: any) => {
            if (err) {
                console.error('Multer Error:', err);
                return res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Error uploading file",
                    error: err.message
                });
            }

            const profileImage = req.file;
            if (!profileImage) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Profile image file is required"
                });
            }

            try {
                const userEmail = (req as any).user.email;
                const profileImageUrl = profileImage.filename;

                const result = await userService.updateUserProfileImage(userEmail, profileImageUrl);

                if (result.success) {
                    return res.status(HttpStatus.OK).json({
                        success: true,
                        profileImageUrl
                    });
                } else {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "Failed to update profile image"
                    });
                }
            } catch (error) {
                console.error('Error saving profile image:', error);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Error saving profile image"
                });
            }
        });
    }

    async getDoctors(req: Request, res: Response): Promise<void> {
        try {
            const { name } = req.query;
            const doctors = await userService.getAllDoctors(name as string);
            res.status(HttpStatus.OK).json(doctors);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Error fetching doctors'
            });
        }
    }

    async getDoctorDetails(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const doctor = await userService.getDoctorDetails(id);
            res.json(doctor);
        } catch (error) {
            console.error('Error fetching doctor details:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Error fetching doctor details'
            });
        }
    }

    async getDoctorSlots(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const slots = await userService.getDoctorSlots(id);
            res.json(slots);
        } catch (error) {
            console.error('Error fetching doctor slots:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Error fetching doctor slots'
            });
        }
    }

    async createPayment(req: Request, res: Response): Promise<void> {
        try {
            const { amount, currency, bookingTime } = req.body;
            const userEmail = (req as any).user.email;

            const { sessionId, url } = await userService.createCheckoutSession(
                amount,
                currency,
                userEmail,
                bookingTime
            );

            res.status(HttpStatus.OK).json({ sessionId, url });
        } catch (error) {
            console.error('Error creating payment:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Error creating payment"
            });
        }
    }

    async handleStripeWebhook(req: Request, res: Response): Promise<void> {
        const sig = req.headers['stripe-signature'] as string;
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

        let event: Stripe.Event;

        try {
            event = Stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err) {
            console.error('Webhook signature verification failed:', err);
            res.status(HttpStatus.BAD_REQUEST).send(`Webhook Error`);
            return;
        }

        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object as Stripe.Checkout.Session;

                if (!session.metadata) {
                    console.error('Session metadata is null');
                    res.status(HttpStatus.BAD_REQUEST).json({
                        message: 'Invalid session metadata'
                    });
                    return;
                }

                const userId = session.metadata.userId;
                const bookingTime = session.metadata.bookingTime;

                await userRepository.addPaymentToUser(userId, {
                    amount: session.amount_total,
                    currency: session.currency,
                    status: 'succeeded',
                    paymentIntentId: session.payment_intent as string,
                    bookingTime,
                });

                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.status(HttpStatus.OK).json({ received: true });
    }
}

export default new UserController();