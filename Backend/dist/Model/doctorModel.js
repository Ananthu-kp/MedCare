"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Doctor = void 0;
const mongoose_1 = require("mongoose");
const slotSchema = new mongoose_1.Schema({
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    available: { type: Boolean, default: true }
});
const doctorSchema = new mongoose_1.Schema({
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
const Doctor = (0, mongoose_1.model)('Doctor', doctorSchema);
exports.Doctor = Doctor;
