import express from 'express';
import Inmate from '../models/Inmate.js';

const router = express.Router();

// GET /api/inmates - Fetch all inmates with optional securityTier and search filter
router.get('/', async (req, res) => {
  try {
    const { securityTier, search } = req.query;
    const filter = {};

    // Filter by Security Tier dropdown if specified and not 'ALL'
    if (securityTier && securityTier !== 'ALL') {
      filter.securityTier = securityTier;
    }

    // Filter by search string across fullName, id, crimeCategory, and cellBlock
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
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
    res.status(500).json({ message: 'Failed to retrieve inmate records', error: error.message });
  }
});

// GET /api/inmates/:id - Fetch single inmate by business ID (e.g., CN-8092)
router.get('/:id', async (req, res) => {
  try {
    const inmate = await Inmate.findOne({ id: req.params.id });
    if (!inmate) {
      return res.status(404).json({ message: `Inmate with ID ${req.params.id} not found` });
    }
    res.status(200).json(inmate);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving inmate record', error: error.message });
  }
});

// POST /api/inmates - Intake new inmate record
router.post('/', async (req, res) => {
  try {
    const newInmate = new Inmate(req.body);
    const savedInmate = await newInmate.save();
    res.status(201).json(savedInmate);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: `Duplicate key error: Inmate ID ${req.body.id} already exists.` });
    }
    res.status(400).json({ message: 'Validation error creating inmate record', error: error.message });
  }
});

// PUT /api/inmates/:id - Update inmate record by business ID
router.put('/:id', async (req, res) => {
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
    res.status(400).json({ message: 'Failed to update inmate record', error: error.message });
  }
});

// DELETE /api/inmates/:id - Delete inmate record by business ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedInmate = await Inmate.findOneAndDelete({ id: req.params.id });
    if (!deletedInmate) {
      return res.status(404).json({ message: `Inmate with ID ${req.params.id} not found` });
    }
    res.status(200).json({ message: `Inmate record ${req.params.id} successfully deleted`, inmate: deletedInmate });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete inmate record', error: error.message });
  }
});

export default router;
