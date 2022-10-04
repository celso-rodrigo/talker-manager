// const { response } = require('express');
const express = require('express');

const router = express.Router();
const fs = require('fs').promises;

const customError = (message, code) => {
  const error = Error(message);
  error.code = code;
  throw error; 
};

const validateToken = (token) => {
  if (!token) customError('Token não encontrado', 401);
  if (token.length !== 16) customError('Token inválido', 401);
};

const validateName = (name) => {
  if (!name) customError('O campo "name" é obrigatório', 400);
  if (name.length < 3) customError('O "name" deve ter pelo menos 3 caracteres', 400);
};

const validateAge = (age) => {
  if (!age) customError('O campo "age" é obrigatório', 400);
  if (age < 18) customError('A pessoa palestrante deve ser maior de idade', 400);
};

const validateTalkEmpty = (talk) => {
  if (!talk) customError('O campo "talk" é obrigatório', 400);
  if (!talk.watchedAt || !talk.watchedAt.length) {
    customError('O campo "watchedAt" é obrigatório', 400);
  }
  if (talk.rate === undefined) customError('O campo "rate" é obrigatório', 400);
};

const validateTalkData = (talk) => {
  const { watchedAt, rate } = talk;
  const dateReg = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;
  if (!watchedAt.match(dateReg)) {
    customError('O campo "watchedAt" deve ter o formato "dd/mm/aaaa"', 400);
  }
  if (rate > 5 || rate <= 0) customError('O campo "rate" deve ser um inteiro de 1 à 5', 400);
};

const validateTalk = (talk) => {
  validateTalkEmpty(talk);
  validateTalkData(talk);
};

const updateTalkers = async (newTalker) => {
  const oldTalkers = await fs.readFile('./src/talker.json', 'utf-8');
  const parseOldTalkers = JSON.parse(oldTalkers);
  const lastId = Math.max(...parseOldTalkers.map((talker) => talker.id));
  const newTalkerWithId = { id: lastId + 1, ...newTalker };
  const updatedTalkers = JSON.stringify([...parseOldTalkers, newTalkerWithId]);
  await fs.writeFile('./src/talker.json', updatedTalkers);
  return newTalkerWithId;
};

router.get('/', async (_req, res) => {
  try {
    const data = await fs.readFile('./src/talker.json', 'utf-8');
    const json = JSON.parse(data);
    res.status(200).json(json);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await fs.readFile('./src/talker.json', 'utf-8');
    const personById = JSON.parse(data).filter((person) => person.id === Number(id));
    if (!personById.length) throw new Error('Pessoa palestrante não encontrada');
    res.status(200).json(...personById);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// router.get('/search', (req, res) => {});

router.post('/', async (req, res) => {
  try {
    const { name, age, talk } = req.body;
    validateToken(req.headers.authorization);
    validateName(name);
    validateAge(age);
    validateTalk(talk);
    const newTalker = await updateTalkers(req.body);
    res.status(201).json(newTalker);
  } catch (err) {
    console.log(err.code);
    res.status(err.code).json({ message: err.message });
  }
});

// router.put('/:id', (req, res) => {
//   const { id } = req.params;
// });

// router.delete('/:id', (req, res) => {
//   const { id } = req.params;
// });

module.exports = router;