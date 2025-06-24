import express from 'express';
import { registerUser, loginUser,refreshToken,logoutUser, loginAdmin,} from '../controllers/authController.js';
// import { loginAdmin } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin-login',loginAdmin)
router.post('/refresh',refreshToken)
router.post('/logout',logoutUser)

export default router;
