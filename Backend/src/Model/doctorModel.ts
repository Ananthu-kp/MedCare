import { Schema, model, Document, Types } from "mongoose";

export interface SlotType {
    date: string;
    startTime: string;
    endTime: string;
    available: boolean;
}

export interface IDoctor {
    name: string;
    email: string;
    phone?: string;
    category?: string;
    yearsOfExperience?: number;
    workingHospital?: string;
    password: string;
    isBlocked?: boolean;
    isVerified?: boolean;
    availability?: boolean;
    profileImg?: string;
    consultationfee?: number;
    otp?: string;
    tempData?: boolean;
    otpCreatedAt?: Date;
    certificateUrl?: string;
    slots?: SlotType[];
    createdAt?: Date;
}

export interface DoctorType extends IDoctor, Document {
    _id: Types.ObjectId;
}

const slotSchema = new Schema<SlotType>({
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    available: { type: Boolean, default: true }
});

const doctorSchema = new Schema<DoctorType>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    category: { type: String },
    yearsOfExperience: { type: Number },
    workingHospital: { type: String },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    availability: { type: Boolean, default: false },
    profileImg: { type: String },
    consultationfee: { type: Number },
    otp: { type: String },
    tempData: { type: Boolean, default: false },
    otpCreatedAt: { type: Date, default: Date.now },
    certificateUrl: { type: String },
    slots: [slotSchema],
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

doctorSchema.index({ otpCreatedAt: 1 }, { expireAfterSeconds: 300 });

const Doctor = model<DoctorType>('Doctor', doctorSchema);

export { Doctor };