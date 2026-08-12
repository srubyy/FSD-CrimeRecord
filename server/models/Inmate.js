import mongoose from 'mongoose';

const inmateSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'Inmate ID is required'],
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    alias: {
      type: String,
      default: '',
      trim: true,
    },
    age: {
      type: Number,
    },
    cellBlock: {
      type: String,
      trim: true,
    },
    securityTier: {
      type: String,
      enum: ['Minimum', 'Medium', 'Maximum', 'Isolation'],
      required: [true, 'Security tier is required'],
    },
    crimeCategory: {
      type: String,
      trim: true,
    },
    medicalAlert: {
      type: String,
      default: 'None / Cleared',
    },
    medicalAlertSeverity: {
      type: String,
      enum: ['emerald', 'amber', 'rose'],
      default: 'emerald',
    },
    status: {
      type: String,
      enum: ['Active', 'Transferred', 'Released'],
      default: 'Active',
    },
    cellNumber: {
      type: String,
      trim: true,
    },
    admissionDate: {
      type: String,
    },
    sentenceLength: {
      type: String,
    },
    paroleEligible: {
      type: String,
    },
    dangerRating: {
      type: Number,
      default: 5.0,
    },
    notes: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Inmate', inmateSchema);
