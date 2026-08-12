/**
 * Lightweight API Key Authentication Middleware
 * Validates the presence and validity of the x-api-key request header
 * for protected write endpoints (POST, PUT, DELETE).
 */
export const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.API_KEY;

  if (!validApiKey) {
    console.warn('[Security Warning] API_KEY environment variable is not configured on the server.');
  }

  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized: Invalid or missing API key in x-api-key header',
    });
  }

  next();
};
