const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title:    { type: String, required: true },
    category: { type: String, required: true },
    owner:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);