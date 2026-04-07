const express = require('express');
const router = express.Router();
const { getThreadsByBook, getThreadsByUser, createThread } = require('../controllers/threadController');
const { validateThread } = require('../middleware/validate');

router.get('/user/:userId', getThreadsByUser);
router.get('/:bookId', getThreadsByBook);
router.post('/', validateThread, createThread);

module.exports = router;