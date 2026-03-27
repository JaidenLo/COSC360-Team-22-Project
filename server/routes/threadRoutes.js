const express = require('express');
const router = express.Router();
const { getThreadsByBook, createThread } = require('../controllers/threadController');

router.get('/:bookId', getThreadsByBook);
router.post('/', createThread);

module.exports = router;
