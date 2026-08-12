/**
 * Centralized Express Error Handling Middleware
 * Catches all errors passed to next(err).
 * Logs server-side error trace and returns client error responses.
 */
export const errorHandler = (err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  // Log full error trace server-side for diagnostics
  console.error(`[Server Error] ${req.method} ${req.originalUrl}:`, err);

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(isProduction ? {} : { stack: err.stack }),
  });
};
