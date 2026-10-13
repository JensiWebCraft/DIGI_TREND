import AIGeneration from '../models/AIGeneration.js';
import { generateCreativeBrief } from '../services/aiService.js';
import { getStatus, getMemoryStore } from '../config/db.js';

export const generateCreative = async (req, res) => {
  try {
    const { prompt, client, platform, createdBy } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Creative prompt or brief is required' });
    }

    // Call AI Service
    const structuredResult = await generateCreativeBrief({ prompt, client, platform });

    if (getStatus()) {
      const savedDoc = await AIGeneration.create({
        prompt,
        client: client || 'DiGi Trend Client',
        platform: platform || 'Instagram',
        generatedResult: structuredResult,
        createdBy: createdBy || 'Creative Team'
      });
      return res.status(201).json({ 
        success: true, 
        data: savedDoc,
        structuredOutput: structuredResult
      });
    } else {
      const store = getMemoryStore();
      const newEntry = {
        _id: 'ai_' + Date.now(),
        prompt,
        client: client || 'DiGi Trend Client',
        platform: platform || 'Instagram',
        generatedResult: structuredResult,
        createdBy: createdBy || 'Creative Team',
        generatedAt: new Date()
      };
      store.aiGenerations.unshift(newEntry);
      return res.status(201).json({ 
        success: true, 
        data: newEntry,
        structuredOutput: structuredResult
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    if (getStatus()) {
      const history = await AIGeneration.find().sort({ generatedAt: -1 }).limit(30);
      return res.status(200).json({ success: true, count: history.length, data: history });
    } else {
      const store = getMemoryStore();
      return res.status(200).json({ success: true, count: store.aiGenerations.length, data: store.aiGenerations });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
