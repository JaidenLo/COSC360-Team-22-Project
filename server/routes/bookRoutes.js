const express = require('express');
const router = express.Router();
const { getAllBooks, searchBooks, getBooksByOwner, createBook, updateBook, deleteBook } = require('../controllers/bookController');

router.get('/search', searchBooks);
router.get('/owner/:ownerId', getBooksByOwner);
router.get('/', getAllBooks);
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

module.exports = router;