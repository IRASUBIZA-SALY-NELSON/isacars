import express from 'express';
import { activateSOS } from '../controllers/safetyController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/sos', protect, activateSOS);

export default router;
