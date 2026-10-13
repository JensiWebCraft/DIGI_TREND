import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Client from '../models/Client.js';
import Task from '../models/Task.js';
import ContentPost from '../models/ContentPost.js';
import AIGeneration from '../models/AIGeneration.js';
import { sampleUsers, sampleClients, sampleTasks, sampleContentPosts, sampleAIGenerations } from './seedData.js';

const seedDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/digitrend_ops';
  try {
    await mongoose.connect(mongoURI);
    console.log('[Seed] Connected to MongoDB for seeding...');

    // Clear existing
    await User.deleteMany({});
    await Client.deleteMany({});
    await Task.deleteMany({});
    await ContentPost.deleteMany({});
    await AIGeneration.deleteMany({});
    console.log('[Seed] Cleared old collections.');

    // Insert Users
    const cleanUsers = sampleUsers.map(({ _id, ...rest }) => rest);
    const createdUsers = await User.insertMany(cleanUsers);
    console.log(`[Seed] Inserted ${createdUsers.length} users.`);

    // Insert Clients
    const cleanClients = sampleClients.map(({ _id, ...rest }) => rest);
    const createdClients = await Client.insertMany(cleanClients);
    console.log(`[Seed] Inserted ${createdClients.length} clients.`);

    // Map IDs to Tasks
    const createdTasks = await Task.insertMany(
      sampleTasks.map((t, idx) => {
        const client = createdClients[idx % createdClients.length];
        const user = createdUsers[idx % createdUsers.length];
        return {
          taskTitle: t.taskTitle,
          client: client._id,
          clientName: client.name,
          service: t.service,
          platform: t.platform,
          assignedEmployee: user._id,
          assignedEmployeeName: `${user.name} (${user.role})`,
          priority: t.priority,
          status: t.status,
          startDate: t.startDate,
          dueDate: t.dueDate,
          description: t.description,
          referenceLink: t.referenceLink
        };
      })
    );
    console.log(`[Seed] Inserted ${createdTasks.length} tasks.`);

    // Map IDs to Content Posts
    const createdPosts = await ContentPost.insertMany(
      sampleContentPosts.map((p, idx) => {
        const client = createdClients[idx % createdClients.length];
        return {
          client: client._id,
          clientName: client.name,
          platform: p.platform,
          postType: p.postType,
          campaign: p.campaign,
          publishDate: p.publishDate,
          status: p.status,
          caption: p.caption,
          visualConcept: p.visualConcept,
          hashtags: p.hashtags
        };
      })
    );
    console.log(`[Seed] Inserted ${createdPosts.length} content posts.`);

    // Insert AI Generations
    const createdAI = await AIGeneration.insertMany(
      sampleAIGenerations.map(({ _id, ...rest }) => rest)
    );
    console.log(`[Seed] Inserted ${createdAI.length} AI generation records.`);

    console.log('[Seed] Database successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDB();
