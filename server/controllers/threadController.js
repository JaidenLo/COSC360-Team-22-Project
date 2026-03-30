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

module.exports = { getThreadsByBook, getThreadsByUser, createThread };