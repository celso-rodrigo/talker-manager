const express = require('express');

const router = express.Router();

const generateToken = () => {
  const characters = '1234567890qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM';
  let token = '';
  for (let index = 0; index < 16; index += 1) {
    const random = Math.floor(Math.random() * ((characters.length - 1) - 0));
    token = token.concat('', characters[random]);
  }
  return token;
};

const validateEmail = (email) => {
  if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
    throw new Error('O "email" deve ter o formato "email@email.com"');
  }
};

const validateForm = (email, password) => {
  if (!email) throw new Error('O campo "email" é obrigatório');
  validateEmail(email);
  if (!password) throw new Error('O campo "password" é obrigatório');
  if (password.length < 6) throw new Error('O "password" deve ter pelo menos 6 caracteres');
};

router.post('/', (req, res) => {
  try {
    const { email, password } = req.body;
    validateForm(email, password);
    res.status(200).json({ token: generateToken() });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;