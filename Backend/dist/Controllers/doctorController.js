"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const doctorService_1 = __importDefault(require("../Services/doctorService"));
const doctorRepository_1 = __importDefault(require("../Repositories/doctorRepository"));
const bcryptUtil_1 = __importDefault(require("../Utils/bcryptUtil"));
const jwtConfig_1 = require("../Utils/jwtConfig");
const multer_1 = require("../Config/multer");
const httpStatus_1 = require("../Utils/httpStatus");
class DoctorController {
    async register(req, res) {
        multer_1.certificateUpload.single('certificate')(req, res, async (err) => {
            if (err) {
                console.error('Multer Error:', err);
                return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ success: false, message: "Error uploading file", error: err.message });
            }
            try {
                const { name, email, phone, category, experience, hospital, password, confirmPassword } = req.body;
                const certificate = req.file;
                if (!certificate) {
                    return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ success: false, message: "Certificate file is required" });
                }
                if (!name || !email || !phone || !category || !experience || !hospital || !password || !confirmPassword) {
                    return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ success: false, message: 'All fields are required.' });
                }
                if (password !== confirmPassword) {
                    return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ success: false, message: "Passwords do not match" });
                }
                const hashedPassword = await bcryptUtil_1.default.hashPassword(password);
                const result = await doctorService_1.default.registerDoctor({
                    name, email, phone, category, yearsOfExperience: experience, workingHospital: hospital,
                    password: hashedPassword, otp: "", createdAt: new Date(),
                    certificateUrl: certificate.path
                });
                if (result.success) {
                    try {
                        await doctorRepository_1.default.saveOtp(email, result.otp);
                        return res.status(httpStatus_1.HttpStatus.OK).json({ success: true, message: 'Registration successful!' });
                    }
                    catch (error) {
                        console.error('Error saving OTP:', error);
                        return res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error saving OTP" });
                    }
                }
                else {
                    return res.status(httpStatus_1.HttpStatus.CONFLICT).json(result);
                }
            }
            catch (error) {
                console.error('Error registering doctor:', error);
                return res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error registering doctor" });
            }
        });
    }
    async verifyOtp(req, res) {
        try {
            const { email, otp } = req.body;
            const result = await doctorService_1.default.verifyOtp(email, otp);
            if (result.success) {
                await doctorService_1.default.clearTempDoctorData(email);
            }
            res.status(result.success ? httpStatus_1.HttpStatus.OK : httpStatus_1.HttpStatus.BAD_REQUEST).json(result);
        }
        catch (error) {
            console.error('Error in verifyOtp:', error);
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
        }
    }
    async resendOtp(req, res) {
        try {
            const { email } = req.body;
            const doctor = await doctorRepository_1.default.findDoctorByEmail(email);
            if (!doctor) {
                res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false, message: "Doctor not found" });
                return;
            }
            const result = await doctorService_1.default.resendOtp(email);
            res.status(result.success ? httpStatus_1.HttpStatus.OK : httpStatus_1.HttpStatus.BAD_REQUEST).json(result);
        }
        catch (error) {
            console.error('Error resending OTP:', error);
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const doctor = await doctorRepository_1.default.findDoctorByEmail(email);
            if (!doctor) {
                res.status(httpStatus_1.HttpStatus.UNAUTHORIZED).json({ success: false, message: "Invalid credentials" });
                return;
            }
            if (doctor.isBlocked) {
                res.status(httpStatus_1.HttpStatus.FORBIDDEN).json({ success: false, message: "Your account has been blocked" });
                return;
            }
            if (!doctor.isVerified) {
                res.status(httpStatus_1.HttpStatus.FORBIDDEN).json({ success: false, message: "Your account is not verified" });
                return;
            }
            const isMatch = await bcryptUtil_1.default.comparePassword(password, doctor.password);
            if (!isMatch) {
                res.status(httpStatus_1.HttpStatus.UNAUTHORIZED).json({ success: false, message: "Invalid credentials" });
                return;
            }
            const accessToken = (0, jwtConfig_1.generateAccessToken)(doctor.email);
            const refreshToken = (0, jwtConfig_1.generateRefreshToken)(doctor.email);
            res.status(httpStatus_1.HttpStatus.OK).json({
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
            });
        }
        catch (error) {
            console.error('Error logging in doctor:', error);
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
        }
    }
    async getCategories(req, res) {
        try {
            const categories = await doctorService_1.default.getCategories();
            res.status(httpStatus_1.HttpStatus.OK).json({ success: true, categories });
        }
        catch (error) {
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Error fetching categories.' });
        }
    }
    async getDoctorProfile(req, res) {
        try {
            const doctorId = req.user.id;
            const doctorProfile = await doctorService_1.default.getDoctorProfile(doctorId);
            if (!doctorProfile) {
                res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ message: 'Doctor not found' });
                return;
            }
            res.status(httpStatus_1.HttpStatus.OK).json(doctorProfile);
        }
        catch (error) {
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
        }
    }
    async updateOfficialDetails(req, res) {
        try {
            const doctorId = req.user.id;
            const officialDetails = req.body;
            const updatedDoctor = await doctorService_1.default.updateOfficialDetails(doctorId, officialDetails);
            res.status(httpStatus_1.HttpStatus.OK).json(updatedDoctor);
        }
        catch (error) {
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
        }
    }
    async updatePersonalDetails(req, res) {
        try {
            const doctorId = req.user.id;
            const personalDetails = req.body;
            const updatedDoctor = await doctorService_1.default.updatePersonalDetails(doctorId, personalDetails);
            res.status(httpStatus_1.HttpStatus.OK).json(updatedDoctor);
        }
        catch (error) {
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
        }
    }
    ;
    async uploadProfileImage(req, res) {
        multer_1.profileUpload.single('profileImage')(req, res, async (err) => {
            if (err) {
                console.error('Multer Error:', err);
                return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ success: false, message: "Error uploading file", error: err.message });
            }
            const profileImage = req.file;
            if (!profileImage) {
                return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ success: false, message: "Profile image file is required" });
            }
            try {
                const doctorId = req.user.id;
                const profileImageUrl = profileImage.filename;
                const result = await doctorService_1.default.updateDoctorProfileImage(doctorId, profileImageUrl);
                if (result.success) {
                    return res.status(httpStatus_1.HttpStatus.OK).json({ success: true, profileImageUrl });
                }
                else {
                    return res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to update profile image" });
                }
            }
            catch (error) {
                console.error('Error saving profile image:', error);
                return res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error saving profile image" });
            }
        });
    }
    async otpForPassReset(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ message: 'Email is required' });
            }
            const result = await doctorService_1.default.requestOtpForPasswordReset(email);
            res.status(result.success ? httpStatus_1.HttpStatus.OK : httpStatus_1.HttpStatus.BAD_REQUEST).json(result);
        }
        catch (error) {
            console.error('Error in reset password', error);
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' });
        }
    }
    async verifyForgotOtp(req, res) {
        try {
            const { email, otp } = req.body;
            const result = await doctorService_1.default.verifyForgotOtp(email, otp);
            res.status(result.success ? httpStatus_1.HttpStatus.OK : httpStatus_1.HttpStatus.BAD_REQUEST).json(result);
        }
        catch (error) {
            console.error('Error in verifyForgotOtp:', error);
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
        }
    }
    async resendForgotOtp(req, res) {
        try {
            const { email } = req.body;
            const result = await doctorService_1.default.resendForgotOtp(email);
            res.status(result.success ? httpStatus_1.HttpStatus.OK : httpStatus_1.HttpStatus.BAD_REQUEST).json(result);
        }
        catch (error) {
            console.error('Error in resendForgotOtp:', error);
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
        }
    }
    async resetPassword(req, res) {
        try {
            const { email, otp, newPassword } = req.body;
            const otpResult = await doctorService_1.default.verifyForgotOtp(email, otp);
            if (!otpResult.success) {
                res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json(otpResult);
                return;
            }
            const result = await doctorService_1.default.updatePassword(email, newPassword);
            res.status(result.success ? httpStatus_1.HttpStatus.OK : httpStatus_1.HttpStatus.BAD_REQUEST).json(result);
        }
        catch (error) {
            console.error('Error resetting password:', error);
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
        }
    }
    async updateAvailability(req, res) {
        try {
            const { email, availability } = req.body;
            const updatedDoctor = await doctorService_1.default.updateAvailability(email, availability);
            res.json(updatedDoctor);
        }
        catch (error) {
            console.error('Error updating availability:', error);
            res.status(500).json({ message: "Something went wrong, please try again later" });
        }
    }
    async addSlot(req, res) {
        try {
            const { email, date, startTime, endTime, available } = req.body;
            if (!email || !date || !startTime || !endTime) {
                res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ success: false, message: 'All fields are required.' });
                return;
            }
            const slot = { date, startTime, endTime, available };
            await doctorService_1.default.addSlots(email, slot);
            res.status(httpStatus_1.HttpStatus.OK).json({ success: true, message: 'Slot added successfully' });
        }
        catch (error) {
            console.error('Error adding slot:', error);
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Error adding slot' });
        }
    }
    async getSlots(req, res) {
        try {
            const email = req.params.email;
            const slots = await doctorService_1.default.getSlots(email);
            res.status(httpStatus_1.HttpStatus.OK).json(slots);
        }
        catch (error) {
            console.error('Error fetching slots:', error);
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Error fetching slots' });
        }
    }
}
exports.default = new DoctorController();
