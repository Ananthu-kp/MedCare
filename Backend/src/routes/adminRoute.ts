import { Router } from 'express'
import AdminController from '../Controllers/adminController'


const router = Router();
const adminController = new AdminController();

router.post('/login', adminController.loginController)
router.get('/users', adminController.getUserController)
router.patch('/unblockUser', adminController.unBlockUserController)
router.patch('/blockUser', adminController.blockUserController)

router.get('/doctors', adminController.getDoctorController);
router.put('/block-doctor', adminController.blockDoctorController);
router.put('/unblock-doctor', adminController.unBlockDoctorController);
router.patch('/verify-doctor', adminController.verifyDoctorController);
router.delete('/reject-doctor', adminController.rejectDoctorController);


export default router