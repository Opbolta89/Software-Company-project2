import express from 'express';

const router = express.Router();

// GET all orders
router.get('/', async (req, res) => {
  try {
    if (req.db) {
      const orders = await req.db.collection('orders').find({}).toArray();
      res.json(orders);
    } else {
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const dataFile = path.join(__dirname, '../data/orders.json');
      const data = fs.readFileSync(dataFile, 'utf-8');
      res.json(JSON.parse(data));
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// GET single order
router.get('/:id', async (req, res) => {
  try {
    if (req.db) {
      const { ObjectId } = await import('mongodb');
      let order = await req.db.collection('orders').findOne({ id: req.params.id });
      if (!order) order = await req.db.collection('orders').findOne({ _id: new ObjectId(req.params.id) });
      if (!order) return res.status(404).json({ message: 'Order not found' });
      res.json(order);
    } else {
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const dataFile = path.join(__dirname, '../data/orders.json');
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
      const order = data.find(o => o.id == req.params.id);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      res.json(order);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order' });
  }
});

// POST create order
router.post('/', async (req, res) => {
  try {
    const newOrder = {
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...req.body
    };

    if (req.db) {
      await req.db.collection('orders').insertOne(newOrder);
    } else {
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const dataFile = path.join(__dirname, '../data/orders.json');
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
      data.push(newOrder);
      fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    }

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order' });
  }
});

// PUT update order
router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body, updatedAt: new Date().toISOString() };

    if (req.db) {
      const { ObjectId } = await import('mongodb');
      let result = await req.db.collection('orders').findOneAndUpdate(
        { id: req.params.id },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      if (!result) {
        result = await req.db.collection('orders').findOneAndUpdate(
          { _id: new ObjectId(req.params.id) },
          { $set: updateData },
          { returnDocument: 'after' }
        );
      }
      if (!result) return res.status(404).json({ message: 'Order not found' });
      res.json(result);
    } else {
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const dataFile = path.join(__dirname, '../data/orders.json');
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
      const index = data.findIndex(o => o.id == req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Order not found' });
      data[index] = { ...data[index], ...updateData };
      fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
      res.json(data[index]);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating order' });
  }
});

export default router;
