import express from 'express';
import {
  updateLocation,
  toggleAvailability,
  updateDriverProfile,
  getEarnings,
  uploadDocument
} from '../controllers/driverController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.put('/location', protect, authorize('driver'), updateLocation);
router.put('/availability', protect, authorize('driver'), toggleAvailability);
router.put('/profile', protect, authorize('driver'), updateDriverProfile);
router.get('/earnings', protect, authorize('driver'), getEarnings);
router.post('/documents', protect, authorize('driver'), uploadDocument);

export default router;
