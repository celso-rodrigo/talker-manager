const express = require('express');
const fs = require('fs').promises;
const { 
  validateToken,
  validateName,
  validateAge,
  validateTalkEmpty,
  validateWatchedAndRate,
  validateTalkData,
 } = require('../middlewares/validation');

const router = express.Router();

const FILE_PATH = './src/talker.json';

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

const filterTalkers = (term) => {
  console.log(term);
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
  try {
    const { id } = req.params;
    const data = await fs.readFile(FILE_PATH, 'utf-8');
    const personById = JSON.parse(data).filter((person) => person.id === Number(id));
    if (!personById.length) throw new Error('Pessoa palestrante não encontrada');
    res.status(200).json(...personById);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.get('/search?q', async (req, res) => {
  try {
    const { q } = req.query;
    validateToken(req.headers.authorization);
    await filterTalkers(q);
    res.status(200).end();
  } catch (err) {
    res.status(err.code).json({ message: err.message });
  }
});

router.post('/',
  validateToken,
  validateName,
  validateAge,
  validateTalkEmpty,
  validateWatchedAndRate,
  validateTalkData,
  async (req, res) => {
  try {
    const newTalker = await createTalker(req.body);
    res.status(201).json(newTalker);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id',
  validateToken,
  validateName,
  validateAge,
  validateTalkEmpty,
  validateWatchedAndRate,
  validateTalkData,
  async (req, res) => {
  try {
    const newTalker = await updatedTalker(req.body, Number(req.params.id));
    res.status(200).json(newTalker);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', validateToken, async (req, res) => {
  try {
    await deleteId(Number(req.params.id));
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;