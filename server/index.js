const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Atlas connected!'))
    .catch((err) => console.log('MongoDB connection error:', err));

// test route
app.get('/api', (req, res) => {
    res.json({ message: 'API is connected!' });
});

// routes
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');

app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);

const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});