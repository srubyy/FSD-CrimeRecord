import express from 'express';
import AuditLog from '../models/AuditLog.js';
import { apiKeyAuth } from '../middleware/apiKeyAuth.js';
import { validateAuditLogCreate } from '../middleware/validators.js';

const router = express.Router();

/**
 * Audit Log API Routes
 * Note: PUT (update) and DELETE (destroy) routes are intentionally omitted.
 * Security audit feeds are append-only by system design to guarantee tamper-proof audit trails.
 */

// GET /api/auditlogs - Fetch all audit logs (newest first) (Public)
router.get('/', async (req, res, next) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
});

// POST /api/auditlogs - Append a new security audit event (Protected by API Key & Validation)
router.post('/', apiKeyAuth, validateAuditLogCreate, async (req, res, next) => {
  try {
    const newLog = new AuditLog(req.body);
    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: `Duplicate key error: Audit Log ID ${req.body.id} already exists.` });
    }
    next(error);
  }
});

export default router;
