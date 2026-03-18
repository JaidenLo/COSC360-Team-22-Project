const User = require('../models/User'); //user data on mongodb 
const bcrypt = require('bcryptjs');

// Register user
const registerUser = async (req, res) => {
    try {
        const { username, email, password, city } = req.body;

        // check if user already exists
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // save user to MongoDB
        const user = await User.create({
            name: username,
            email,
            password: hashedPassword,
            city,
            
        });

        res.status(201).json({
            message: 'User registered!',
            id: user._id,
            name: user.name,
            email: user.email,
            usertype: user.usertype
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Request body:', req.body);
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        
        res.status(200).json({
            message: 'Login successful',
            id: user._id,
            name: user.name,
            email: user.email,
            usertype: user.usertype
        });

    } catch (error) {
        console.log('Error:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const { search } = req.query;

        
        const allUsers = await User.find().select('-password');

       
        let users = allUsers;
        if (search) {
            users = allUsers.filter(user =>
                user.name.toLowerCase().trim() === search.toLowerCase().trim()
            );
        }

        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { registerUser, loginUser, getAllUsers };

