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
        phone: '+250788123456',
        avatar: 'https://i.pravatar.cc/60?u=admin',
        isActive: true,
        isVerified: true,
        walletBalance: 0,
        passengerDetails: {
          rating: 5.0,
          totalRides: 0,
          paymentMethods: [
            { type: 'card', isDefault: true, cardLast4: '4242' },
            { type: 'cash', isDefault: false }
          ]
        },
        driverDetails: {
          licenseNumber: 'ADMIN123',
          vehicle: { model: 'N/A', plateNumber: 'ADMIN', color: 'Black' },
          isAvailable: false,
          rating: 5.0,
          totalRides: 0,
          earnings: 0,
          documents: [
            { type: 'license', url: '/documents/admin-license.jpg', verified: true },
            { type: 'insurance', url: '/documents/admin-insurance.jpg', verified: true }
          ]
        }
      },
      {
        name: 'Saly Nelson',
        email: 'nelson@gmail.com',
        password: 'nova@2026',
        role: 'passenger',
        phone: '+250788111111',
        avatar: 'https://i.pravatar.cc/60?u=passenger1',
        isActive: true,
        isVerified: true,
        passengerDetails: {
          rating: 4.8,
          totalRides: 12,
          paymentMethods: [
            { type: 'card', isDefault: true, cardLast4: '5555' },
            { type: 'wallet', isDefault: false },
            { type: 'cash', isDefault: false }
          ]
        },
        wallet: {
          balance: 50000
        },
        notificationSettings: {
          pushNotifications: true,
          emailUpdates: true,
          smsAlerts: true,
          locationSharing: false
        },
        securitySettings: {
          twoFactorEnabled: false,
          biometricEnabled: false
        },
        trustedContacts: [
          { name: 'Alice Nelson', phone: '+250788222222', relationship: 'sister', isGuardian: false },
          { name: 'Bob Nelson', phone: '+250788333333', relationship: 'father', isGuardian: true }
        ]
      },
      {
        name: 'Isaac',
        email: 'isaac@gmail.com',
        password: 'nova@2026',
        role: 'driver',
        phone: '+250788222333',
        avatar: 'https://i.pravatar.cc/60?u=driver1',
        isActive: true,
        isVerified: true,
        driverDetails: {
          licenseNumber: 'DL123456789',
          vehicleType: 'premium',
          vehicleModel: 'Toyota Camry',
          vehiclePlate: 'RWA-2024-001',
          vehicleColor: 'Silver',
          vehicleYear: 2022,
          isAvailable: true,
          rating: 4.9,
          totalRides: 154,
          earnings: 125050,
          currentLocation: {
            type: 'Point',
            coordinates: [-74.0060, 40.7128]
          },
          documents: [
            { type: 'license', url: '/documents/driver1-license.jpg', verified: true },
            { type: 'insurance', url: '/documents/driver1-insurance.jpg', verified: true },
            { type: 'registration', url: '/documents/driver1-registration.jpg', verified: true },
            { type: 'photo', url: '/documents/driver1-photo.jpg', verified: true }
          ]
        },
        notificationSettings: {
          pushNotifications: true,
          emailUpdates: true,
          smsAlerts: true
        },
        securitySettings: {
          twoFactorEnabled: true,
          biometricEnabled: false
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
