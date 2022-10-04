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

const validateEmail = (email) => !email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/);

const validateSize = (string) => !string || !string.length;

const validateForm = (email, password) => {
  if (validateSize(password)) throw new Error('O campo "password" é obrigatório');
  if (password.length < 6) throw new Error('O "password" deve ter pelo menos 6 caracteres');
  if (validateSize(email)) throw new Error('O campo "email" é obrigatório');
  if (validateEmail(email)) {
    throw new Error('O "email" deve ter o formato "email@email.com"');
  }
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