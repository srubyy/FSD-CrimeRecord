import express from 'express';
import AuditLog from '../models/AuditLog.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { validateAuditLogCreate } from '../middleware/validators.js';

const router = express.Router();

/**
 * Audit Log API Routes
 * Note: PUT (update) and DELETE (destroy) routes are intentionally omitted.
 * Security audit feeds are append-only by system design to guarantee tamper-proof audit trails.
 */

// GET /api/auditlogs - Fetch all audit logs (Public)
router.get('/', async (req, res, next) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
});

// POST /api/auditlogs - Append security audit event (Protected: Admin, Officer, Warden)
router.post(
  '/',
  verifyToken,
  requireRole('Admin', 'Officer', 'Warden'),
  validateAuditLogCreate,
  async (req, res, next) => {
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
  }
);

export default router;
