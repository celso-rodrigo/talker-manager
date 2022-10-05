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

const {
  createTalker,
  updatedTalker,
  deleteId,
  findById,
  filterTalkers,
} = require('../utils/fileManipulation');

const router = express.Router();

const checkForQuery = async (req, res, next) => {
  const { id } = req.params;
  const haveQuery = req.query.q;
  const numberId = Number(id);
  const haveId = !Number.isNaN(numberId);
  if (!haveQuery && haveId) {
    try {
      const talker = await findById(id);
      res.status(200).json(...talker);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  } else {
    next();
  }
};

router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile('./src/talker.json', 'utf-8');
    const json = JSON.parse(data);
    res.status(200).json(json);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get('/:id',
  checkForQuery,
  validateToken,
  async (req, res) => {
    try {
      const { q } = req.query;
      const talkers = await filterTalkers(q);
      res.status(200).json(talkers);
    } catch (err) {
      res.status(500).json({ message: err.message });
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