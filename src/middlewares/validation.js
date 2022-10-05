const validateToken = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) throw new Error('Token não encontrado');
    if (token.length !== 16) throw new Error('Token inválido');
    next();
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const validateName = (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) throw new Error('O campo "name" é obrigatório');
    if (name.length < 3) throw new Error('O "name" deve ter pelo menos 3 caracteres');
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const validateAge = (req, res, next) => {
  try {
    const { age } = req.body;
    if (!age) throw new Error('O campo "age" é obrigatório');
    if (age < 18) throw new Error('A pessoa palestrante deve ser maior de idade');
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const validateWatchedAndRate = (req, res, next) => {
  try {
    const { watchedAt, rate } = req.body.talk;
    if (!watchedAt || !watchedAt.length) throw new Error('O campo "watchedAt" é obrigatório');
    if (rate === undefined) throw new Error('O campo "rate" é obrigatório');
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const validateTalkEmpty = (req, res, next) => {
  try {
    const { talk } = req.body;
    if (!talk) throw new Error('O campo "talk" é obrigatório');
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const validateTalkData = (req, res, next) => {
  try {
    const { watchedAt, rate } = req.body.talk;
    const dateReg = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;
    if (!watchedAt.match(dateReg)) {
      throw new Error('O campo "watchedAt" deve ter o formato "dd/mm/aaaa"');
    }
    if (rate > 5 || rate <= 0) throw new Error('O campo "rate" deve ser um inteiro de 1 à 5');
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const validateEmail = (req, res, next) => {
  try {
    const { email } = req.body;
    const emailReg = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!email) throw new Error('O campo "email" é obrigatório');
    if (!email.match(emailReg)) throw new Error('O "email" deve ter o formato "email@email.com"');
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const validatePassword = (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password) throw new Error('O campo "password" é obrigatório');
    if (password.length < 6) throw new Error('O "password" deve ter pelo menos 6 caracteres');
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  validateToken,
  validateName,
  validateAge,
  validateTalkEmpty,
  validateWatchedAndRate,
  validateTalkData,
  validateEmail,
  validatePassword,
};
