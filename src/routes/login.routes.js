const express = require('express');

const router = express.Router();

const { validateEmail, validatePassword } = require('../middlewares/validation');

const generateToken = () => {
  const characters = '1234567890qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM';
  let token = '';
  for (let index = 0; index < 16; index += 1) {
    const random = Math.floor(Math.random() * ((characters.length - 1) - 0));
    token = token.concat('', characters[random]);
  }
  return token;
};

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