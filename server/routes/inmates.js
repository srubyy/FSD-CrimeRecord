import express from 'express';
import Inmate from '../models/Inmate.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { validateInmateCreate, validateInmateUpdate } from '../middleware/validators.js';
import { getIO } from '../socket.js';

const router = express.Router();

// Helper to escape special regex characters for ReDoS and pattern injection protection
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// GET /api/inmates - Fetch all inmates with optional securityTier and search filter (Public)
router.get('/', async (req, res, next) => {
  try {
    const { securityTier, search } = req.query;
    const filter = {};

    if (securityTier && securityTier !== 'ALL') {
      filter.securityTier = securityTier;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const sanitizedSearch = escapeRegex(search.trim());
      const searchRegex = new RegExp(sanitizedSearch, 'i');
      filter.$or = [
        { fullName: searchRegex },
        { id: searchRegex },
        { crimeCategory: searchRegex },
        { cellBlock: searchRegex },
      ];
    }

    const inmates = await Inmate.find(filter).sort({ createdAt: -1 });
    res.status(200).json(inmates);
  } catch (error) {
    next(error);
  }
});

// GET /api/inmates/:id - Fetch single inmate by business ID (Public)
router.get('/:id', async (req, res, next) => {
  try {
    const inmate = await Inmate.findOne({ id: req.params.id });
    if (!inmate) {
      return res.status(404).json({ message: `Inmate with ID ${req.params.id} not found` });
    }
    res.status(200).json(inmate);
  } catch (error) {
    next(error);
  }
});

// POST /api/inmates - Intake new inmate (Protected: Admin, Officer)
router.post(
  '/',
  verifyToken,
  requireRole('Admin', 'Officer'),
  validateInmateCreate,
  async (req, res, next) => {
    try {
      const newInmate = new Inmate(req.body);
      const savedInmate = await newInmate.save();

      // Real-Time Socket Broadcast
      getIO().emit('inmate:created', savedInmate);

      res.status(201).json(savedInmate);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: `Duplicate key error: Inmate ID ${req.body.id} already exists.` });
      }
      next(error);
    }
  }
);

// PUT /api/inmates/:id - Update inmate record (Protected: Admin, Officer)
router.put(
  '/:id',
  verifyToken,
  requireRole('Admin', 'Officer'),
  validateInmateUpdate,
  async (req, res, next) => {
    try {
      const updatedInmate = await Inmate.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedInmate) {
        return res.status(404).json({ message: `Inmate with ID ${req.params.id} not found` });
      }

      // Real-Time Socket Broadcast
      getIO().emit('inmate:updated', updatedInmate);

      res.status(200).json(updatedInmate);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/inmates/:id - Delete inmate record (Protected: Admin ONLY)
router.delete(
  '/:id',
  verifyToken,
  requireRole('Admin'),
  async (req, res, next) => {
    try {
      const deletedInmate = await Inmate.findOneAndDelete({ id: req.params.id });
      if (!deletedInmate) {
        return res.status(404).json({ message: `Inmate with ID ${req.params.id} not found` });
      }

      // Real-Time Socket Broadcast
      getIO().emit('inmate:deleted', req.params.id);

      res.status(200).json({ message: `Inmate record ${req.params.id} successfully deleted`, inmate: deletedInmate });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
