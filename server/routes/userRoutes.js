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
    upload
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

router.post('/register', upload.single('avatar'), validateRegister, registerUser);
router.post('/login', loginUser);
router.get('/search', getAllUsers);
router.delete('/delete/:id', deleteUser);
router.post('/:userId/uploadImg', saveImg);
router.get('/:userId/image', getImgLink);
router.put('/:id', updateUser);

module.exports = router;