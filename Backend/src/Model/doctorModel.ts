import { Schema, model } from "mongoose";

type SlotType = {
    date: string;
    startTime: string;
    endTime: string;
    available: boolean;
}

type DoctorType = {
    name: string;
    email: string;
    phone: string;
    password: string;
    category: string;
    yearsOfExperience: number;
    workingHospital: string;
    certificateUrl?: string;
    otp: string;
    profileImg?: string;
    availability?: boolean,
    consultationfee?: number,
    isBlocked?: boolean;
    isVerified?: boolean;
    address?: string;
    createdAt?: Date;
    tempData?: boolean;
    otpCreatedAt?: Date;
    slots?: SlotType[];
}

const slotSchema = new Schema<SlotType>({
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    available: { type: Boolean, default: true }
})

const doctorSchema = new Schema<DoctorType>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    yearsOfExperience: { type: Number, required: true },
    workingHospital: { type: String, required: true },
    category: { type: String, required: true },
    password: { type: String, required: true },
    profileImg: { type: String },
    availability: { type: Boolean, default: false },
    consultationfee: { type: Number },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    certificateUrl: { type: String },
    address: { type: String },
    otp: { type: String },
    createdAt: { type: Date, default: Date.now },
    tempData: { type: Boolean, default: false },
    otpCreatedAt: { type: Date, default: Date.now, expires: '5m' },
    slots: [slotSchema]
});

doctorSchema.index({ otpCreatedAt: 1 }, { expireAfterSeconds: 300 });

const Doctor = model<DoctorType>('Doctor', doctorSchema);

export { Doctor, DoctorType };
