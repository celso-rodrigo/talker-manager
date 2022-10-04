const express = require('express');

const router = express.Router();
const fs = require('fs').promises;

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

// router.post('/', (req, res) => {});

// router.put('/:id', (req, res) => {
//   const { id } = req.params;
// });

// router.delete('/:id', (req, res) => {
//   const { id } = req.params;
// });

module.exports = router;