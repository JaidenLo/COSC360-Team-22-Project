const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true, default: '' },
    image: { type: String, default: "" },
    borrowed: { type: Boolean, default: false },
    borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    queue: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        username: { type: String }
    }],
    reservedFor: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        username: { type: String, default: null },
        expiresAt: { type: Date, default: null }
    }
}, {
    timestamps: true,
    collection: 'books'
});

module.exports = mongoose.model('Book', bookSchema);