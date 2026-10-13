import Client from '../models/Client.js';
import { getStatus, getMemoryStore } from '../config/db.js';

export const getClients = async (req, res) => {
  try {
    if (getStatus()) {
      let clients = await Client.find().sort({ createdAt: -1 });
      if (clients.length === 0) {
        const { sampleClients } = await import('../seed/seedData.js');
        const clean = sampleClients.map(({ _id, ...rest }) => rest);
        clients = await Client.insertMany(clean);
      }
      return res.status(200).json({ success: true, count: clients.length, data: clients });
    } else {
      const store = getMemoryStore();
      return res.status(200).json({ success: true, count: store.clients.length, data: store.clients });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createClient = async (req, res) => {
  try {
    const { name, industry, contactPerson, email, phone, monthlyRetainer } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Client name is required' });
    }

    const industryVal = industry || 'Branding & Digital';

    if (getStatus()) {
      try {
        const client = await Client.create({ 
          name, 
          industry: industryVal, 
          contactPerson: contactPerson || '', 
          email: email || '', 
          phone: phone || '', 
          monthlyRetainer: Number(monthlyRetainer) || 0 
        });
        return res.status(201).json({ success: true, data: client });
      } catch (err) {
        // Fallback to memory store if Mongo error
      }
    }

    const store = getMemoryStore();
    const newClient = {
      _id: 'client_' + Date.now(),
      id: 'client_' + Date.now(),
      name,
      industry: industryVal,
      contactPerson: contactPerson || '',
      email: email || '',
      phone: phone || '',
      status: 'Active',
      monthlyRetainer: Number(monthlyRetainer) || 0,
      createdAt: new Date()
    };
    store.clients.unshift(newClient);
    return res.status(201).json({ success: true, data: newClient });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
