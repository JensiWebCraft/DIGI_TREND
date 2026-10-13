import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB, getStatus, getMemoryStore } from './config/db.js';
import clientRoutes from './routes/clientRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import Task from './models/Task.js';
import Client from './models/Client.js';
import ContentPost from './models/ContentPost.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

import { sampleUsers, sampleClients, sampleTasks, sampleContentPosts } from './seed/seedData.js';

// Initialize in-memory store with real agency operational data if empty
const store = getMemoryStore();
if (store.clients.length === 0) {
  store.users = [...sampleUsers];
  store.clients = [...sampleClients];
  store.tasks = sampleTasks.map(t => ({
    ...t,
    id: t._id,
    taskTitle: t.taskTitle,
    title: t.taskTitle,
    client: t.clientName,
    clientName: t.clientName,
    service: t.service,
    category: t.service,
    assignedTo: t.assignedEmployeeName,
    assignedEmployeeName: t.assignedEmployeeName,
    dueDate: t.dueDate,
    deadline: t.dueDate,
    status: t.status,
    priority: t.priority,
    description: t.description
  }));
  store.contentPosts = [...sampleContentPosts];
  store.aiGenerations = [];
}

// Mount API Routes
app.use('/api/clients', clientRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/ai', aiRoutes);

// Dashboard Stats Endpoint (Dynamic based on real data only)
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const isMongo = getStatus();
    let totalClients = 0;
    let activeTasks = 0;
    let pendingCreatives = 0;
    let completedTasks = 0;
    let upcomingPosts = 0;
    let monthlyRevenue = 0;
    let taskList = [];

    if (isMongo) {
      totalClients = await Client.countDocuments();
      activeTasks = await Task.countDocuments({ status: { $in: ['In Progress', 'Review'] } });
      pendingCreatives = await Task.countDocuments({ status: { $in: ['To Do', 'In Progress'] } });
      completedTasks = await Task.countDocuments({ status: 'Completed' });
      upcomingPosts = await ContentPost.countDocuments({ status: { $in: ['Scheduled', 'Design Pending', 'Review Required'] } });
      
      const clients = await Client.find();
      monthlyRevenue = clients.reduce((acc, c) => acc + (c.monthlyRetainer || 0), 0);
      taskList = await Task.find();
    } else {
      totalClients = store.clients.length;
      activeTasks = store.tasks.filter(t => t.status === 'In Progress' || t.status === 'Review').length;
      pendingCreatives = store.tasks.filter(t => t.status === 'To Do' || t.status === 'In Progress').length;
      completedTasks = store.tasks.filter(t => t.status === 'Completed').length;
      upcomingPosts = store.contentPosts.filter(p => p.status !== 'Published').length;
      monthlyRevenue = store.clients.reduce((acc, c) => acc + (c.monthlyRetainer || 0), 0);
      taskList = store.tasks;
    }

    const revenueTrend = [
      { month: 'Jun', revenue: 0, projects: 0 },
      { month: 'Jul', revenue: 0, projects: 0 },
      { month: 'Aug', revenue: 0, projects: 0 },
      { month: 'Sep', revenue: 0, projects: 0 },
      { month: 'Oct', revenue: monthlyRevenue, projects: activeTasks }
    ];

    const taskDistribution = [
      { name: 'To Do', count: taskList.filter(t => t.status === 'To Do').length, color: '#f59e0b' },
      { name: 'In Progress', count: taskList.filter(t => t.status === 'In Progress').length, color: '#3b82f6' },
      { name: 'Review', count: taskList.filter(t => t.status === 'Review').length, color: '#8b5cf6' },
      { name: 'Completed', count: taskList.filter(t => t.status === 'Completed').length, color: '#10b981' }
    ];

    return res.status(200).json({
      success: true,
      data: {
        kpis: {
          totalClients,
          activeProjects: activeTasks,
          pendingCreatives,
          completedTasks,
          upcomingPosts,
          monthlyRevenue
        },
        charts: {
          revenueTrend,
          taskDistribution
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    appName: 'DiGi Trend Creative Operations Platform API',
    database: getStatus() ? 'MongoDB Connected' : 'Local In-Memory Mode',
    timestamp: new Date()
  });
});

// Start Server
connectDB().finally(() => {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 DiGi Trend Creative Operations API Running on Port ${PORT}`);
  });
});
