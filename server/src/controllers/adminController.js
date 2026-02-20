import User from '../models/User.js';
import Ride from '../models/Ride.js';

/**
 * @desc    Get admin dashboard stats
 * @route   GET /api/admin/stats
 * @access  Private (Admin)
 */
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'passenger' });
    const totalDrivers = await User.countDocuments({ role: 'driver' });
    const totalRides = await Ride.countDocuments();
    const completedRides = await Ride.countDocuments({ status: 'completed' });

    // Calculate total revenue
    const revenueResult = await Ride.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$fare.total' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Last 30 days revenue
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRevenueResult = await Ride.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: null, total: { $sum: '$fare.total' } } }
    ]);
    const recentRevenue = recentRevenueResult.length > 0 ? recentRevenueResult[0].total : 0;

    // Rides by month for charts
    const monthlyRides = await Ride.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
          revenue: { $sum: '$fare.total' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalDrivers,
        totalRides,
        completedRides,
        totalRevenue,
        recentRevenue,
        monthlyRides
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get all users (paginated)
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update user status (block/unblock)
 * @route   PUT /api/admin/users/:id/status
 * @access  Private (Admin)
 */
export const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

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

/**
 * @desc    Verify driver document
 * @route   PUT /api/admin/drivers/:driverId/documents/:docId/verify
 * @access  Private (Admin)
 */
export const verifyDriverDocument = async (req, res) => {
  try {
    const { driverId, docId } = req.params;
    const { verified } = req.body;

    const driver = await User.findById(driverId);
    if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });

    const doc = driver.driverDetails.documents.id(docId);
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });

    doc.verified = verified;
    await driver.save();

    res.status(200).json({
      success: true,
      driver
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
