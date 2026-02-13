import express from 'express';
import {
  createRide,
  getNearbyDrivers,
  acceptRide,
  updateRideStatus,
  cancelRide,
  getRideHistory,
  getRide,
  rateRide,
  getActiveRide
} from '../controllers/rideController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('passenger'), createRide);
router.post('/nearby-drivers', protect, authorize('passenger'), getNearbyDrivers);
router.get('/history', protect, getRideHistory);
router.get('/active', protect, getActiveRide);
router.get('/:id', protect, getRide);
router.put('/:id/accept', protect, authorize('driver'), acceptRide);
router.put('/:id/status', protect, authorize('driver'), updateRideStatus);
router.put('/:id/cancel', protect, cancelRide);
router.post('/:id/rate', protect, rateRide);

export default router;
