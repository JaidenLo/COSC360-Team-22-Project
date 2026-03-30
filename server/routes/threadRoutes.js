const express = require('express');
const router = express.Router();
const { getThreadsByBook, getThreadsByUser, createThread } = require('../controllers/threadController');

router.get('/user/:userId', getThreadsByUser);
router.get('/:bookId', getThreadsByBook);
router.post('/', createThread);

module.exports = router;