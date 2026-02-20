import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['passenger', 'driver', 'admin'],
    default: 'passenger'
  },
  avatar: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Driver specific fields
  driverDetails: {
    licenseNumber: String,
    vehicleType: {
      type: String,
      enum: ['economy', 'premium', 'suv', 'bike']
    },
    vehicleModel: String,
    vehiclePlate: String,
    vehicleColor: String,
    vehicleYear: Number,
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5
    },
    totalRides: {
      type: Number,
      default: 0
    },
    earnings: {
      type: Number,
      default: 0
    },
    isAvailable: {
      type: Boolean,
      default: false
    },
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    },
    documents: [{
      type: {
        type: String,
        enum: ['license', 'insurance', 'registration', 'photo']
      },
      url: String,
      verified: {
        type: Boolean,
        default: false
      }
    }]
  },
  // Passenger specific fields
  passengerDetails: {
    totalRides: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5
    }
  },
  paymentMethods: [{
    type: {
      type: String,
      enum: ['card', 'cash', 'wallet']
    },
    isDefault: Boolean,
    cardLast4: String,
    stripePaymentMethodId: String
  }],
  wallet: {
    balance: {
      type: Number,
      default: 0
    }
  },
  notificationSettings: {
    pushNotifications: { type: Boolean, default: true },
    emailUpdates: { type: Boolean, default: true },
    smsAlerts: { type: Boolean, default: true },
    locationSharing: { type: Boolean, default: false }
  },
  securitySettings: {
    twoFactorEnabled: { type: Boolean, default: false },
    biometricEnabled: { type: Boolean, default: false }
  },
  trustedContacts: [{
    name: String,
    phone: String,
    relationship: String,
    isGuardian: { type: Boolean, default: false }
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Index for geospatial queries
userSchema.index({ 'driverDetails.currentLocation': '2dsphere' });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
