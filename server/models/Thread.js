const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
    bookId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    username: { type: String, required: true },
    content:  { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Thread', threadSchema);
