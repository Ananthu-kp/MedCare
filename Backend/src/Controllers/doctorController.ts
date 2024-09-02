import { Request, Response } from "express";
import doctorService from "../services/doctorService";
import doctorRepository from "../repositories/doctorRepository";
import bcryptUtil from "../utils/bcryptUtil";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtConfig";
import { certificateUpload, profileUpload } from '../config/multer';

class DoctorController {
    async register(req: Request, res: Response): Promise<void> {
        certificateUpload.single('certificate')(req, res, async (err) => {
            if (err) {
                console.error('Multer Error:', err);
                return res.status(400).json({ success: false, message: "Error uploading file", error: err.message });
            }

            console.log('Request Body:', req.body);
            console.log('Uploaded File:', req.file);
            try {
                const { name, email, phone, category, experience, hospital, password, confirmPassword } = req.body;
                const certificate = req.file;

                if (!certificate) {
                    return res.status(400).json({ success: false, message: "Certificate file is required" });
                }

                if (!name || !email || !phone || !category || !experience || !hospital || !password || !confirmPassword || !certificate) {
                    return res.status(400).json({ message: 'All fields are required.' });
                }

                if (password !== confirmPassword) {
                    return res.status(400).json({ success: false, message: "Passwords do not match" });
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
                        return res.status(200).json({ success: true, message: 'Registration successful!' });
                    } catch (error) {
                        console.error('Error saving OTP:', error);
                        return res.status(500).json({ success: false, message: "Error saving OTP" });
                    }
                } else {
                    return res.status(409).json(result);
                }
            } catch (error) {
                console.error('Error registering doctor:', error);
                return res.status(500).json({ success: false, message: "Error registering doctor" });
            }
        });
    }



    async verifyOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email, otp } = req.body;
            console.log('Request Body:', req.body);
            console.log("Received Data:", { email, otp });

            const result = await doctorService.verifyOtp(email, otp);
            if (result.success) {
                await doctorService.clearTempDoctorData(email);
            }

            res.status(result.success ? 200 : 400).json(result);
        } catch (error) {
            console.error('Error in verifyOtp:', error);
            res.status(500).json({ message: "Something went wrong, please try again later" });
        }
    }



    async resendOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;

            const doctor = await doctorRepository.findDoctorByEmail(email);
            if (!doctor) {
                res.status(404).json({ success: false, message: "Doctor not found" });
                return;
            }

            const result = await doctorService.resendOtp(email);

            res.status(result.success ? 200 : 400).json(result);
        } catch (error) {
            console.error('Error resending OTP:', error);
            res.status(500).json({ message: "Something went wrong, please try again later" });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            const doctor = await doctorRepository.findDoctorByEmail(email);
            if (!doctor) {
                res.status(401).json({ success: false, message: "Invalid credentials" });
                return;
            }

            if (doctor.isBlocked) {
                res.status(403).json({ success: false, message: "Your account has been blocked" });
                return;
            }

            if (!doctor.isVerified) {
                res.status(403).json({ success: false, message: "Your account is not verified" });
                return;
            }

            const isMatch = await bcryptUtil.comparePassword(password, doctor.password);
            if (!isMatch) {
                res.status(401).json({ success: false, message: "Invalid credentials" });
                return;
            }

            const accessToken = generateAccessToken(doctor.email);
            const refreshToken = generateRefreshToken(doctor.email);

            console.log(accessToken)

            res.status(200).json({
                success: true,
                message: "Login successful",
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
        } catch (error) {
            console.error('Error logging in doctor:', error);
            res.status(500).json({ message: "Something went wrong, please try again later" });
        }
    }

    async getCategories(req: Request, res: Response): Promise<void> {
        try {
            const categories = await doctorService.getCategories();
            res.json({ success: true, categories });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching categories.' });
        }
    }

    async getDoctorProfile(req: Request, res: Response): Promise<void> {
        try {
            const doctorId = (req as any).user.id;
            const doctorProfile = await doctorService.getDoctorProfile(doctorId);
            console.log(doctorProfile)
            if (!doctorProfile) {
                res.status(404).json({ message: 'Doctor not found' });
                return;
            }
            res.json(doctorProfile);
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }

    async updateOfficialDetails(req: Request, res: Response): Promise<void> {
        try {
            const doctorId = (req as any).user.id;
            const officialDetails = req.body;
            const updatedDoctor = await doctorService.updateOfficialDetails(doctorId, officialDetails);
            res.json(updatedDoctor);
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }

    async updatePersonalDetails(req: Request, res: Response): Promise<void> {
        try {
            const doctorId = (req as any).user.id;
            const personalDetails = req.body;
            const updatedDoctor = await doctorService.updatePersonalDetails(doctorId, personalDetails);
            res.json(updatedDoctor);
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    };

    async uploadProfileImage(req: Request, res: Response): Promise<void> {
        
        profileUpload.single('profileImage')(req, res, async (err: any) => {
            console.log(1)
            if (err) {
                console.error('Multer Error:', err);
                return res.status(400).json({ success: false, message: "Error uploading file", error: err.message });
            }
            console.log(2)
            
            const profileImage = req.file;
            console.log(profileImage)
            if (!profileImage) {
                return res.status(400).json({ success: false, message: "Profile image file is required" });
            }
            
            console.log(3)
            try {
                console.log(4)
                const doctorId = (req as any).user.id; 
                const profileImageUrl = profileImage.filename;
                console.log(profileImageUrl);
                console.log(5)
                
                const result = await doctorService.updateDoctorProfileImage(doctorId, profileImageUrl);
                
                console.log(6)
                if (result.success) {
                    console.log(7 )
                    return res.status(200).json({ success: true, profileImageUrl });
                } else {
                    console.log(8)
                    return res.status(500).json({ success: false, message: "Failed to update profile image" });
                }
            } catch (error) {
                console.log(9)
                console.error('Error saving profile image:', error);
                return res.status(500).json({ success: false, message: "Error saving profile image" });
            }
        });
    }
}



export default new DoctorController();
