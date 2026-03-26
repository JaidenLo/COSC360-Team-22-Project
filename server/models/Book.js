const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true, default: '' },
    image: {type: String, default: ""},
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, {
    timestamps: true,
    collection: 'bookCollection'
});

module.exports = mongoose.model('Book', bookSchema);