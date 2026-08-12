/**
 * Role-Based Authorization Middleware Factory: requireRole
 * Checks if the authenticated user's role (req.user.role) is in allowedRoles.
 * Must run AFTER verifyToken middleware.
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: User context missing. Authentication required before role check.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: `Forbidden: Access restricted to roles [${allowedRoles.join(', ')}]. Your role '${req.user.role}' lacks necessary permissions.`,
      });
    }

    next();
  };
};
