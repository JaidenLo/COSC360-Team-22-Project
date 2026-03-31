const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getAllUsers,
    updateUser,
    deleteUser
} = require('../controllers/userController');

console.log('userRoutes file loaded');

router.get('/route-check', (req, res) => {
    res.json({ message: 'userRoutes is working' });
});

router.put('/test-put', (req, res) => {
    res.json({ message: 'PUT route works' });
});






router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/search', getAllUsers);
router.put('/:id', updateUser);

router.delete('/delete/:id', deleteUser); // delete for admin user

module.exports = router;