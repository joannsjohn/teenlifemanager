import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/me', UserController.getMe);
router.put('/me', UserController.updateMe);
router.get('/me/stats', UserController.getStats);

export default router;
