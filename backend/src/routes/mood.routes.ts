import { Router } from 'express';
import { MoodController } from '../controllers/mood.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', MoodController.createMoodEntry);
router.get('/', MoodController.getMoodEntries);
router.get('/average', MoodController.getAverageMood);
router.get('/:id', MoodController.getMoodEntryById);
router.put('/:id', MoodController.updateMoodEntry);
router.delete('/:id', MoodController.deleteMoodEntry);

export default router;
