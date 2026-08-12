import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { body } from 'express-validator';
import User from '../models/User.js';
import { handleValidationErrors } from '../middleware/validators.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new staff user (Open registration for lab demonstration)
 */
router.post(
  '/register',
  [
    body('username')
      .notEmpty()
      .withMessage('Username is required')
      .isString()
      .trim()
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters long'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('role')
      .optional()
      .isIn(['Admin', 'Officer', 'Warden'])
      .withMessage('Role must be one of: Admin, Officer, Warden'),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const { username, password, role } = req.body;

      const existingUser = await User.findOne({ username: username.toLowerCase().trim() });
      if (existingUser) {
        return res.status(400).json({
          status: 'fail',
          message: `Username '${username}' is already registered.`,
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = new User({
        username: username.toLowerCase().trim(),
        passwordHash,
        role: role || 'Officer',
      });

      const savedUser = await newUser.save();
      res.status(201).json({
        status: 'success',
        message: 'User successfully registered',
        user: savedUser,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/auth/login
 * Authenticate user credentials and return a signed 24h JWT token
 */
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required').trim(),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const JWT_SECRET = process.env.JWT_SECRET || 'crimenet_super_secret_jwt_key_2026';

      const user = await User.findOne({ username: username.toLowerCase().trim() });
      if (!user) {
        return res.status(401).json({
          status: 'fail',
          message: 'Invalid username or password',
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          status: 'fail',
          message: 'Invalid username or password',
        });
      }

      // Sign JWT token containing id, username, and role
      const token = jwt.sign(
        {
          id: user._id,
          username: user.username,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(200).json({
        status: 'success',
        message: 'Authentication successful',
        token,
        user,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
