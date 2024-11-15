/* server/routes/registrationRoutes.js */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/User').schema;

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  const User = req.dbConnection.model('User', userSchema);

  try {
    let user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      username,
      password,
      role: 'student', 
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      id: user._id,
      role: user.role,
    };

    jwt.sign(payload, global.secretKey, { expiresIn: '1d' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
