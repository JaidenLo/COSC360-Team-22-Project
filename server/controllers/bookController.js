const Book = require('../models/Book');

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const createBook = async (req, res) => {
    try {
        const { title, category, description, image } = req.body;

        if(!title || !category || !description){
            return res.status(400).json({
                message: 'Data must be filled'
            });
        }

        const newBook = await Book.create({
            title,
            category,
            description,
            image: image || null
        });

        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getAllBooks, createBook };