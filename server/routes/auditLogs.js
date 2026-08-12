import express from 'express';
import AuditLog from '../models/AuditLog.js';

const router = express.Router();

/**
 * Audit Log API Routes
 * Note: PUT (update) and DELETE (destroy) routes are intentionally omitted.
 * Security audit feeds are append-only by system design to guarantee tamper-proof audit trails.
 */

// GET /api/auditlogs - Fetch all audit logs (newest first)
router.get('/', async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve audit log stream', error: error.message });
  }
});

// POST /api/auditlogs - Append a new security audit event
router.post('/', async (req, res) => {
  try {
    const newLog = new AuditLog(req.body);
    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: `Duplicate key error: Audit Log ID ${req.body.id} already exists.` });
    }
    res.status(400).json({ message: 'Validation error logging security event', error: error.message });
  }
});

export default router;
