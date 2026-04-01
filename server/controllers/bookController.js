const Book = require('../models/Book');

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find()
            .populate("borrowedBy", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json(books);
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

        if (category && category !== 'all') {
            filter.category = { $regex: category.trim(), $options: 'i' };
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

const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { requesterId, requesterType } = req.body;
        const book = await Book.findById(id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        const isOwner = book.owner && book.owner.toString() === requesterId;
        const isAdmin = requesterType === 'admin';
        if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorised to delete this book' });

        await Book.findByIdAndDelete(id);
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const borrowBook = async (req, res) => {
    try{
        const { id } = req.params;
        const { userId } = req.body;

        const book = await Book.findById(id);

        if(!book) {
            return res.status(404).json({ message: 'Book not found'});
        }
        if(book.borrowed){
            return res.status(400).json({ message: 'Book is already borrowed'});
        }
        
        book.borrowed = true;
        book.borrowedBy = userId;

        await book.save();

        res.json({ message: 'Book borrowed successfully', book});
    } catch (error){
        res.status(500).json({message: 'Server Error', error:error.message});
    }
};

const returnBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (!book.borrowed) {
            return res.status(400).json({ message: 'Book is not currently borrowed' });
        }

        if (book.borrowedBy && book.borrowedBy.toString() !== userId){
            return res.status(403).json({ message: 'You cannot return a book borrowed by another user' });
        }

        book.borrowed = false;
        book.borrowedBy = null;

        await book.save();

        res.json({ message: 'Book returned successfully', book });
    } catch(error){
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

module.exports = { getAllBooks, searchBooks, getBooksByOwner, createBook, updateBook, deleteBook, borrowBook, returnBook, getBorrowedBooksByUser};