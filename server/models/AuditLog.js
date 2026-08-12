import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'Audit Log ID is required'],
      unique: true,
      trim: true,
    },
    timestamp: {
      type: String,
      default: 'Just now',
    },
    user: {
      type: String,
      required: [true, 'User/Officer field is required'],
      trim: true,
    },
    action: {
      type: String,
      required: [true, 'Action description is required'],
      trim: true,
    },
    target: {
      type: String,
      default: '',
      trim: true,
    },
    type: {
      type: String,
      enum: ['medical', 'security', 'system', 'transfer', 'intake'],
      default: 'system',
    },
    severity: {
      type: String,
      enum: ['emerald', 'amber', 'rose'],
      default: 'emerald',
    },
    details: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('AuditLog', auditLogSchema);
