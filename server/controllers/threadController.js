const Thread = require('../models/Thread');

// GET /api/threads/:bookId — get all threads for a book
const getThreadsByBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const threads = await Thread.find({ bookId }).sort({ createdAt: -1 });
        res.status(200).json(threads);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// POST /api/threads — post a new thread
const createThread = async (req, res) => {
    try {
        const { bookId, username, content } = req.body;

        if (!bookId || !username || !content) {
            return res.status(400).json({ message: 'bookId, username, and content are required.' });
        }

        const thread = await Thread.create({ bookId, username, content });
        res.status(201).json(thread);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getThreadsByBook, createThread };
