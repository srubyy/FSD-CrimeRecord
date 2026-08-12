import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Inmate from './models/Inmate.js';
import AuditLog from './models/AuditLog.js';
import { INITIAL_INMATES, INITIAL_AUDIT_LOGS } from '../src/data/mockInmates.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crimenet';

async function seedDatabase() {
  try {
    console.log(`[CrimeNet Seed] Connecting to MongoDB at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);

    console.log('[CrimeNet Seed] Clearing existing Inmate and AuditLog collections...');
    await Inmate.deleteMany({});
    await AuditLog.deleteMany({});

    console.log(`[CrimeNet Seed] Seeding ${INITIAL_INMATES.length} initial inmate records...`);
    await Inmate.insertMany(INITIAL_INMATES);

    console.log(`[CrimeNet Seed] Seeding ${INITIAL_AUDIT_LOGS.length} initial security audit entries...`);
    await AuditLog.insertMany(INITIAL_AUDIT_LOGS);

    console.log('[CrimeNet Seed] ✅ Database successfully seeded with initial facility records!');
    process.exit(0);
  } catch (error) {
    console.error('[CrimeNet Seed Error] Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
