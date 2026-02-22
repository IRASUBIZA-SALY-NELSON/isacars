import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Clear existing users to avoid duplicates
    await User.deleteMany({});
    console.log('🧹 Cleared existing users');

    const users = [
      {
        name: 'System Admin',
        email: 'admin@gmail.com',
        password: 'nova@2026',
        role: 'admin',
        phone: '+1234567890',
        walletBalance: 0,
        passengerDetails: { rating: 5.0, ridesTaken: 0 },
        driverDetails: {
          licenseNumber: 'ADMIN123',
          vehicle: { model: 'N/A', plateNumber: 'ADMIN', color: 'Black' },
          isAvailable: false,
          rating: 5.0,
          ridesGiven: 0,
          earnings: 0
        }
      },
      {
        name: 'John Passenger',
        email: 'nelson@gmail.com',
        password: 'nova@2026',
        role: 'passenger',
        phone: '+1111111111',
        passengerDetails: {
            rating: 4.8,
            totalRides: 12
        }
      },
      {
        name: 'Mike Driver',
        email: 'isaac@gmail.com',
        password: 'nova@2026',
        role: 'driver',
        phone: '+2222222222',
        driverDetails: {
          licenseNumber: 'DL123456',
          vehicleType: 'premium',
          vehicleModel: 'Tesla Model 3',
          vehiclePlate: 'UBER-001',
          vehicleColor: 'Black',
          vehicleYear: 2023,
          isAvailable: true,
          rating: 4.9,
          totalRides: 154,
          earnings: 1250.50,
          currentLocation: {
            type: 'Point',
            coordinates: [-74.0060, 40.7128] // Example coordinates (NY)
          }
        }
      }
    ];

    // Use Promise.all to create users in parallel, ensuring pre-save hooks (hashing) run
    await Promise.all(users.map(user => User.create(user)));

    console.log('✅ All users seeded successfully!');
    console.log('-----------------------------------');
    console.log('👤 Admin:     admin@gmail.com');
    console.log('👤 Passenger: nelson@gmail.com');
    console.log('🚗 Driver:    isaac@gmail.com');
    console.log('🔑 Password:  nova@2026 (for all)');
    console.log('-----------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
