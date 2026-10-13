import mongoose from 'mongoose';

const aiGenerationSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true },
    client: { type: String, default: 'General Brand' },
    platform: { type: String, default: 'Instagram' },
    generatedResult: {
      headline: { type: String, required: true },
      visualConcept: { type: String, required: true },
      caption: { type: String, required: true },
      hashtags: [{ type: String }],
      cta: { type: String, default: '' },
      alternateIdea: { type: String, default: '' }
    },
    createdBy: { type: String, default: 'Creative Team' },
    user: { type: mongoose.Schema.Types.Mixed, ref: 'User' },
    clientId: { type: mongoose.Schema.Types.Mixed, ref: 'Client' },
  },
  { timestamps: { createdAt: 'generatedAt', updatedAt: 'updatedAt' } }
);

export default mongoose.models.AIGeneration || mongoose.model('AIGeneration', aiGenerationSchema);
