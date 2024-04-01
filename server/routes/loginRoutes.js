const express = require('express');
const router = express.Router();
const User = require('./models/User');
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    // If user doesn't exist, return an error
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    // If passwords don't match, return an error
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // If login is successful, you can generate and send a JWT token for authentication
    // For simplicity, we'll just send a success message
    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;