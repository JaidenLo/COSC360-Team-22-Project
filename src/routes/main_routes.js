import express from 'express';
import { create, getByThread, getById, remove } from '../controllers/comments.js';

const router = express.Router();

router.post('/comments', create);

router.get('/threads/:threadId/comments', getByThread);

router.get('/comments/:id', getById);

router.delete('/comments/:id', remove);

export default router;
