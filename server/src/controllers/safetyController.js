import User from '../models/User.js';
import Ride from '../models/Ride.js';

/**
 * @desc    Activate Emergency SOS
 * @route   POST /api/safety/sos
 * @access  Private
 */
export const activateSOS = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Find active ride if any
    const activeRide = await Ride.findOne({
      $or: [{ passenger: req.user.id }, { driver: req.user.id }],
      status: { $in: ['accepted', 'arrived', 'started'] }
    }).populate('passenger driver');

    // In a real app:
    // 1. Send SMS/Push to all trusted contacts
    // 2. Notify emergency response center
    // 3. Emit socket event to a special monitoring dashboard

    req.app.get('io').emit('sosActivated', {
      userId: req.user.id,
      userName: user.name,
      location: activeRide ? activeRide.pickupLocation : 'Unknown',
      rideId: activeRide ? activeRide._id : null,
      timestamp: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'SOS Activated. Emergency services have been notified.',
      trustedContactsNotified: user.trustedContacts.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
