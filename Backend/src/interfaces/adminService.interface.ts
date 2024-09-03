export interface IAdminService {
    login(email: string, password: string): Promise<{ token: string } | Error>;
    getUser(): Promise<any[]>;
    blockUser(email: string): Promise<string | Error>;
    unBlockUser(email: string): Promise<string | Error>;
    getDoctor(): Promise<any[]>;
    blockDoctor(email: string): Promise<string | Error>;
    unBlockDoctor(email: string): Promise<string | Error>;
    verifyDoctor(email: string): Promise<string | Error>;
    rejectDoctor(email: string): Promise<string | Error>;
    getCategories(): Promise<any[]>;
    addCategory(name: string): Promise<any>;
    deleteCategory(id: string): Promise<void | Error>;
    editCategory(id: string, newName: string): Promise<any | Error>;
}