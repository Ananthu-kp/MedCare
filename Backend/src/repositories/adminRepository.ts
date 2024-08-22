import { User } from "../Model/userModel";

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

    async unBlockUserRepository(email: string) {
        try {
            return await User.updateOne({ email }, { isBlocked: false });
        } catch (error) {
            console.log("Error from database:", error);
            throw error;
        }
    }

    async blockUserRespository(email: string) {
        try {
            return await User.updateOne({ email }, { isBlocked: true })
        } catch (error) {
            console.log("Error from database:", error);
            throw error;
        }
    }

}

export default AdminRepository