import { Request, Response, NextFunction } from "express";
import bcryptUtil from "../Utils/bcryptUtil";
import { generateAccessToken, generateRefreshToken } from "../Utils/jwtConfig";
import { certificateUpload, profileUpload } from '../Config/multer';
import { HttpStatus } from '../Utils/httpStatus';
import { IDoctorService } from "../Interfaces/doctorService.interface";

class DoctorController {
    private doctorService: IDoctorService;

    constructor(doctorService: IDoctorService) {
        this.doctorService = doctorService;
    }

    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        certificateUpload.single('certificate')(req, res, async (err) => {
            if (err) {
                console.error('Multer Error:', err);
                return next(err)
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

                const result = await this.doctorService.registerDoctor({
                    name, email, phone, category, yearsOfExperience: experience, workingHospital: hospital,
                    password: hashedPassword, otp: "", createdAt: new Date(),
                    certificateUrl: certificate.path
                });

                if (result.success) {
                    try {
                        await this.doctorService.saveOtp(email, result.otp);
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
                next(error)
            }
        });
    }

    verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, otp } = req.body;

            const result = await this.doctorService.verifyOtp(email, otp);
            if (result.success) {
                await this.doctorService.clearTempDoctorData(email);
            }

            res.status(result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(result);
        } catch (error) {
            console.error('Error in verifyOtp:', error);
            next(error)
        }
    }

    resendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email } = req.body;

            const doctor = await this.doctorService.findDoctorByEmail(email);
            if (!doctor) {
                res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Doctor not found" });
                return;
            }

            const result = await this.doctorService.resendOtp(email);

            res.status(result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(result);
        } catch (error) {
            console.error('Error resending OTP:', error);
            next(error)
        }
    }

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;

            const doctor = await this.doctorService.findDoctorByEmail(email);
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
            next(error)
        }
    }

    getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const categories = await this.doctorService.getCategories();
            res.status(HttpStatus.OK).json({ success: true, categories });
        } catch (error) {
            next(error)
        }
    }

    getDoctorProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const doctorId = (req as any).user.id;
            const doctorProfile = await this.doctorService.getDoctorProfile(doctorId);
            if (!doctorProfile) {
                res.status(HttpStatus.NOT_FOUND).json({ message: 'Doctor not found' });
                return;
            }
            res.status(HttpStatus.OK).json(doctorProfile);
        } catch (error) {
            next(error)
        }
    }

    updateOfficialDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const doctorId = (req as any).user.id;
            const officialDetails = req.body;
            const updatedDoctor = await this.doctorService.updateOfficialDetails(doctorId, officialDetails);
            res.status(HttpStatus.OK).json(updatedDoctor);
        } catch (error) {
            next(error)
        }
    }

    updatePersonalDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const doctorId = (req as any).user.id;
            const personalDetails = req.body;
            const updatedDoctor = await this.doctorService.updatePersonalDetails(doctorId, personalDetails);
            res.status(HttpStatus.OK).json(updatedDoctor);
        } catch (error) {
            next(error)
        }
    };

    uploadProfileImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

                const result = await this.doctorService.updateDoctorProfileImage(doctorId, profileImageUrl);

                if (result.success) {
                    return res.status(HttpStatus.OK).json({ success: true, profileImageUrl });
                } else {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to update profile image" });
                }
            } catch (error) {
                console.error('Error saving profile image:', error);
                next(error)
            }
        });
    }

    otpForPassReset = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Email is required' });
            }
            const result = await this.doctorService.requestOtpForPasswordReset(email);
            res.status(result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(result)
        } catch (error) {
            console.error('Error in reset password', error);
            next(error)
        }
    }

    verifyForgotOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, otp } = req.body;
            const result = await this.doctorService.verifyForgotOtp(email, otp);
            res.status(result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(result);
        } catch (error) {
            console.error('Error in verifyForgotOtp:', error);
            next(error)
        }
    }

    resendForgotOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email } = req.body;
            const result = await this.doctorService.resendForgotOtp(email)

            res.status(result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(result)
        } catch (error) {
            console.error('Error in resendForgotOtp:', error);
            next(error)
        }
    }

    resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, otp, newPassword } = req.body;

            const otpResult = await this.doctorService.verifyForgotOtp(email, otp);
            if (!otpResult.success) {
                res.status(HttpStatus.BAD_REQUEST).json(otpResult);
                return;
            }

            const result = await this.doctorService.updatePassword(email, newPassword);
            res.status(result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(result);

        } catch (error) {
            console.error('Error resetting password:', error);
            next(error)
        }
    }

    updateAvailability = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, availability } = req.body;

            const updatedDoctor = await this.doctorService.updateAvailability(email, availability);
            res.json(updatedDoctor);
        } catch (error) {
            console.error('Error updating availability:', error);
            next(error)
        }
    }


    addSlot = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, date, startTime, endTime, available } = req.body;

            if (!email || !date || !startTime || !endTime) {
                res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: 'All fields are required.' })
                return
            }

            const slot = { date, startTime, endTime, available };
            await this.doctorService.addSlots(email, slot);
            res.status(HttpStatus.OK).json({ success: true, message: 'Slot added successfully' })
        } catch (error) {
            console.error('Error adding slot:', error);
            next(error)
        }
    }

    getSlots = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const email = req.params.email;
            const slots = await this.doctorService.getSlots(email);
            res.status(HttpStatus.OK).json(slots)
        } catch (error) {
            console.error('Error fetching slots:', error);
            next(error)
        }
    }

}

export default DoctorController;
