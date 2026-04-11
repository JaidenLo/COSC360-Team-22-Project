const mongoose = require('mongoose');

const bookBorrowHistorySchema = new mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    borrowDate: { type: Date, default: Date.now },
    returnDate: { type: Date, default: null }
}, {
    timestamps: true,
    collection: 'bookBorrowHistory'
});

module.exports = mongoose.model('BookBorrowHistory', bookBorrowHistorySchema);
