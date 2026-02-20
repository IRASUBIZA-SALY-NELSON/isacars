import express from 'express';
import {
  getAdminStats,
  getAllUsers,
  updateUserStatus,
  verifyDriverDocument
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.put('/drivers/:driverId/documents/:docId/verify', verifyDriverDocument);

export default router;
