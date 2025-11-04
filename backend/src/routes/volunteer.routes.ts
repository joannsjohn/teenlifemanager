import { Router } from 'express';
import { VolunteerController } from '../controllers/volunteer.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Most routes require authentication
router.post('/', authenticate, VolunteerController.createVolunteerHour);
router.get('/', authenticate, VolunteerController.getVolunteerHours);
router.get('/total', authenticate, VolunteerController.getTotalHours);
router.get('/:id', authenticate, VolunteerController.getVolunteerHourById);
router.put('/:id', authenticate, VolunteerController.updateVolunteerHour);
router.delete('/:id', authenticate, VolunteerController.deleteVolunteerHour);

// Public route for verification (supervisors can verify without login)
router.post('/verify', VolunteerController.verifyByCode);

export default router;
