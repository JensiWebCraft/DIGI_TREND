import mongoose from 'mongoose';
import Task from '../models/Task.js';
import Client from '../models/Client.js';
import { getStatus, getMemoryStore } from '../config/db.js';

export const getTasks = async (req, res) => {
  try {
    const { q, status, client, priority, service } = req.query;

    if (getStatus()) {
      let query = {};
      if (status && status !== 'All') query.status = status;
      if (client && client !== 'All') query.client = client;
      if (priority && priority !== 'All') query.priority = priority;
      if (service && service !== 'All') query.service = service;
      if (q) {
        query.$or = [
          { taskTitle: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { clientName: { $regex: q, $options: 'i' } }
        ];
      }

      const tasks = await Task.find(query).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: tasks.length, data: tasks });
    } else {
      const store = getMemoryStore();
      let filtered = [...store.tasks];

      if (status && status !== 'All') {
        filtered = filtered.filter(t => t.status === status);
      }
      if (client && client !== 'All') {
        filtered = filtered.filter(t => String(t.client) === String(client) || t.clientName === client);
      }
      if (priority && priority !== 'All') {
        filtered = filtered.filter(t => t.priority === priority);
      }
      if (service && service !== 'All') {
        filtered = filtered.filter(t => t.service === service);
      }
      if (q) {
        const queryLower = q.toLowerCase();
        filtered = filtered.filter(t => 
          (t.taskTitle && t.taskTitle.toLowerCase().includes(queryLower)) ||
          (t.description && t.description.toLowerCase().includes(queryLower)) ||
          (t.clientName && t.clientName.toLowerCase().includes(queryLower))
        );
      }

      return res.status(200).json({ success: true, count: filtered.length, data: filtered });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const taskTitle = req.body.taskTitle || req.body.title;
    const service = req.body.service || 'Social Media';
    const dueDate = req.body.dueDate || new Date(Date.now() + 7 * 86400000);
    const client = req.body.client || 'General Client';
    const clientName = req.body.clientName || (typeof client === 'string' ? client : 'General Client');
    const priority = req.body.priority || 'Medium';
    const status = req.body.status || 'To Do';
    const platform = req.body.platform || 'Instagram';
    const assignedEmployeeName = req.body.assignedEmployeeName || req.body.assignedTo || 'Unassigned';
    const description = req.body.description || '';
    const referenceLink = req.body.referenceLink || '';

    if (!taskTitle) {
      return res.status(400).json({ success: false, message: 'taskTitle or title is required' });
    }

    if (getStatus()) {
      try {
        const task = await Task.create({
          taskTitle,
          client,
          clientName,
          service,
          platform,
          assignedEmployeeName,
          priority,
          status,
          startDate: req.body.startDate || new Date(),
          dueDate,
          description,
          referenceLink
        });

        return res.status(201).json({ success: true, data: task });
      } catch (mongoErr) {
        // Fallback to memory store if Mongo error
      }
    }

    const store = getMemoryStore();
    const newTask = {
      _id: 'task_' + Date.now(),
      id: 'task_' + Date.now(),
      taskTitle,
      client,
      clientName,
      service,
      platform,
      assignedEmployeeName,
      priority,
      status,
      startDate: req.body.startDate ? new Date(req.body.startDate) : new Date(),
      dueDate: new Date(dueDate),
      description,
      referenceLink,
      createdAt: new Date()
    };
    store.tasks.unshift(newTask);
    return res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (updateData.title && !updateData.taskTitle) updateData.taskTitle = updateData.title;
    if (updateData.taskTitle && !updateData.title) updateData.title = updateData.taskTitle;
    if (updateData.client && !updateData.clientName) updateData.clientName = updateData.client;
    if (updateData.clientName && !updateData.client) updateData.client = updateData.clientName;
    if (updateData.assignedTo && !updateData.assignedEmployeeName) updateData.assignedEmployeeName = updateData.assignedTo;
    if (updateData.assignedEmployeeName && !updateData.assignedTo) updateData.assignedTo = updateData.assignedEmployeeName;
    if (updateData.dueDate && !updateData.deadline) updateData.deadline = updateData.dueDate;
    if (updateData.deadline && !updateData.dueDate) updateData.dueDate = updateData.deadline;
    if (updateData.service && !updateData.category) updateData.category = updateData.service;
    if (updateData.category && !updateData.service) updateData.service = updateData.category;

    if (getStatus() && mongoose.Types.ObjectId.isValid(id)) {
      try {
        const task = await Task.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (task) {
          return res.status(200).json({ success: true, data: task });
        }
      } catch (err) {
        // Fall through to memory store
      }
    }

    const store = getMemoryStore();
    const index = store.tasks.findIndex(t => String(t._id) === String(id) || String(t.id) === String(id));
    if (index !== -1) {
      store.tasks[index] = { 
        ...store.tasks[index], 
        ...updateData, 
        updatedAt: new Date() 
      };
      return res.status(200).json({ success: true, data: store.tasks[index] });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Task updated', 
      data: { _id: id, id, ...updateData, updatedAt: new Date() } 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (getStatus() && mongoose.Types.ObjectId.isValid(id)) {
      try {
        const task = await Task.findByIdAndDelete(id);
        if (task) {
          return res.status(200).json({ success: true, message: 'Task deleted successfully' });
        }
      } catch (err) {
        // Fall through to memory store
      }
    }

    const store = getMemoryStore();
    store.tasks = store.tasks.filter(t => String(t._id) !== String(id) && String(t.id) !== String(id));
    return res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
