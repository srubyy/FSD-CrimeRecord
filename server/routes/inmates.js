import express from 'express';
import Inmate from '../models/Inmate.js';
import { apiKeyAuth } from '../middleware/apiKeyAuth.js';
import { validateInmateCreate, validateInmateUpdate } from '../middleware/validators.js';

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

    // Filter by Security Tier dropdown if specified and not 'ALL'
    if (securityTier && securityTier !== 'ALL') {
      filter.securityTier = securityTier;
    }

    // Escape regex input before constructing RegExp to prevent ReDoS attacks
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

// GET /api/inmates/:id - Fetch single inmate by business ID (e.g., CN-8092) (Public)
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

// POST /api/inmates - Intake new inmate record (Protected by API Key & Validation)
router.post('/', apiKeyAuth, validateInmateCreate, async (req, res, next) => {
  try {
    const newInmate = new Inmate(req.body);
    const savedInmate = await newInmate.save();
    res.status(201).json(savedInmate);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: `Duplicate key error: Inmate ID ${req.body.id} already exists.` });
    }
    next(error);
  }
});

// PUT /api/inmates/:id - Update inmate record by business ID (Protected by API Key & Validation)
router.put('/:id', apiKeyAuth, validateInmateUpdate, async (req, res, next) => {
  try {
    const updatedInmate = await Inmate.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedInmate) {
      return res.status(404).json({ message: `Inmate with ID ${req.params.id} not found` });
    }
    res.status(200).json(updatedInmate);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/inmates/:id - Delete inmate record by business ID (Protected by API Key)
router.delete('/:id', apiKeyAuth, async (req, res, next) => {
  try {
    const deletedInmate = await Inmate.findOneAndDelete({ id: req.params.id });
    if (!deletedInmate) {
      return res.status(404).json({ message: `Inmate with ID ${req.params.id} not found` });
    }
    res.status(200).json({ message: `Inmate record ${req.params.id} successfully deleted`, inmate: deletedInmate });
  } catch (error) {
    next(error);
  }
});

export default router;
