// const { response } = require('express');
const express = require('express');

const router = express.Router();
const fs = require('fs').promises;

const FILE_PATH = './src/talker.json';

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

const getFile = async () => {
  const oldTalkers = await fs.readFile(FILE_PATH, 'utf-8');
  return JSON.parse(oldTalkers);
};

const createTalker = async (newTalker) => {
  const oldFile = await getFile();
  const lastId = Math.max(...oldFile.map((talker) => talker.id));
  const newTalkerWithId = { id: lastId + 1, ...newTalker };
  const updatedTalkers = JSON.stringify([...oldFile, newTalkerWithId]);
  await fs.writeFile(FILE_PATH, updatedTalkers);
  return newTalkerWithId;
};

const updatedTalker = async (newTalker, id) => {
  const oldFile = await getFile();
  const filteredTalkers = oldFile.filter((talker) => talker.id !== id);
  const newTalkerUpdated = { id, ...newTalker };
  const updatedTalkers = JSON.stringify([newTalkerUpdated, ...filteredTalkers]);
  await fs.writeFile(FILE_PATH, updatedTalkers);
  return newTalkerUpdated;
};

const deleteId = async (id) => {
  const oldFile = await getFile();
  const newFile = JSON.stringify(oldFile.filter((talker) => talker.id !== id));
  await fs.writeFile(FILE_PATH, newFile);
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
    const newTalker = await createTalker(req.body);
    res.status(201).json(newTalker);
  } catch (err) {
    res.status(err.code).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, age, talk } = req.body;
    validateToken(req.headers.authorization);
    validateName(name);
    validateAge(age);
    validateTalk(talk);
    const newTalker = await updatedTalker(req.body, Number(req.params.id));
    res.status(200).json(newTalker);
  } catch (err) {
    res.status(err.code).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    validateToken(req.headers.authorization);
    await deleteId(Number(req.params.id));
    res.status(204).end();
  } catch (err) {
    res.status(err.code).json({ message: err.message });
  }
});

module.exports = router;