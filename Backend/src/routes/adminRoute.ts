import { Router } from 'express'
import AdminController from '../Controllers/adminController'


const router = Router();
const adminController = new AdminController();

router.post('/login', adminController.loginController)
router.get('/users', adminController.getUserController)
router.patch('/unblockUser', adminController.unBlockUserController)
router.patch('/blockUser', adminController.blockUserController)

export default router