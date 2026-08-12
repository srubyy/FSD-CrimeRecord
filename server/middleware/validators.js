import { body, validationResult } from 'express-validator';

/**
 * Middleware to handle express-validator result and return 400 error
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors: errors.array().map(err => ({ field: err.path, message: err.msg })),
    });
  }
  next();
};

/**
 * Validation rules for Inmate POST (Creation)
 */
export const validateInmateCreate = [
  body('id')
    .notEmpty()
    .withMessage('Inmate ID is required')
    .isString()
    .withMessage('Inmate ID must be a string')
    .trim(),
  body('fullName')
    .notEmpty()
    .withMessage('Full name is required')
    .isString()
    .withMessage('Full name must be a string')
    .trim(),
  body('securityTier')
    .notEmpty()
    .withMessage('Security tier is required')
    .isIn(['Minimum', 'Medium', 'Maximum', 'Isolation'])
    .withMessage('Security tier must be one of: Minimum, Medium, Maximum, Isolation'),
  body('age')
    .optional()
    .isNumeric()
    .withMessage('Age must be a number'),
  body('dangerRating')
    .optional()
    .isNumeric()
    .withMessage('Danger rating must be a number'),
  body('medicalAlertSeverity')
    .optional()
    .isIn(['emerald', 'amber', 'rose'])
    .withMessage('Medical alert severity must be one of: emerald, amber, rose'),
  body('status')
    .optional()
    .isIn(['Active', 'Transferred', 'Released'])
    .withMessage('Status must be one of: Active, Transferred, Released'),
  handleValidationErrors,
];

/**
 * Validation rules for Inmate PUT (Update)
 */
export const validateInmateUpdate = [
  body('fullName')
    .optional()
    .isString()
    .withMessage('Full name must be a string')
    .trim(),
  body('securityTier')
    .optional()
    .isIn(['Minimum', 'Medium', 'Maximum', 'Isolation'])
    .withMessage('Security tier must be one of: Minimum, Medium, Maximum, Isolation'),
  body('age')
    .optional()
    .isNumeric()
    .withMessage('Age must be a number'),
  body('dangerRating')
    .optional()
    .isNumeric()
    .withMessage('Danger rating must be a number'),
  body('medicalAlertSeverity')
    .optional()
    .isIn(['emerald', 'amber', 'rose'])
    .withMessage('Medical alert severity must be one of: emerald, amber, rose'),
  body('status')
    .optional()
    .isIn(['Active', 'Transferred', 'Released'])
    .withMessage('Status must be one of: Active, Transferred, Released'),
  handleValidationErrors,
];

/**
 * Validation rules for Audit Log POST (Creation)
 */
export const validateAuditLogCreate = [
  body('id')
    .notEmpty()
    .withMessage('Audit log ID is required')
    .isString()
    .withMessage('Audit log ID must be a string')
    .trim(),
  body('action')
    .notEmpty()
    .withMessage('Action description is required')
    .isString()
    .withMessage('Action must be a string')
    .trim(),
  body('target')
    .notEmpty()
    .withMessage('Target is required')
    .isString()
    .withMessage('Target must be a string')
    .trim(),
  body('type')
    .notEmpty()
    .withMessage('Audit log type is required')
    .isIn(['medical', 'security', 'system', 'transfer', 'intake'])
    .withMessage('Type must be one of: medical, security, system, transfer, intake'),
  body('severity')
    .notEmpty()
    .withMessage('Severity is required')
    .isIn(['emerald', 'amber', 'rose'])
    .withMessage('Severity must be one of: emerald, amber, rose'),
  handleValidationErrors,
];
