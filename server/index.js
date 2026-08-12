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

// CRITICAL SECURITY ENFORCEMENT: No hardcoded MONGO_URI fallback allowed
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('\n================================================================');
  console.error('[CRITICAL SECURITY FAILURE] MONGO_URI environment variable is missing.');
  console.error('Hardcoded database credentials have been completely removed.');
  console.error('The server refuses to start without an explicit MONGO_URI environment variable.');
  console.error('================================================================\n');
  if (process.env.VERCEL) {
    throw new Error('CRITICAL: MONGO_URI environment variable is not configured on Vercel.');
  } else {
    process.exit(1);
  }
}

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
      // Allow requests with no origin (like mobile apps or curl) or if origin is in allowedOrigins
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
// General API Rate Limiter (100 requests per 15 minutes per IP)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'fail', message: 'Too many requests from this IP. Please try again after 15 minutes.' },
});

// Stricter Write Rate Limiter for POST/PUT/DELETE (20 requests per 15 minutes per IP)
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'fail', message: 'Write request threshold exceeded. Please wait 15 minutes before creating or modifying records.' },
});

// Apply general limiter to all /api routes
app.use('/api', generalLimiter);

// Apply write limiter to POST/PUT/DELETE methods under /api
app.use('/api', (req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    return writeLimiter(req, res, next);
  }
  next();
});

// 6. Serverless DB Connection Middleware
let isConnected = false;
const connectDB = async (req, res, next) => {
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

// 7. Centralized Error Handling Middleware (must be registered last)
app.use(errorHandler);

// Standalone listener for local dev server
if (!process.env.VERCEL) {
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
