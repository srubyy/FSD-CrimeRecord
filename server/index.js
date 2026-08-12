import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import inmatesRouter from './routes/inmates.js';
import auditLogsRouter from './routes/auditLogs.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Security Headers via Helmet
app.use(helmet());

// 2. Restrict CORS origins via ALLOWED_ORIGINS env var
const defaultAllowedOrigins = ['http://localhost:5173', 'https://fsd-crime-record.vercel.app'];
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : defaultAllowedOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy blocked access from origin: ${origin}`));
      }
    },
    credentials: true,
  })
);

// 3. Request Body Size Limit (10kb max payload protection)
app.use(express.json({ limit: '10kb' }));

// 4. NoSQL Injection Protection (sanitize req.body, req.query, req.params)
app.use(mongoSanitize());

// 5. Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'fail', message: 'Too many requests from this IP. Please try again after 15 minutes.' },
});

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'fail', message: 'Write request threshold exceeded. Please wait 15 minutes before creating or modifying records.' },
});

app.use('/api', generalLimiter);

app.use('/api', (req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    return writeLimiter(req, res, next);
  }
  next();
});

// 6. Serverless DB Connection Middleware (Enforces MONGO_URI presence without crashing function init)
let isConnected = false;
const connectDB = async (req, res, next) => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    return res.status(500).json({
      status: 'error',
      message: 'CRITICAL SECURITY ENFORCEMENT: MONGO_URI environment variable is missing. Hardcoded database credentials have been removed.',
    });
  }

  if (isConnected && mongoose.connection.readyState === 1) {
    return next();
  }

  try {
    const db = await mongoose.connect(MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
    next();
  } catch (error) {
    next(error);
  }
};

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
  res.status(404).json({ status: 'fail', message: `Route ${req.originalUrl} not found on CrimeNet API Server` });
});

// 7. Centralized Error Handling Middleware
app.use(errorHandler);

// Standalone listener for local dev server
if (!process.env.VERCEL) {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error('[CRITICAL SECURITY ERROR] MONGO_URI is missing from environment.');
    process.exit(1);
  }
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log(`[CrimeNet DB] Connected to MongoDB`);
      app.listen(PORT, () => {
        console.log(`[CrimeNet Server] API Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('[CrimeNet DB Error] Database connection failed:', err.message);
    });
}

export default app;
