import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Inmate from './models/Inmate.js';
import AuditLog from './models/AuditLog.js';
import User from './models/User.js';
import { INITIAL_INMATES, INITIAL_AUDIT_LOGS } from '../src/data/mockInmates.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crimenet';

async function seedDatabase() {
  try {
    console.log(`[CrimeNet Seed] Connecting to MongoDB at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);

    console.log('[CrimeNet Seed] Clearing existing Inmate, AuditLog, and User collections...');
    await Inmate.deleteMany({});
    await AuditLog.deleteMany({});
    await User.deleteMany({});

    console.log(`[CrimeNet Seed] Seeding ${INITIAL_INMATES.length} initial inmate records...`);
    await Inmate.insertMany(INITIAL_INMATES);

    console.log(`[CrimeNet Seed] Seeding ${INITIAL_AUDIT_LOGS.length} initial security audit entries...`);
    await AuditLog.insertMany(INITIAL_AUDIT_LOGS);

    // Seed Demo Users with bcrypt-hashed passwords (FOR LAB DEMONSTRATION ONLY)
    console.log('[CrimeNet Seed] Seeding demo staff user accounts...');
    const demoUsers = [
      {
        username: 'admin_vance',
        passwordHash: await bcrypt.hash('AdminPass123!', 10),
        role: 'Admin', // Full administrative rights: GET, POST, PUT, DELETE
      },
      {
        username: 'officer_blake',
        passwordHash: await bcrypt.hash('OfficerPass123!', 10),
        role: 'Officer', // Facility officer: GET, POST, PUT (No DELETE)
      },
      {
        username: 'warden_k',
        passwordHash: await bcrypt.hash('WardenPass123!', 10),
        role: 'Warden', // Facility warden: GET, POST audit logs (No inmate edits)
      },
    ];

    await User.insertMany(demoUsers);

    console.log('[CrimeNet Seed] ✅ Database successfully seeded with facility records & demo user accounts!');
    console.log('--- Demo Accounts Created ---');
    console.log('1. Admin: admin_vance / AdminPass123!');
    console.log('2. Officer: officer_blake / OfficerPass123!');
    console.log('3. Warden: warden_k / WardenPass123!');
    process.exit(0);
  } catch (error) {
    console.error('[CrimeNet Seed Error] Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
