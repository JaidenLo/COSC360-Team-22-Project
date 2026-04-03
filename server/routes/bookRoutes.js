const express = require('express');
const router = express.Router();
const { getAllBooks, searchBooks, getBooksByOwner, createBook, updateBook, deleteBook, borrowBook, returnBook, getBorrowedBooksByUser } = require('../controllers/bookController');

router.get('/search', searchBooks);
router.get('/owner/:ownerId', getBooksByOwner);
router.get('/', getAllBooks);
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);
router.put("/borrow/:id", borrowBook);
router.put('/return/:id', returnBook);
router.get('/borrowed/:userId', getBorrowedBooksByUser);

module.exports = router;