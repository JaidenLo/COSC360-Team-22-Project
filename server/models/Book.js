const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true, default: '' },
    image: {type: String, default: ""},
    borrowed: { type: Boolean, default: false},
    borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, {
    timestamps: true,
    collection: 'books'
});

module.exports = mongoose.model('Book', bookSchema);