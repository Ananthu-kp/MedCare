export interface IAdminRepository {
    getUsers(): Promise<any[]>;
    blockUser(email: string): Promise<any>;
    unBlockUser(email: string): Promise<any>;
    getDoctors(): Promise<any[]>;
    findDoctorByEmail(email: string): Promise<any | null>;
    verifyDoctor(email: string): Promise<any>;
    blockDoctor(email: string): Promise<any>;
    unBlockDoctor(email: string): Promise<any>;
    rejectDoctor(email: string): Promise<any>;
    getCategories(): Promise<any[]>;
    addCategory(name: string): Promise<any>;
    deleteCategory(id: string): Promise<any>;
    editCategory(id: string, newName: string): Promise<any>;
}