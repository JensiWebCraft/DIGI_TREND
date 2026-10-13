import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    industry: { type: String, required: true },
    contactPerson: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Onboarding', 'Paused'], default: 'Active' },
    monthlyRetainer: { type: Number, default: 0 },
    brandColors: [{ type: String }],
    logo: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Client || mongoose.model('Client', clientSchema);
