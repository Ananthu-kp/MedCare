import { User } from "../Model/userModel";
import { Doctor } from "../Model/doctorModel";
import Category from "../Model/categoryModel";
import { IAdminRepository } from "../Interfaces/adminRepository.interface";


class AdminRepository implements IAdminRepository {

    async getUsers(searchQuery?: string): Promise<any[]> {
        try {
            const filter = searchQuery ? { name: { $regex: searchQuery, $options: 'i' } } : {};
            return await User.find(filter).exec();
        } catch (error) {
            console.error('Error fetching users', error);
            throw new Error('Error fetching users');
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


    async getDoctors(searchQuery?: string): Promise<any[]> {
        try {
            const filter = searchQuery ? { name: { $regex: searchQuery, $options: 'i' } } : {};
            const doctors = await Doctor.find(filter).exec();
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


    async getCategories(searchQuery?: string) {
        try {
            const filter = searchQuery ? { name: { $regex: searchQuery, $options: 'i' } } : {};
            return await Category.find(filter);
        } catch (error) {
            console.log("Error from database:", error);
            throw error;
        }
    }
    async addCategory(name: string) {
        try {
            return await Category.create({ name })
        } catch (error) {
            console.log("Error from database:", error);
            throw error;
        }
    }

    async deleteCategory(id: string) {
        try {
            return await Category.findByIdAndDelete(id)
        } catch (error) {
            console.log("Error from database:", error);
            throw error;
        }
    }

    async editCategory(id: string, newName: string) {
        try {
            const updatedCategory = await Category.findByIdAndUpdate(
                id,
                { name: newName },
                { new: true }
            );
            if (!updatedCategory) {
                throw new Error("Category not found");
            }
            return updatedCategory;
        } catch (error) {
            console.log("Error from database:", error);
            throw error;
        }
    }

}

export default AdminRepository