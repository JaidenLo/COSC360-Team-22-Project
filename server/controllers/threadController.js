const Thread = require('../models/Thread');

const getThreadsByBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const threads = await Thread.find({ bookId }).sort({ createdAt: -1 });
        res.status(200).json(threads);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getThreadsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const threads = await Thread.find({ userId })
            .populate('bookId', 'title')
            .sort({ createdAt: -1 });

        const result = threads.map(t => ({
            _id: t._id,
            content: t.content,
            createdAt: t.createdAt,
            book: { _id: t.bookId?._id, title: t.bookId?.title }
        }));

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const createThread = async (req, res) => {
    try {
        const { bookId, userId, username, content } = req.body;

        if (!bookId || !username || !content) {
            return res.status(400).json({ message: 'bookId, username, and content are required.' });
        }

        const thread = await Thread.create({ bookId, userId: userId || null, username, content });
        res.status(201).json(thread);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteThread = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, usertype } = req.body;

        const thread = await Thread.findById(id);
        if (!thread) return res.status(404).json({ message: 'Thread not found' });

        const isOwner = thread.userId?.toString() === userId;
        const isAdmin = usertype === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Unauthorized: you can only delete your own posts' });
        }

        await Thread.findByIdAndDelete(id);
        res.status(200).json({ message: 'Thread deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getThreadsByBook, getThreadsByUser, createThread, deleteThread };