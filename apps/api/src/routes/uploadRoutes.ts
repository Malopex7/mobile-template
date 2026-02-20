import { Router } from 'express';
import { getUploadUrl } from '../controllers/uploadController';
import { protect } from '../middlewares/auth';

const router = Router();

router.post('/signed-url', protect, getUploadUrl);

export default router;
