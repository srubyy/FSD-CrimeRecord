import http from 'http';
import mongoose from 'mongoose';
import newman from 'newman';
import bcrypt from 'bcryptjs';
import { MongoMemoryServer } from 'mongodb-memory-server';

// 1. Initialize Ephemeral MongoDB Instance BEFORE importing app/models
const mongoServer = await MongoMemoryServer.create();
const mongoUri = mongoServer.getUri();

process.env.MONGO_URI = mongoUri;
process.env.JWT_SECRET = 'ci_test_jwt_secret_2026';
process.env.PORT = '5001';

// Dynamic import of app, socket, and models AFTER setting MONGO_URI
const { default: app } = await import('./index.js');
const { initSocket } = await import('./socket.js');
const { default: User } = await import('./models/User.js');
const { default: Inmate } = await import('./models/Inmate.js');
const { default: AuditLog } = await import('./models/AuditLog.js');
const { INITIAL_INMATES, INITIAL_AUDIT_LOGS } = await import('../src/data/mockInmates.js');

async function runCITestSuite() {
  console.log('----------------------------------------------------');
  console.log('🚀 [CI Quality Gate] Initializing Ephemeral In-Memory MongoDB');
  console.log('----------------------------------------------------');
  console.log(`[CI DB] Ephemeral MongoDB Memory Instance Running at ${mongoUri}`);

  // Seed Initial Demo Users into In-Memory Database
  const passwordHash = await bcrypt.hash('AdminPass123!', 10);
  const officerHash = await bcrypt.hash('OfficerPass123!', 10);
  const wardenHash = await bcrypt.hash('WardenPass123!', 10);

  await User.deleteMany({});
  await User.insertMany([
    { username: 'admin_vance', passwordHash, role: 'Admin' },
    { username: 'officer_blake', passwordHash: officerHash, role: 'Officer' },
    { username: 'warden_k', passwordHash: wardenHash, role: 'Warden' },
  ]);

  // Seed Initial Inmates & Audit Logs
  await Inmate.deleteMany({});
  await Inmate.insertMany(INITIAL_INMATES);

  await AuditLog.deleteMany({});
  await AuditLog.insertMany(INITIAL_AUDIT_LOGS);

  console.log('[CI DB] Ephemeral Database successfully seeded with demo users, inmates, and audit logs.');

  console.log('----------------------------------------------------');
  console.log('🧪 [CI Quality Gate] Executing Postman Newman Automated API Test Suite');
  console.log('----------------------------------------------------');

  newman.run(
    {
      collection: './postman/CrimeNet-API.postman_collection.json',
      environment: './postman/CrimeNet-Local.postman_environment.json',
      envVar: [{ key: 'base_url', value: 'http://localhost:5001' }],
      reporters: 'cli',
    },
    async (err, summary) => {
      console.log('----------------------------------------------------');
      console.log('📊 [CI Quality Gate] Test Suite Execution Summary');
      console.log('----------------------------------------------------');

      let failedCount = 0;
      if (err) {
        console.error('❌ [CI Fatal Error] Newman runner encountered execution error:', err);
        failedCount = 1;
      } else if (summary.run.failures && summary.run.failures.length > 0) {
        console.error(`❌ [CI Gate Failed] ${summary.run.failures.length} test assertion(s) failed.`);
        failedCount = summary.run.failures.length;
      } else {
        console.log('✅ [CI Gate Passed] 100% of Postman requests and assertions passed successfully against in-memory MongoDB!');
      }

      // Cleanup & Shutdown
      await mongoose.disconnect();
      await mongoServer.stop();
      console.log('[CI Cleanup] Ephemeral database and server shut down cleanly.');

      if (failedCount > 0) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    }
  );
}

runCITestSuite().catch((err) => {
  console.error('❌ [CI Execution Error]', err);
  process.exit(1);
});
