import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const clearDatabase = async () => {
  try {
    console.log('🧹 Connecting to database...');

    await mongoose.connect(process.env.MONGODB_URI);

    console.log('🧹 Clearing all collections...');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    for (const collection of collections) {
      if (collection.name !== 'system.indexes') {
        await db.collection(collection.name).deleteMany({});
        console.log(`✅ Cleared ${collection.name}`);
      }
    }

    console.log('🎉 Database cleared successfully!');

  } catch (error) {
    console.error('❌ Error clearing database:', error);
  } finally {
    await mongoose.connection.close();
  }
};

clearDatabase();
