import { Router } from 'express';
import { register, login, refreshToken, logout } from '../controllers/authController';
import { protect } from '../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', protect, logout); // Logout requires a valid access token first ideally, and we revoke the refresh token.

export default router;
