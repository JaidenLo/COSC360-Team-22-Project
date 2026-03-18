const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    city:     { type: String, required: true },
    usertype: {type: String, default: 'user'}, //to set up user role for adminstration 
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);