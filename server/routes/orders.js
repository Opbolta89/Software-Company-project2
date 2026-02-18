import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();
const dataFile = path.join(__dirname, '../data/orders.json');

const readData = () => {
  const data = fs.readFileSync(dataFile, 'utf-8');
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};

// GET all orders
router.get('/', (req, res) => {
  const orders = readData();
  res.json(orders);
});

// GET single order
router.get('/:id', (req, res) => {
  const orders = readData();
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

// POST create order
router.post('/', (req, res) => {
  const orders = readData();
  const newOrder = {
    id: Date.now(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...req.body
  };
  orders.push(newOrder);
  writeData(orders);
  res.status(201).json(newOrder);
});

// PUT update order status
router.put('/:id', (req, res) => {
  const orders = readData();
  const index = orders.findIndex(o => o.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Order not found' });

  orders[index] = { ...orders[index], ...req.body };
  writeData(orders);
  res.json(orders[index]);
});

export default router;
