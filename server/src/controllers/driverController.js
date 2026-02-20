import User from '../models/User.js';

/**
 * @desc    Update driver location
 * @route   PUT /api/drivers/location
 * @access  Private (Driver)
 * @param   {number} latitude - Current latitude
 * @param   {number} longitude - Current longitude
 * @returns {object} {success: boolean, location: object}
 * @example
 * // Request
 * PUT /api/drivers/location
 * {
 *   "latitude": 40.7128,
 *   "longitude": -74.0060
 * }
 * // Response
 * {
 *   "success": true,
 *   "location": {
 *     "type": "Point",
 *     "coordinates": [-74.0060, 40.7128]
 *   }
 * }
 */
export const updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const driver = await User.findByIdAndUpdate(
      req.user.id,
      {
        'driverDetails.currentLocation': {
          type: 'Point',
          coordinates: [longitude, latitude]
        }
      },
      { new: true }
    );

    // Emit location update via socket
    req.app.get('io').emit('driverLocationUpdate', {
      driverId: req.user.id,
      location: { latitude, longitude }
    });

    res.status(200).json({
      success: true,
      location: driver.driverDetails.currentLocation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Toggle driver availability
// @route   PUT /api/drivers/availability
// @access  Private (Driver)
export const toggleAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;

    const driver = await User.findByIdAndUpdate(
      req.user.id,
      { 'driverDetails.isAvailable': isAvailable },
      { new: true }
    );

    res.status(200).json({
      success: true,
      isAvailable: driver.driverDetails.isAvailable
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update driver details
// @route   PUT /api/drivers/profile
// @access  Private (Driver)
export const updateDriverProfile = async (req, res) => {
  try {
    const {
      licenseNumber,
      vehicleType,
      vehicleModel,
      vehiclePlate,
      vehicleColor,
      vehicleYear
    } = req.body;

    const driver = await User.findByIdAndUpdate(
      req.user.id,
      {
        'driverDetails.licenseNumber': licenseNumber,
        'driverDetails.vehicleType': vehicleType,
        'driverDetails.vehicleModel': vehicleModel,
        'driverDetails.vehiclePlate': vehiclePlate,
        'driverDetails.vehicleColor': vehicleColor,
        'driverDetails.vehicleYear': vehicleYear
      },
      { new: true, runValidators: true }
    );

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

// @desc    Get driver earnings
// @route   GET /api/drivers/earnings
// @access  Private (Driver)
export const getEarnings = async (req, res) => {
  try {
    const driver = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      earnings: {
        total: driver.driverDetails.earnings,
        totalRides: driver.driverDetails.totalRides,
        rating: driver.driverDetails.rating
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload driver documents
// @route   POST /api/drivers/documents
// @access  Private (Driver)
export const uploadDocument = async (req, res) => {
  try {
    const { type, url } = req.body;

    const driver = await User.findById(req.user.id);

    driver.driverDetails.documents.push({
      type,
      url,
      verified: false
    });

    await driver.save();

    res.status(200).json({
      success: true,
      documents: driver.driverDetails.documents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// @desc    Driver cash out
// @route   POST /api/drivers/cashout
// @access  Private (Driver)
export const cashOut = async (req, res) => {
  try {
    const { amount } = req.body;
    const driver = await User.findById(req.user.id);

    if (driver.driverDetails.earnings < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    driver.driverDetails.earnings -= amount;
    await driver.save();

    res.status(200).json({
      success: true,
      earnings: driver.driverDetails.earnings,
      message: `Successfully cashed out ${amount}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
