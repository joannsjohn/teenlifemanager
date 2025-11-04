import { Router } from 'express';
import { JournalController } from '../controllers/journal.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', JournalController.createJournalEntry);
router.get('/', JournalController.getJournalEntries);
router.get('/:id', JournalController.getJournalEntryById);
router.put('/:id', JournalController.updateJournalEntry);
router.delete('/:id', JournalController.deleteJournalEntry);

export default router;
