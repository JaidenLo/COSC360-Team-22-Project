const User = require('../models/User'); //user data on mongodb 
const bcrypt = require('bcryptjs');




// Register user
const registerUser = async (req, res) => {
    try {
        const { username, email, password, city } = req.body; //data in the body

        // check if user already exists
        
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const usernameExists = await User.findOne({ name: username });
        if (usernameExists) {
            return res.status(400).json({ message: 'Username already exists' });
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
            aboutMe: "",
            imageLinks: [],
            
        });
        //create 201
        res.status(201).json({
            message: 'User registered!',
            id: user._id,
            name: user.name,
            email: user.email,
            usertype: user.usertype,
            city: user.city,
            aboutMe: user.aboutMe,
            imageLink: user.imageLinks,
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

        
        const responseData = {
            message: "Login successful",
            id: user._id,
            name: user.name,
            email: user.email,
            usertype: user.usertype,
            city: user.city,
            aboutMe: user.aboutMe,
            imageLink: user.imageLinks,
        };

        console.log("LOGIN RESPONSE userController.js:", responseData);

        res.status(200).json(responseData);

    } catch (error) {
        console.log('Error:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

(() => {})()
const getAllUsers = async (req, res) => {
    try {
        const { search } = req.query;

        
        const allUsers = await User.find({ usertype: 'user' }).select('-password');

       
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

const updateUser = async (req,res) => {
    try{
        const {id} = req.params;
        const {name, email, city, password, aboutMe} = req.body;

        const user = await User.findById(id);

        if (!user){
            return res.status(404).json({message: 'User not found'});
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (city) user.city = city;
        if (typeof aboutMe === "string") user.aboutMe = aboutMe;


        if (password && password.trim() !== ""){
            const hashedPassword = await bcrypt.hash(password,10);
            user.password = hashedPassword;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            city: updatedUser.city,
            usertype: updatedUser.usertype,
            aboutMe: updatedUser.aboutMe,
        });
        
    } catch(error){
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        })
    }
}

//"/api/users/delete/${id}?deletedBy=${userId}"


const deleteUser = async(req,res) => {
    try {
        const {id} = req.params; //userId to be deleted
        const adminid = req.query.deletedBy;

        const admin = await User.findById(adminid);
        if (!admin || admin.usertype !== 'admin') {
            return res.status(403).json({message: 'Unauthorized: Admin ID required'});
        }
        const user = await User.findByIdAndDelete(id);

    

        if (!user){
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json({message: 'User deleted successfully'});
    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
}


const saveImg = async (req, res) => {
    try {
        const { userId } = req.params;
        const { image } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.imageLinks = [image];
        await user.save();

        res.status(200).json({
            message: 'Image uploaded successfully',
            imagePath: image
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



const getImgLink = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ imageLinks: user.imageLinks });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { registerUser, loginUser, getAllUsers, updateUser, saveImg, deleteUser, getImgLink };

