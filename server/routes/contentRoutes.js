import express from 'express';
import { getContentPosts, createContentPost, updateContentPost, deleteContentPost } from '../controllers/contentController.js';

const router = express.Router();

router.get('/', getContentPosts);
router.post('/', createContentPost);
router.put('/:id', updateContentPost);
router.delete('/:id', deleteContentPost);

export default router;
