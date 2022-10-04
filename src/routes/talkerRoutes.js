const express = require('express');

const router = express.Router();
const fs = require('fs').promises;

router.get('/', async (_req, res) => {
  try {
    const data = await fs.readFile('./src/talker.json', 'utf-8');
    const json = await JSON.parse(data);
    res.status(200).json(json);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// router.get('/:id', (req, res) => {
//   const { id } = req.params;
// });

// router.get('/search', (req, res) => {});

// router.post('/', (req, res) => {});

// router.put('/:id', (req, res) => {
//   const { id } = req.params;
// });

// router.delete('/:id', (req, res) => {
//   const { id } = req.params;
// });

module.exports = router;