export interface IAdminService {
    login(email: string, password: string): Promise<{ token: string; refreshToken: string }>;
    getUser(searchQuery?: string): Promise<any[]>;
    blockUser(email: string): Promise<string>;
    unBlockUser(email: string): Promise<string>;
    getDoctor(searchQuery?: string): Promise<any[]>;
    blockDoctor(email: string): Promise<string>;
    unBlockDoctor(email: string): Promise<string>;
    verifyDoctor(email: string): Promise<string>;
    rejectDoctor(email: string): Promise<string>;
    getCategories(searchQuery?: string): Promise<any[]>;
    addCategory(name: string): Promise<any>;
    deleteCategory(id: string): Promise<void>;
    editCategory(id: string, newName: string): Promise<any>;
}