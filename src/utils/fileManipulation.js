const FILE_PATH = './src/talker.json';
const fs = require('fs').promises;

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

const findById = async (id) => {
  const oldFile = await await getFile();
  const personById = oldFile.filter((person) => person.id === Number(id));
  if (!personById.length) throw new Error('Pessoa palestrante não encontrada');
  return personById;
};

const filterTalkers = async (query) => {
  const oldFile = await getFile();
  const filteredTalkers = oldFile.filter((talker) => talker.name.includes(query));
  return filteredTalkers;
};

module.exports = {
  createTalker,
  updatedTalker,
  deleteId,
  findById,
  filterTalkers,
};
