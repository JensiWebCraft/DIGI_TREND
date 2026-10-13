import mongoose from 'mongoose';

const contentPostSchema = new mongoose.Schema(
  {
    client: { 
      type: mongoose.Schema.Types.Mixed, 
      required: true 
    },
    clientName: { type: String }, // cached for query/in-memory mode
    platform: { 
      type: String, 
      enum: ['Instagram', 'Facebook', 'LinkedIn', 'YouTube', 'Twitter/X'], 
      required: true 
    },
    postType: { 
      type: String, 
      default: 'Festival Creative' 
    },
    campaign: { 
      type: String, 
      default: 'General' 
    },
    publishDate: { 
      type: Date, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['Draft', 'Design Pending', 'Review Required', 'Approved', 'Scheduled', 'Published'], 
      default: 'Design Pending' 
    },
    caption: { type: String, default: '' },
    visualConcept: { type: String, default: '' },
    hashtags: [{ type: String }],
    referenceMediaUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.ContentPost || mongoose.model('ContentPost', contentPostSchema);
