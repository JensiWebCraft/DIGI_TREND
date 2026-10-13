import express from 'express';
import { generateCreative, getHistory } from '../controllers/aiController.js';

const router = express.Router();

router.post('/generate', generateCreative);
router.get('/history', getHistory);

export default router;
