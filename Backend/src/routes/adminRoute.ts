import { Router } from 'express'
import AdminController from '../Controllers/adminController'


const router = Router();
const adminController = new AdminController();

router.post('/login', adminController.login)
router.get('/users', adminController.getUser)
router.patch('/unblockUser', adminController.unBlockUser)
router.patch('/blockUser', adminController.blockUser)

router.get('/doctors', adminController.getDoctor);
router.patch('/block-doctor', adminController.blockDoctor);
router.patch('/unblock-doctor', adminController.unBlockDoctor);
router.patch('/verify-doctor', adminController.verifyDoctor);
router.delete('/reject-doctor', adminController.rejectDoctor);

router.get('/categories', adminController.getCategories);
router.post('/addCategory', adminController.addCategory);
router.delete('/deleteCategory/:id', adminController.deleteCategory);
router.patch('/editCategory/:id', adminController.editCategory)


export default router