const Book = require('../models/Book');
const BookBorrowHistory = require('../models/BookBorrowHistory');

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find()
            .populate("borrowedBy", "name email")
            .sort({ createdAt: -1 });

        const booksWithThreadCount = await Promise.all(books.map(async (book) => {
            const threadCount = await Thread.countDocuments({ bookId: book._id });
            return { ...book.toObject(), threadCount };
        }));

        res.status(200).json(booksWithThreadCount);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const searchBooks = async (req, res) => {
    try {
        const { q, category } = req.query;
        const filter = {};
        if (q && q.trim()) {
            filter.$or = [
                { title:       { $regex: q.trim(), $options: 'i' } },
                { description: { $regex: q.trim(), $options: 'i' } },
            ];
        }
        if (category && category !== 'all') { filter.category = category.trim();
        }
        const books = await Book.find(filter).sort({ createdAt: -1 });
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getBooksByOwner = async (req, res) => {
    try {
        const { ownerId } = req.params;
        const books = await Book.find({ owner: ownerId }).sort({ createdAt: -1 });
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const createBook = async (req, res) => {
    try {
        const { title, category, description, image, owner } = req.body;
        if (!title || !category || !description) {
            return res.status(400).json({ message: 'Data must be filled' });
        }
        const newBook = await Book.create({ title, category, description, image: image || null, owner: owner || null });
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, description, image, requesterId, requesterType } = req.body;
        const book = await Book.findById(id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        const isOwner = book.owner && book.owner.toString() === requesterId;
        const isAdmin = requesterType === 'admin';
        if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorised to edit this book' });

        if (title) book.title = title;
        if (category) book.category = category;
        if (description) book.description = description;
        if (image !== undefined) book.image = image;

        const updated = await book.save();
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
const Thread = require('../models/Thread'); 

const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { requesterId, requesterType } = req.body;
        const book = await Book.findById(id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        const isOwner = book.owner && book.owner.toString() === requesterId;
        const isAdmin = requesterType === 'admin';
        if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorised to delete this book' });

        await Thread.deleteMany({ bookId: id });
        await Book.findByIdAndDelete(id);
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const borrowBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const book = await Book.findById(id);
        let borrowHistory = await BookBorrowHistory.findOne({ bookId: id, userId, action: 'borrowed' }).sort({ borrowDate: -1 });
        if (borrowHistory) {
            return res.status(400).json({ message: 'You already have this book borrowed' });
        }
        if (!book) return res.status(404).json({ message: 'Book not found' });
        if (book.borrowed) return res.status(400).json({ message: 'Book is already borrowed' });

        // if reserved, only the reserved user can borrow
        if (book.reservedFor?.userId) {
            const reservedId = book.reservedFor.userId.toString();
            const now = new Date();
            if (reservedId !== userId.toString()) {
                return res.status(403).json({ message: 'This book is reserved for another user' });
            }
            if (book.reservedFor.expiresAt < now) {
                // reservation expired, clear it and allow anyone
                book.reservedFor = { userId: null, username: null, expiresAt: null };
                
            }
        }
        
         borrowHistory = await BookBorrowHistory.create({ bookId: id, userId, borrowDate: new Date(), action: 'borrowed' });
        




        book.borrowed = true;
        book.borrowedBy = userId;
        book.reservedFor = { userId: null, username: null, expiresAt: null };

        await book.save();
        res.json({ message: 'Book borrowed successfully', book });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const returnBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const book = await Book.findById(id);
        const bookReturnHistory = await BookBorrowHistory.findOne({ bookId: id, userId }).sort({ borrowDate: -1 });
        if (bookReturnHistory) {
            bookReturnHistory.returnDate = new Date();
            bookReturnHistory.action = 'returned';
            await bookReturnHistory.save();
        }
        if (!book) return res.status(404).json({ message: 'Book not found' });
        if (!book.borrowed) return res.status(400).json({ message: 'Book is not currently borrowed' });
        if (book.borrowedBy && book.borrowedBy.toString() !== userId) {
            return res.status(403).json({ message: 'You cannot return a book borrowed by another user' });
        }

        book.borrowed = false;
        book.borrowedBy = null;

        // notify the next person in queue
        if (book.queue && book.queue.length > 0) {
            const next = book.queue.shift();
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 24);
            book.reservedFor = {
                userId: next.userId,
                username: next.username,
                expiresAt
            };
        }

        await book.save();
        res.json({ message: 'Book returned successfully', book });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getBorrowedBooksByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const books = await Book.find({ borrowed: true, borrowedBy: userId });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const joinQueue = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, username } = req.body;

        const book = await Book.findById(id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        if (book.borrowedBy && book.borrowedBy.toString() === userId.toString()) {
            return res.status(400).json({ message: 'You already have this book borrowed' });
        }

        const alreadyInQueue = book.queue.some(q => q.userId.toString() === userId.toString());
        if (alreadyInQueue) return res.status(400).json({ message: 'Already in queue' });

        if (book.reservedFor?.userId?.toString() === userId.toString()) {
            return res.status(400).json({ message: 'Book is already reserved for you' });
        }

        book.queue.push({ userId, username });
        await book.save();
        res.json({ message: 'Joined queue successfully', queueLength: book.queue.length });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const leaveQueue = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const book = await Book.findById(id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        book.queue = book.queue.filter(q => q.userId.toString() !== userId.toString());
        await book.save();
        res.json({ message: 'Left queue successfully', queueLength: book.queue.length });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getAllBooks, searchBooks, getBooksByOwner, createBook, updateBook, deleteBook, borrowBook, returnBook, getBorrowedBooksByUser, joinQueue, leaveQueue };