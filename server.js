const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 6000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock user data
const userData = {
  username: "John Doe",
  email: "john.doe@example.com"
};

// API endpoint to get user data
app.get('/api/user', (req, res) => {
  res.json(userData);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});