const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    city:     { type: String, required: true },
    usertype: { type: String, default: 'user' },
}, { 
    timestamps: true,
    collection: 'TingusPingus'
});

module.exports = mongoose.model('User', userSchema);