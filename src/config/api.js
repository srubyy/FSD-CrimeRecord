/**
 * Centralized API Base URL Configuration
 * Uses VITE_API_URL environment variable in production (pointing to Render backend),
 * and falls back to local dev server (http://localhost:5001) in development.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
