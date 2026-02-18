import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();
const dataFile = path.join(__dirname, '../data/contacts.json');

const readData = () => {
  const data = fs.readFileSync(dataFile, 'utf-8');
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};

// GET all contacts
router.get('/', (req, res) => {
  const contacts = readData();
  res.json(contacts);
});

// POST create contact
router.post('/', (req, res) => {
  const contacts = readData();
  const newContact = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...req.body
  };
  contacts.push(newContact);
  writeData(contacts);
  res.status(201).json(newContact);
});

// DELETE contact
router.delete('/:id', (req, res) => {
  const contacts = readData();
  const filtered = contacts.filter(c => c.id !== parseInt(req.params.id));
  if (contacts.length === filtered.length) {
    return res.status(404).json({ message: 'Contact not found' });
  }
  writeData(filtered);
  res.json({ message: 'Contact deleted' });
});

export default router;
