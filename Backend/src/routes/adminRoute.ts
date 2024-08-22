import { Router } from 'express'
import AdminController from '../Controllers/adminController'


const router = Router();
const adminController = new AdminController();

router.post('/login', adminController.loginController)

export default router