const express = require('express');
const router = express.Router();
const { getThreadsByBook, getThreadsByUser, createThread, deleteThread } = require('../controllers/threadController');
const { validateThread } = require('../middleware/validate');

router.get('/user/:userId', getThreadsByUser);
router.get('/:bookId', getThreadsByBook);
router.post('/', validateThread, createThread);
router.delete('/:id', deleteThread);

module.exports = router;