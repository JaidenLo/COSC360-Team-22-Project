const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { validateRegister } = require('../middleware/validate');
const {
    registerUser,
    loginUser,
    getAllUsers,
    updateUser,
    deleteUser,
    saveImg,
    getImgLink,
    upload,
    graphs,
    bookhistoryTrack
} = require('../controllers/userController');


router.get('/check-username', async (req, res) => {
    try {
        const username = req.query.username;
        if (!username) return res.status(400).json({ available: false });
        const user = await User.findOne({ name: username });
        res.json({ available: !user });
    } catch (error) {
        res.status(500).json({ available: false });
    }
});

function checkConfirmPassword(req, res, next) {
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    next();
}

router.post('/register', upload.single('avatar'), checkConfirmPassword, validateRegister, registerUser);
router.post('/login', loginUser);
router.get('/search', getAllUsers);
router.delete('/delete/:id', deleteUser);
router.post('/:userId/uploadImg', saveImg);
router.get('/:userId/image', getImgLink);


//admin-dashboard/${user._id}
router.get('/admin-dashboard/search', bookhistoryTrack);
router.get('/admin-dashboard', graphs);
router.get('/admin-dashboard/debug', async (req, res) => {
    try {
        const BookBorrowHistory = require('../models/BookBorrowHistory');
        const count = await BookBorrowHistory.countDocuments();
        const sample = await BookBorrowHistory.findOne();
        res.status(200).json({ count, sample });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.put('/:id', updateUser);
module.exports = router;