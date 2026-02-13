import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@demo.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create Admin User
    // Note: Provide default values for required fields if strict schema
    const admin = await User.create({
      name: 'System Admin',
      email: adminEmail,
      password: 'password123',
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
    });

    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@demo.com');
    console.log('🔑 Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
