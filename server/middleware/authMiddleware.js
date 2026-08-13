import jwt from 'jsonwebtoken';

/**
 * JWT Authentication Middleware: verifyToken
 * Reads the Authorization: Bearer <token> header, verifies the JWT signature,
 * and attaches the decoded payload (id, username, role) to req.user.
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized: Missing or malformed Authorization header. Expected Bearer token.',
    });
  }

  const token = authHeader.split(' ')[1];
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    return res.status(500).json({
      status: 'error',
      message: 'CRITICAL SECURITY ENFORCEMENT: JWT_SECRET environment variable is missing.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized: Invalid or expired token',
      error: error.message,
    });
  }
};
