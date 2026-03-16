import { addComment, getCommentsByThread, getCommentById, deleteComment } from '../models/comments.js';

// POST /api/comments
export function create(req, res) {
    try {
        const { content, username, threadId } = req.body;
        if (!content || !username || !threadId) {
            return res.status(400).json({ error: 'Content, username, and threadId are required' });
        }
        const newComment = addComment({ content, username, threadId });
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to post comment' });
    }
}

// GET /api/threads/:threadId/comments
export function getByThread(req, res) {
    try {
        const { threadId } = req.params;
        const comments = getCommentsByThread(threadId);
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get comments' });
    }
}

// GET /api/comments/:id
export function getById(req, res) {
    try {
        const comment = getCommentById(Number(req.params.id));
        if (!comment) return res.status(404).json({ error: 'Comment not found' });
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get comment' });
    }
}

// DELETE /api/comments/:id
export function remove(req, res) {
    try {
        const deleted = deleteComment(Number(req.params.id));
        if (!deleted) return res.status(404).json({ error: 'Comment not found' });
        res.status(200).json({ message: 'Comment deleted', comment: deleted });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete comment' });
    }
}
