import { DoctorType } from "../Model/doctorModel";

export interface IDoctorRepository {
    createDoctor(doctor: DoctorType): Promise<DoctorType>;
    findDoctorByEmail(email: string): Promise<DoctorType | null>;
    saveOtp(email: string, otp: string): Promise<void>;
    verifyOtp(email: string, otp: string): Promise<boolean>;
    clearTempDoctorData(email: string): Promise<void>;
    getAllCategories(): Promise<string[]>;
    findDoctorById(doctorId: string): Promise<DoctorType | null>;
    updateOfficialDetails(doctorId: string, officialDetails: Partial<DoctorType>): Promise<DoctorType | null>;
    updatePersonalDetails(doctorId: string, personalDetails: Partial<DoctorType>): Promise<DoctorType | null>;
    updateDoctorProfileImage(doctorId: string, profileImageUrl: string): Promise<DoctorType | null>;
    updatePassword(email: string, hashedPassword: string): Promise<void>;
    updateDoctorAvailability(email: string, availability: boolean): Promise<DoctorType | null>;
    addSlotToDoctor(email: string, slot: any): Promise<DoctorType | null>;
    getSlotsForDoctor(email: string): Promise<any[]>;
}