import Ride from '../models/Ride.js';
import User from '../models/User.js';

/**
 * Calculate fare based on distance, duration, and vehicle type
 * @param {number} distance - Distance in kilometers
 * @param {string} vehicleType - Type of vehicle (economy, premium, suv, bike)
 * @param {number} duration - Duration in minutes
 * @returns {object} Fare breakdown with total amount
 */
const calculateFare = (distance, vehicleType, duration) => {
  const baseFares = {
    economy: 3,
    premium: 5,
    suv: 7,
    bike: 2
  };

  const perKmRates = {
    economy: 1.5,
    premium: 2.5,
    suv: 3,
    bike: 1
  };

  const baseFare = baseFares[vehicleType] || baseFares.economy;
  const distanceFare = distance * (perKmRates[vehicleType] || perKmRates.economy);
  const timeFare = (duration / 60) * 0.5; // $0.5 per minute

  const total = baseFare + distanceFare + timeFare;

  return {
    baseFare,
    distanceFare,
    timeFare,
    surgeFare: 0,
    total: parseFloat(total.toFixed(2))
  };
};

// @desc    Create a new ride request
// @route   POST /api/rides
// @access  Private (Passenger)
/**
 * @desc    Create a new ride request
 * @route   POST /api/rides
 * @access  Private (Passenger)
 * @param   {string} pickupLocation - Pickup address
 * @param   {string} dropoffLocation - Destination address
 * @param   {string} vehicleType - Vehicle type (economy, premium, suv, bike)
 * @param   {number} distance - Distance in kilometers
 * @param   {number} duration - Duration in minutes
 * @param   {string} [paymentMethod] - Payment method (cash, card, wallet)
 * @returns {object} {success: boolean, ride: object}
 * @example
 * // Request
 * POST /api/rides
 * {
 *   "pickupLocation": "123 Main St, City",
 *   "dropoffLocation": "456 Oak Ave, City",
 *   "vehicleType": "economy",
 *   "distance": 5.2,
 *   "duration": 15,
 *   "paymentMethod": "card"
 * }
 * // Response
 * {
 *   "success": true,
 *   "ride": {
 *     "_id": "64a7b8c9f1e2d3a4b5c6d",
 *     "status": "pending",
 *     "fare": {"total": 15.50, "baseFare": 3, "distanceFare": 7.80, "timeFare": 3.75},
 *     "passenger": {"name": "John Doe", "phone": "+1234567890"}
 *   }
 * }
 */
export const createRide = async (req, res) => {
  try {
    const {
      pickupLocation,
      dropoffLocation,
      vehicleType,
      distance,
      duration,
      paymentMethod
    } = req.body;

    // Calculate fare
    const fare = calculateFare(distance, vehicleType, duration);

    const ride = await Ride.create({
      passenger: req.user.id,
      pickupLocation,
      dropoffLocation,
      vehicleType,
      distance,
      duration,
      estimatedDuration: duration,
      fare,
      paymentMethod: paymentMethod || 'cash',
      status: 'pending'
    });

    const populatedRide = await Ride.findById(ride._id)
      .populate('passenger', 'name phone avatar');

    // Emit socket event to notify available drivers only
    const io = req.app.get('io');

    // Find all available drivers
    const availableDrivers = await User.find({
      role: 'driver',
      'driverDetails.isAvailable': true
    }).select('_id');

    console.log(`🚗 Sending ride request to ${availableDrivers.length} available drivers`);
    console.log('Available driver IDs:', availableDrivers.map(d => d._id.toString()));

    // Send ride request to each available driver
    availableDrivers.forEach(driver => {
      console.log(`📤 Sending ride request to driver ${driver._id}`);
      io.to(driver._id.toString()).emit('newRideRequest', populatedRide);
    });

    res.status(201).json({
      success: true,
      ride: populatedRide
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get available drivers nearby
// @route   POST /api/rides/nearby-drivers
// @access  Private (Passenger)
export const getNearbyDrivers = async (req, res) => {
  try {
    const { latitude, longitude, vehicleType, maxDistance = 5000 } = req.body;

    const drivers = await User.find({
      role: 'driver',
      'driverDetails.isAvailable': true,
      'driverDetails.vehicleType': vehicleType,
      'driverDetails.currentLocation': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: maxDistance // meters
        }
      }
    }).select('name phone avatar driverDetails');

    res.status(200).json({
      success: true,
      count: drivers.length,
      drivers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Accept ride request (Driver)
// @route   PUT /api/rides/:id/accept
// @access  Private (Driver)
export const acceptRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    if (ride.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Ride is no longer available'
      });
    }

    ride.driver = req.user.id;
    ride.status = 'accepted';
    await ride.save();

    const populatedRide = await Ride.findById(ride._id)
      .populate('passenger', 'name phone avatar')
      .populate('driver', 'name phone avatar driverDetails');

    // Update driver availability
    await User.findByIdAndUpdate(req.user.id, {
      'driverDetails.isAvailable': false
    });

    // Notify passenger
    req.app.get('io').to(ride.passenger.toString()).emit('rideAccepted', populatedRide);

    res.status(200).json({
      success: true,
      ride: populatedRide
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update ride status
// @route   PUT /api/rides/:id/status
// @access  Private (Driver)
export const updateRideStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    if (ride.driver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    ride.status = status;

    if (status === 'started') {
      ride.startTime = new Date();
    } else if (status === 'completed') {
      ride.endTime = new Date();
      ride.paymentStatus = ride.paymentMethod === 'cash' ? 'completed' : 'pending';

      // Update driver stats
      await User.findByIdAndUpdate(ride.driver, {
        $inc: {
          'driverDetails.totalRides': 1,
          'driverDetails.earnings': ride.fare.total
        },
        'driverDetails.isAvailable': true
      });

      // Update passenger stats
      await User.findByIdAndUpdate(ride.passenger, {
        $inc: { 'passengerDetails.totalRides': 1 }
      });
    }

    await ride.save();

    const populatedRide = await Ride.findById(ride._id)
      .populate('passenger', 'name phone avatar')
      .populate('driver', 'name phone avatar driverDetails');

    // Notify passenger
    req.app.get('io').to(ride.passenger.toString()).emit('rideStatusUpdated', populatedRide);

    res.status(200).json({
      success: true,
      ride: populatedRide
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel ride
// @route   PUT /api/rides/:id/cancel
// @access  Private
export const cancelRide = async (req, res) => {
  try {
    const { reason } = req.body;
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    // Check if user is passenger or driver
    if (ride.passenger.toString() !== req.user.id &&
        ride.driver?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (ride.status === 'completed' || ride.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel this ride'
      });
    }

    ride.status = 'cancelled';
    ride.cancelledBy = req.user.id;
    ride.cancellationReason = reason;
    await ride.save();

    // If driver cancels, make them available again
    if (ride.driver && ride.driver.toString() === req.user.id) {
      await User.findByIdAndUpdate(req.user.id, {
        'driverDetails.isAvailable': true
      });
    }

    const populatedRide = await Ride.findById(ride._id)
      .populate('passenger', 'name phone avatar')
      .populate('driver', 'name phone avatar driverDetails');

    // Notify other party
    const notifyUserId = ride.passenger.toString() === req.user.id
      ? ride.driver?.toString()
      : ride.passenger.toString();

    if (notifyUserId) {
      req.app.get('io').to(notifyUserId).emit('rideCancelled', populatedRide);
    }

    res.status(200).json({
      success: true,
      ride: populatedRide
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get ride history
// @route   GET /api/rides/history
// @access  Private
export const getRideHistory = async (req, res) => {
  try {
    const query = req.user.role === 'driver'
      ? { driver: req.user.id }
      : { passenger: req.user.id };

    const rides = await Ride.find(query)
      .populate('passenger', 'name phone avatar')
      .populate('driver', 'name phone avatar driverDetails')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: rides.length,
      rides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single ride
// @route   GET /api/rides/:id
// @access  Private
export const getRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate('passenger', 'name phone avatar')
      .populate('driver', 'name phone avatar driverDetails');

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    // Check authorization
    if (ride.passenger.toString() !== req.user.id &&
        ride.driver?.toString() !== req.user.id &&
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.status(200).json({
      success: true,
      ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Rate ride
// @route   POST /api/rides/:id/rate
// @access  Private
export const rateRide = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    if (ride.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed rides'
      });
    }

    // Check if user is passenger or driver
    if (ride.passenger.toString() === req.user.id) {
      ride.rating.passengerRating = rating;
      ride.rating.passengerReview = review;

      // Update driver rating
      const driverRides = await Ride.find({
        driver: ride.driver,
        'rating.passengerRating': { $exists: true }
      });

      const avgRating = driverRides.reduce((sum, r) => sum + r.rating.passengerRating, 0) / driverRides.length;

      await User.findByIdAndUpdate(ride.driver, {
        'driverDetails.rating': avgRating.toFixed(1)
      });
    } else if (ride.driver?.toString() === req.user.id) {
      ride.rating.driverRating = rating;
      ride.rating.driverReview = review;

      // Update passenger rating
      const passengerRides = await Ride.find({
        passenger: ride.passenger,
        'rating.driverRating': { $exists: true }
      });

      const avgRating = passengerRides.reduce((sum, r) => sum + r.rating.driverRating, 0) / passengerRides.length;

      await User.findByIdAndUpdate(ride.passenger, {
        'passengerDetails.rating': avgRating.toFixed(1)
      });
    } else {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await ride.save();

    res.status(200).json({
      success: true,
      ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get active ride for user
// @route   GET /api/rides/active
// @access  Private
export const getActiveRide = async (req, res) => {
  try {
    const query = req.user.role === 'driver'
      ? { driver: req.user.id, status: { $in: ['accepted', 'arrived', 'started'] } }
      : { passenger: req.user.id, status: { $in: ['pending', 'accepted', 'arrived', 'started'] } };

    const ride = await Ride.findOne(query)
      .populate('passenger', 'name phone avatar')
      .populate('driver', 'name phone avatar driverDetails')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all pending ride requests for drivers
// @route   GET /api/rides/pending
// @access  Private (Driver)
export const getPendingRides = async (req, res) => {
  try {
    const rides = await Ride.find({
      status: 'pending',
      driver: { $in: [null, undefined] }
    })
      .populate('passenger', 'name phone avatar passengerDetails.rating')
      .sort({ createdAt: -1 })
      .limit(20); // Limit to last 20 requests

    console.log(`Found ${rides.length} pending rides for driver`);
    rides.forEach((ride, index) => {
      console.log(`Ride ${index + 1}: ${ride._id}, Passenger: ${ride.passenger?.name}, Phone: ${ride.passenger?.phone}, Rating: ${ride.passenger?.passengerDetails?.rating}`);
    });

    res.status(200).json({
      success: true,
      requests: rides
    });
  } catch (error) {
    console.error('Error fetching pending rides:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Share ride details with trusted contacts
 * @route   POST /api/rides/:id/share
 * @access  Private (Passenger)
 */
export const shareRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    // Generate a unique share link/token
    const shareToken = Math.random().toString(36).slice(-10);

    // In a real app, you might save this token to the DB with an expiration
    // and send it via SMS/Email to trusted contacts.

    res.status(200).json({
      success: true,
      shareLink: `https://nova.transport/track/${ride._id}?token=${shareToken}`,
      message: 'Ride tracking link generated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
