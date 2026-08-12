import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import inmatesRouter from './routes/inmates.js';
import auditLogsRouter from './routes/auditLogs.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crimenet';

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Serverless DB Connection Middleware (Ensures DB connection is established before route handlers execute)
let isConnected = false;
const connectDB = async (req, res, next) => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return next();
  }
  try {
    const db = await mongoose.connect(MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log('[CrimeNet DB] Serverless MongoDB connected');
    next();
  } catch (error) {
    console.error('[CrimeNet DB Error]', error.message);
    return res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
};

// Ensure DB is connected for all API requests
app.use('/api', connectDB);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ONLINE', system: 'CrimeNet OS API Server', timestamp: new Date().toISOString() });
});

// Mount API Routers
app.use('/api/inmates', inmatesRouter);
app.use('/api/auditlogs', auditLogsRouter);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found on CrimeNet API Server` });
});

// Standalone listener for local dev server
if (!process.env.VERCEL) {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log(`[CrimeNet DB] Connected to MongoDB at ${MONGO_URI}`);
      app.listen(PORT, () => {
        console.log(`[CrimeNet Server] API Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('[CrimeNet DB Error] Database connection failed:', err.message);
    });
}

export default app;
