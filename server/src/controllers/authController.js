import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';

// Initialize Google OAuth Client
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 * @param   {string} name - User full name
 * @param   {string} email - User email address
 * @param   {string} phone - User phone number
 * @param   {string} password - User password
 * @param   {string} [role] - User role (passenger, driver, admin)
 * @returns {object} {success: boolean, token: string, user: object}
 * @example
 * // Request
 * POST /api/auth/register
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "phone": "+1234567890",
 *   "password": "password123",
 *   "role": "passenger"
 * }
 * // Response
 * {
 *   "success": true,
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "user": {
 *     "id": "64a7b8c9f1e2d3a4b5c6d",
 *     "name": "John Doe",
 *     "email": "john@example.com",
 *     "role": "passenger"
 *   }
 * }
 */
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or phone'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role || 'passenger'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 * @param   {string} email - User email or phone
 * @param   {string} password - User password
 * @returns {object} {success: boolean, token: string, user: object}
 * @example
 * // Request
 * POST /api/auth/login
 * {
 *   "email": "john@example.com",
 *   "password": "password123"
 * }
 * // Response
 * {
 *   "success": true,
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "user": {
 *     "id": "64a7b8c9f1e2d3a4b5c6d",
 *     "name": "John Doe",
 *     "email": "john@example.com",
 *     "role": "passenger"
 *   }
 * }
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        driverDetails: user.driverDetails,
        passengerDetails: user.passengerDetails
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/updateprofile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      avatar: req.body.avatar
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Google OAuth login
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req, res) => {
  try {
    const { token, email, name, picture } = req.body;

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Google token'
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user from Google data
      user = await User.create({
        name: name || payload.name,
        email: email || payload.email,
        avatar: picture || payload.picture,
        password: 'google_oauth_' + Math.random().toString(36).slice(-8),
        role: 'passenger',
        isGoogleAuth: true
      });
    } else {
      // Update user's Google info if needed
      if (!user.avatar) {
        user.avatar = picture || payload.picture;
        await user.save();
      }
    }

    const jwtToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        driverDetails: user.driverDetails,
        passengerDetails: user.passengerDetails
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Google authentication failed'
    });
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.comparePassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Password is incorrect'
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/auth/deleteaccount
// @access  Private
export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user settings (notifications, security)
// @route   PUT /api/auth/settings
// @access  Private
export const updateSettings = async (req, res) => {
  try {
    const { notificationSettings, securitySettings } = req.body;

    const updateData = {};
    if (notificationSettings) updateData.notificationSettings = notificationSettings;
    if (securitySettings) updateData.securitySettings = securitySettings;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add trusted contact
// @route   POST /api/auth/trusted-contacts
// @access  Private
export const addTrustedContact = async (req, res) => {
  try {
    const { name, phone, relationship, isGuardian } = req.body;
    const user = await User.findById(req.user.id);

    user.trustedContacts.push({ name, phone, relationship, isGuardian });
    await user.save();

    res.status(200).json({
      success: true,
      trustedContacts: user.trustedContacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove trusted contact
// @route   DELETE /api/auth/trusted-contacts/:id
// @access  Private
export const removeTrustedContact = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.trustedContacts = user.trustedContacts.filter(
      contact => contact._id.toString() !== req.params.id
    );
    await user.save();

    res.status(200).json({
      success: true,
      trustedContacts: user.trustedContacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const resetToken = Math.random().toString(36).slice(-8);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();
    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.resettoken,
      resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(200).json({ success: true, message: 'Success' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
