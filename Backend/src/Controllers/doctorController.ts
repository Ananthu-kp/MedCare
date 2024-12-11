import { Request, Response } from "express";
import { IDoctorService } from "../Interfaces/doctorService.interface";
import bcryptUtil from "../Utils/bcryptUtil";
import { generateAccessToken, generateRefreshToken } from "../Utils/jwtConfig";
import { certificateUpload, profileUpload } from '../Config/multer';
import { HttpStatus } from '../Utils/httpStatus';

class DoctorController {
    async register(req: Request, res: Response): Promise<void> {
        certificateUpload.single('certificate')(req, res, async (err) => {
            if (err) {
                console.error('Multer Error:', err);
                return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Error uploading file", error: err.message });
            }

            try {
                const { name, email, phone, category, experience, hospital, password, confirmPassword } = req.body;
                const certificate = req.file;

                if (!certificate) {
                    return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Certificate file is required" });
                }

                if (!name || !email || !phone || !category || !experience || !hospital || !password || !confirmPassword) {
                    return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: 'All fields are required.' });
                }

                if (password !== confirmPassword) {
                    return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Passwords do not match" });
                }

                const hashedPassword = await bcryptUtil.hashPassword(password);

                const result = await doctorService.registerDoctor({
                    name, email, phone, category, yearsOfExperience: experience, workingHospital: hospital,
                    password: hashedPassword, otp: "", createdAt: new Date(),
                    certificateUrl: certificate.path
                });

                if (result.success) {
                    try {
                        await doctorRepository.saveOtp(email, result.otp);
                        return res.status(HttpStatus.OK).json({ success: true, message: 'Registration successful!' });
                    } catch (error) {
                        console.error('Error saving OTP:', error);
                        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error saving OTP" });
                    }
                } else {
                    return res.status(HttpStatus.CONFLICT).json(result);
                }
            } catch (error) {
                console.error('Error registering doctor:', error);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error registering doctor" });
            }
        });
    }

    async verifyOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email, otp } = req.body;

            const result = await doctorService.verifyOtp(email, otp);
            if (result.success) {
                await doctorService.clearTempDoctorData(email);
            }

            res.status(result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(result);
        } catch (error) {
            console.error('Error in verifyOtp:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
        }
    }

    async resendOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;

            const doctor = await doctorRepository.findDoctorByEmail(email);
            if (!doctor) {
                res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Doctor not found" });
                return;
            }

            const result = await doctorService.resendOtp(email);

            res.status(result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(result);
        } catch (error) {
            console.error('Error resending OTP:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            const doctor = await doctorRepository.findDoctorByEmail(email);
            if (!doctor) {
                res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: "Invalid credentials" });
                return;
            }

            if (doctor.isBlocked) {
                res.status(HttpStatus.FORBIDDEN).json({ success: false, message: "Your account has been blocked" });
                return;
            }

            if (!doctor.isVerified) {
                res.status(HttpStatus.FORBIDDEN).json({ success: false, message: "Your account is not verified" });
                return;
            }

            const isMatch = await bcryptUtil.comparePassword(password, doctor.password);
            if (!isMatch) {
                res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: "Invalid credentials" });
                return;
            }

            const accessToken = generateAccessToken(doctor.email);
            const refreshToken = generateRefreshToken(doctor.email);

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Login successful",
                accessToken: accessToken,
                refreshToken: refreshToken,
                doctor: {
                    name: doctor.name,
                    email: doctor.email,
                    category: doctor.category,
                    experience: doctor.yearsOfExperience,
                    hospital: doctor.workingHospital,
                    consultationfee: doctor.consultationfee,
                    profileImg: doctor.profileImg,
                }
            })
        } catch (error) {
            console.error('Error logging in doctor:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
        }
    }

    async getCategories(req: Request, res: Response): Promise<void> {
        try {
            const categories = await doctorService.getCategories();
            res.status(HttpStatus.OK).json({ success: true, categories });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Error fetching categories.' });
        }
    }

    async getDoctorProfile(req: Request, res: Response): Promise<void> {
        try {
            const doctorId = (req as any).user.id;
            const doctorProfile = await doctorService.getDoctorProfile(doctorId);
            if (!doctorProfile) {
                res.status(HttpStatus.NOT_FOUND).json({ message: 'Doctor not found' });
                return;
            }
            res.status(HttpStatus.OK).json(doctorProfile);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
        }
    }

    async updateOfficialDetails(req: Request, res: Response): Promise<void> {
        try {
            const doctorId = (req as any).user.id;
            const officialDetails = req.body;
            const updatedDoctor = await doctorService.updateOfficialDetails(doctorId, officialDetails);
            res.status(HttpStatus.OK).json(updatedDoctor);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
        }
    }

    async updatePersonalDetails(req: Request, res: Response): Promise<void> {
        try {
            const doctorId = (req as any).user.id;
            const personalDetails = req.body;
            const updatedDoctor = await doctorService.updatePersonalDetails(doctorId, personalDetails);
            res.status(HttpStatus.OK).json(updatedDoctor);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
        }
    };

    async uploadProfileImage(req: Request, res: Response): Promise<void> {
        profileUpload.single('profileImage')(req, res, async (err: any) => {
            if (err) {
                console.error('Multer Error:', err);
                return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Error uploading file", error: err.message });
            }

            const profileImage = req.file;
            if (!profileImage) {
                return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Profile image file is required" });
            }

            try {
                const doctorId = (req as any).user.id;
                const profileImageUrl = profileImage.filename;

                const result = await doctorService.updateDoctorProfileImage(doctorId, profileImageUrl);

                if (result.success) {
                    return res.status(HttpStatus.OK).json({ success: true, profileImageUrl });
                } else {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to update profile image" });
                }
            } catch (error) {
                console.error('Error saving profile image:', error);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error saving profile image" });
            }
        });
    }

    async otpForPassReset(req: Request, res: Response) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Email is required' });
            }
            const result = await doctorService.requestOtpForPasswordReset(email);
            res.status(result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(result)
        } catch (error) {
            console.error('Error in reset password', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' })
        }
    }

    async verifyForgotOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email, otp } = req.body;
            const result = await doctorService.verifyForgotOtp(email, otp);
            res.status(result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(result);
        } catch (error) {
            console.error('Error in verifyForgotOtp:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
        }
    }

    async resendForgotOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            const result = await doctorService.resendForgotOtp(email)

            res.status(result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(result)
        } catch (error) {
            console.error('Error in resendForgotOtp:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
        }
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email, otp, newPassword } = req.body;

            const otpResult = await doctorService.verifyForgotOtp(email, otp);
            if (!otpResult.success) {
                res.status(HttpStatus.BAD_REQUEST).json(otpResult);
                return;
            }

            const result = await doctorService.updatePassword(email, newPassword);
            res.status(result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(result);

        } catch (error) {
            console.error('Error resetting password:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
        }
    }

    async updateAvailability(req: Request, res: Response) {
        try {
            const { email, availability } = req.body;

            const updatedDoctor = await doctorService.updateAvailability(email, availability);
            res.json(updatedDoctor);
        } catch (error) {
            console.error('Error updating availability:', error);
            res.status(500).json({ message: "Something went wrong, please try again later" });
        }
    }


    async addSlot(req: Request, res: Response): Promise<void> {
        try {
            const { email, date, startTime, endTime, available } = req.body;

            if (!email || !date || !startTime || !endTime) {
                res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: 'All fields are required.' })
                return
            }

            const slot = { date, startTime, endTime, available };
            await doctorService.addSlots(email, slot);
            res.status(HttpStatus.OK).json({ success: true, message: 'Slot added successfully' })
        } catch (error) {
            console.error('Error adding slot:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Error adding slot' })
        }
    }

    async getSlots(req: Request, res: Response): Promise<void> {
        try {
            const email = req.params.email;
            const slots = await doctorService.getSlots(email);
            res.status(HttpStatus.OK).json(slots)
        } catch (error) {
            console.error('Error fetching slots:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Error fetching slots' })
        }
    }

}

export default new DoctorController();
