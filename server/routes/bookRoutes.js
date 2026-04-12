const express = require('express');
const router = express.Router();
const { getAllBooks, searchBooks, getBooksByOwner, createBook, updateBook, deleteBook, borrowBook, returnBook, getBorrowedBooksByUser, joinQueue, leaveQueue } = require('../controllers/bookController');
const { validateBook } = require('../middleware/validate');

router.get('/search', searchBooks);
router.get('/owner/:ownerId', getBooksByOwner);
router.get('/borrowed/:userId', getBorrowedBooksByUser);
router.get('/', getAllBooks);
router.post('/', validateBook, createBook);
router.put('/borrow/:id', borrowBook);
router.put('/return/:id', returnBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);
router.post('/queue/:id', joinQueue);
router.delete('/queue/:id', leaveQueue);

module.exports = router;