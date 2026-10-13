import mongoose from 'mongoose';
import ContentPost from '../models/ContentPost.js';
import Client from '../models/Client.js';
import { getStatus, getMemoryStore } from '../config/db.js';

export const getContentPosts = async (req, res) => {
  try {
    const { client, platform, status, date } = req.query;

    if (getStatus()) {
      let query = {};
      if (client && client !== 'All') query.client = client;
      if (platform && platform !== 'All') query.platform = platform;
      if (status && status !== 'All') query.status = status;
      if (date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        query.publishDate = { $gte: start, $lte: end };
      }

      const posts = await ContentPost.find(query).sort({ publishDate: 1 });
      return res.status(200).json({ success: true, count: posts.length, data: posts });
    } else {
      const store = getMemoryStore();
      let filtered = [...store.contentPosts];

      if (client && client !== 'All') {
        filtered = filtered.filter(p => String(p.client) === String(client) || p.clientName === client);
      }
      if (platform && platform !== 'All') {
        filtered = filtered.filter(p => p.platform === platform);
      }
      if (status && status !== 'All') {
        filtered = filtered.filter(p => p.status === status);
      }
      if (date) {
        const target = new Date(date).toISOString().split('T')[0];
        filtered = filtered.filter(p => new Date(p.publishDate).toISOString().split('T')[0] === target);
      }

      return res.status(200).json({ success: true, count: filtered.length, data: filtered });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createContentPost = async (req, res) => {
  try {
    const platform = req.body.platform || req.body.channel || 'Instagram';
    const publishDate = req.body.publishDate || req.body.scheduledDate || new Date(Date.now() + 86400000);
    const client = req.body.client || 'General Client';
    const clientName = req.body.clientName || (typeof client === 'string' ? client : 'General Client');
    const campaign = req.body.campaign || req.body.title || 'New Creative Post';
    const postType = req.body.postType || 'Festival Creative';
    const status = req.body.status || 'Design Pending';
    const caption = req.body.caption || '';
    const visualConcept = req.body.visualConcept || '';
    const hashtags = Array.isArray(req.body.hashtags) 
      ? req.body.hashtags 
      : (req.body.hashtags ? req.body.hashtags.split(',').map(s => s.trim()) : []);

    if (getStatus()) {
      try {
        const post = await ContentPost.create({
          client,
          clientName,
          platform,
          postType,
          campaign,
          publishDate,
          status,
          caption,
          visualConcept,
          hashtags
        });
        return res.status(201).json({ success: true, data: post });
      } catch (err) {
        // Fallback to memory store if Mongo error
      }
    }

    const store = getMemoryStore();
    const newPost = {
      _id: 'post_' + Date.now(),
      id: 'post_' + Date.now(),
      client,
      clientName,
      platform,
      postType,
      campaign,
      publishDate: new Date(publishDate),
      status,
      caption,
      visualConcept,
      hashtags,
      createdAt: new Date()
    };
    store.contentPosts.unshift(newPost);
    return res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateContentPost = async (req, res) => {
  try {
    const { id } = req.params;

    if (getStatus() && mongoose.Types.ObjectId.isValid(id)) {
      try {
        const post = await ContentPost.findByIdAndUpdate(id, req.body, { new: true });
        if (post) {
          return res.status(200).json({ success: true, data: post });
        }
      } catch (err) {
        // Fall through to memory store
      }
    }

    const store = getMemoryStore();
    const index = store.contentPosts.findIndex(p => String(p._id) === String(id) || String(p.id) === String(id));
    if (index !== -1) {
      store.contentPosts[index] = { ...store.contentPosts[index], ...req.body, updatedAt: new Date() };
      return res.status(200).json({ success: true, data: store.contentPosts[index] });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Post updated', 
      data: { _id: id, ...req.body, updatedAt: new Date() } 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteContentPost = async (req, res) => {
  try {
    const { id } = req.params;

    if (getStatus() && mongoose.Types.ObjectId.isValid(id)) {
      try {
        const post = await ContentPost.findByIdAndDelete(id);
        if (post) {
          return res.status(200).json({ success: true, message: 'Content post deleted' });
        }
      } catch (err) {
        // Fall through
      }
    }

    const store = getMemoryStore();
    store.contentPosts = store.contentPosts.filter(p => String(p._id) !== String(id) && String(p.id) !== String(id));
    return res.status(200).json({ success: true, message: 'Content post deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
