import { User } from "../Model/userModel";
import { Doctor } from "../Model/doctorModel";


class AdminRepository {

    async getUsers() {
        try {
            const users = await User.find().exec();
            return users;
        } catch (error) {
            console.error('Error fetching users', error);
            throw new Error('Error fetching users')
        }
    }

    async unBlockUser(email: string) {
        try {
            return await User.updateOne({ email }, { isBlocked: false });
        } catch (error) {
            console.log("Error from database:", error);
            throw error;
        }
    }

    async blockUser(email: string) {
        try {
            return await User.updateOne({ email }, { isBlocked: true })
        } catch (error) {
            console.log("Error from database:", error);
            throw error;
        }
    }


    async getDoctors() {
        try {
            const doctors = await Doctor.find().exec();
            return doctors;
        } catch (error) {
            console.error('Error fetching doctors', error);
            throw new Error('Error fetching doctors');
        }
    }

    async findDoctorByEmail(email: string) {
        try {
            return await Doctor.findOne({ email }).exec();
        } catch (error) {
            console.error('Error finding doctor by email', error);
            throw new Error('Error finding doctor by email');
        }
    }

    async verifyDoctor(email: string) {
        try {
            return await Doctor.updateOne({ email }, { isVerified: true });
        } catch (error) {
            console.log("Error from database:", error);
            throw error;
        }
    }
    

    async blockDoctor(email: string) {
        try {
            return await Doctor.updateOne({ email }, { isBlocked: true });
        } catch (error) {
            console.log("Error from database:", error);
            throw error;
        }
    }

    async unBlockDoctor(email: string) {
        try {
            return await Doctor.updateOne({ email }, { isBlocked: false });
        } catch (error) {
            console.log("Error from database:", error);
            throw error;
        }
    }

    async rejectDoctor(email: string) {
        try {
            return await Doctor.deleteOne({ email });
        } catch (error) {
            console.log("Error from database:", error);
            throw error;
        }
    }

}

export default AdminRepository