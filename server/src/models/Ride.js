import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema({
  passenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  pickupLocation: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  },
  dropoffLocation: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  },
  vehicleType: {
    type: String,
    enum: ['economy', 'premium', 'suv', 'bike'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'arrived', 'started', 'completed', 'cancelled'],
    default: 'pending'
  },
  fare: {
    baseFare: {
      type: Number,
      required: true
    },
    distanceFare: {
      type: Number,
      required: true
    },
    timeFare: {
      type: Number,
      default: 0
    },
    surgeFare: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  distance: {
    type: Number, // in kilometers
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  estimatedDuration: {
    type: Number // in minutes
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'wallet'],
    default: 'cash'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  stripePaymentIntentId: String,
  rating: {
    passengerRating: {
      type: Number,
      min: 1,
      max: 5
    },
    driverRating: {
      type: Number,
      min: 1,
      max: 5
    },
    passengerReview: String,
    driverReview: String
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancellationReason: String,
  startTime: Date,
  endTime: Date,
  route: [{
    lat: Number,
    lng: Number,
    timestamp: Date
  }]
}, {
  timestamps: true
});

// Indexes for efficient queries
rideSchema.index({ passenger: 1, createdAt: -1 });
rideSchema.index({ driver: 1, createdAt: -1 });
rideSchema.index({ status: 1 });
rideSchema.index({ 'pickupLocation.coordinates': '2dsphere' });

export default mongoose.model('Ride', rideSchema);
