import { DoctorType } from "../Model/doctorModel";

export interface IDoctorService {
    registerDoctor(doctor: DoctorType): Promise<{ success: boolean; message: string; otp: string }>;
    verifyOtp(email: string, otp: string): Promise<{ success: boolean; message: string }>;
    resendOtp(email: string): Promise<{ success: boolean; message: string }>;
    clearTempDoctorData(email: string): Promise<void>;
    getCategories(): Promise<string[]>;
    findDoctorByEmail(email: string): Promise<DoctorType | null>;
    saveOtp(email: string, otp: string): Promise<void>;
    getDoctorProfile(doctorId: string): Promise<DoctorType | null>;
    updateOfficialDetails(doctorId: string, officialDetails: Partial<DoctorType>): Promise<DoctorType | null>;
    updatePersonalDetails(doctorId: string, personalDetails: Partial<DoctorType>): Promise<DoctorType | null>;
    updateDoctorProfileImage(doctorId: string, profileImageUrl: string): Promise<{ success: boolean; doctor?: DoctorType }>;
    requestOtpForPasswordReset(email: string): Promise<{ success: boolean; message: string; otp?: string }>;
    verifyForgotOtp(email: string, otp: string): Promise<{ success: boolean; message: string }>;
    resendForgotOtp(email: string): Promise<{ success: boolean; message: string, otp?: string }>;
    updatePassword(email: string, newPassword: string): Promise<{ success: boolean; message: string }>;
    updateAvailability(email: string, availability: boolean): Promise<any>;
    addSlots(email: string, slot: any): Promise<void>;
    getSlots(email: string): Promise<any[]>;
}