import { Router } from 'express';
import { OrganizationController } from '../controllers/organization.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.post('/', authenticate, OrganizationController.createOrganization);
router.get('/', authenticate, OrganizationController.getOrganizations);
router.get('/stats', authenticate, OrganizationController.getOrganizationsWithStats);
router.get('/:id', authenticate, OrganizationController.getOrganizationById);
router.put('/:id', authenticate, OrganizationController.updateOrganization);
router.delete('/:id', authenticate, OrganizationController.deleteOrganization);

export default router;

