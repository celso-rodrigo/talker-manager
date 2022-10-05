const express = require('express');

const router = express.Router();

const { validateEmail, validatePassword } = require('../middlewares/validation');

const generateToken = require('../utils/tokenGenerator');

router.post('/',
  validateEmail,
  validatePassword,
  (_req, res) => {
  try {
    res.status(200).json({ token: generateToken() });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
