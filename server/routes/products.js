import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();
const dataFile = path.join(__dirname, '../data/products.json');

// Helper to read data
const readData = () => {
  const data = fs.readFileSync(dataFile, 'utf-8');
  return JSON.parse(data);
};

// Helper to write data
const writeData = (data) => {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};

// GET all products
router.get('/', (req, res) => {
  const products = readData();
  res.json(products);
});

// GET single product
router.get('/:id', (req, res) => {
  const products = readData();
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// POST create product
router.post('/', (req, res) => {
  const products = readData();
  const newProduct = {
    id: Date.now(),
    ...req.body
  };
  products.push(newProduct);
  writeData(products);
  res.status(201).json(newProduct);
});

// PUT update product
router.put('/:id', (req, res) => {
  const products = readData();
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Product not found' });

  products[index] = { ...products[index], ...req.body };
  writeData(products);
  res.json(products[index]);
});

// DELETE product
router.delete('/:id', (req, res) => {
  const products = readData();
  const filtered = products.filter(p => p.id !== parseInt(req.params.id));
  if (products.length === filtered.length) {
    return res.status(404).json({ message: 'Product not found' });
  }
  writeData(filtered);
  res.json({ message: 'Product deleted' });
});

export default router;
