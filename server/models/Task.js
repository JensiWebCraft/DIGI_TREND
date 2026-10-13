import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    taskTitle: { type: String, required: true },
    client: { 
      type: mongoose.Schema.Types.Mixed, 
      required: true 
    },
    clientName: { type: String }, // cached for fast query/in-memory mode
    service: { 
      type: String, 
      default: 'Social Media'
    },
    platform: { type: String, default: 'Cross-Platform' },
    assignedEmployee: { 
      type: mongoose.Schema.Types.Mixed 
    },
    assignedEmployeeName: { type: String, default: 'Unassigned' },
    priority: { 
      type: String, 
      enum: ['Low', 'Medium', 'High', 'Urgent'], 
      default: 'Medium' 
    },
    status: { 
      type: String, 
      enum: ['To Do', 'In Progress', 'Review', 'Completed'], 
      default: 'To Do' 
    },
    startDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    description: { type: String, default: '' },
    referenceLink: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model('Task', taskSchema);
