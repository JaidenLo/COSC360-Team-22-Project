const express = require('express');
const router = express.Router();
const User = require("../models/User")
const {
    registerUser,
    loginUser,
    getAllUsers,
    updateUser,
    deleteUser, 
    saveImg,
    getImgLink,
    upload
} = require('../controllers/userController');

console.log('userRoutes file loaded');

router.get('/route-check', (req, res) => {
    res.json({ message: 'userRoutes is working' });
});

router.put('/test-put', (req, res) => {
    res.json({ message: 'PUT route works' });
});

router.get("/check-username", async (req, res) => {
    try {
        const username = req.query.username;

        if (!username) {
            return res.status(400).json({ available: false });
        }

        const user = await User.findOne({ name: username });

        res.json({ available: !user });
    } catch (error) {
        console.error("CHECK USERNAME ERROR:", error); // 👈 THIS WILL SHOW THE REAL ISSUE
        res.status(500).json({ available: false });
    }
});






// router.get('/check-username', checkking)
// `/api/users/${userId}/uploadImg`
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/search', getAllUsers);
router.delete('/delete/:id', deleteUser); // delete for admin user
router.post('/:userId/uploadImg', saveImg);
router.get('/:userId/image', getImgLink);

router.put('/:id', updateUser);
module.exports = router;