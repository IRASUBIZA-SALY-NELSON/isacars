import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
  googleAuth,
  deleteAccount,
  updateSettings,
  addTrustedContact,
  removeTrustedContact,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);
router.put('/updateprofile', protect, updateProfile);
router.put('/updatepassword', protect, updatePassword);
router.delete('/deleteaccount', protect, deleteAccount);
router.put('/settings', protect, updateSettings);
router.post('/trusted-contacts', protect, addTrustedContact);
router.delete('/trusted-contacts/:id', protect, removeTrustedContact);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

export default router;
