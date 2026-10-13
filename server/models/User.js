import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { 
      type: String, 
      enum: [
        'Agency Owner / Manager',
        'Creative Team Member',
        'Developer',
        'Marketing Team Member',
        'Agency Owner', 
        'Creative Lead', 
        'Marketing Strategist', 
        'Graphic Designer', 
        'Video Editor'
      ],
      default: 'Agency Owner / Manager' 
    },
    avatar: { type: String, default: '' },
    department: { type: String, default: 'Creative & Operations' },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
