import express from 'express';

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    if (req.db) {
      const products = await req.db.collection('products').find({}).toArray();
      res.json(products);
    } else {
      // Fallback to JSON if MongoDB not connected
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const dataFile = path.join(__dirname, '../data/products.json');
      const data = fs.readFileSync(dataFile, 'utf-8');
      res.json(JSON.parse(data));
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const { ObjectId } = await import('mongodb');
    let product;

    if (req.db) {
      product = await req.db.collection('products').findOne({ id: req.params.id });
      if (!product) {
        // Try with MongoDB ObjectId
        product = await req.db.collection('products').findOne({ _id: new ObjectId(req.params.id) });
      }
    } else {
      // Fallback to JSON
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const dataFile = path.join(__dirname, '../data/products.json');
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
      product = data.find(p => p.id == req.params.id);
    }

    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// POST create product
router.post('/', async (req, res) => {
  try {
    const newProduct = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };

    if (req.db) {
      await req.db.collection('products').insertOne(newProduct);
    } else {
      // Fallback to JSON
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const dataFile = path.join(__dirname, '../data/products.json');
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
      data.push(newProduct);
      fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    }

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
});

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    const { ObjectId } = await import('mongodb');
    const updateData = { ...req.body, updatedAt: new Date().toISOString() };

    if (req.db) {
      let result = await req.db.collection('products').findOneAndUpdate(
        { id: req.params.id },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      if (!result) {
        result = await req.db.collection('products').findOneAndUpdate(
          { _id: new ObjectId(req.params.id) },
          { $set: updateData },
          { returnDocument: 'after' }
        );
      }
      if (!result) return res.status(404).json({ message: 'Product not found' });
      res.json(result);
    } else {
      // Fallback to JSON
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const dataFile = path.join(__dirname, '../data/products.json');
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
      const index = data.findIndex(p => p.id == req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Product not found' });
      data[index] = { ...data[index], ...updateData };
      fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
      res.json(data[index]);
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const { ObjectId } = await import('mongodb');

    if (req.db) {
      let result = await req.db.collection('products').deleteOne({ id: req.params.id });
      if (result.deletedCount === 0) {
        result = await req.db.collection('products').deleteOne({ _id: new ObjectId(req.params.id) });
      }
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
    } else {
      // Fallback to JSON
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const dataFile = path.join(__dirname, '../data/products.json');
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
      const filtered = data.filter(p => p.id != req.params.id);
      if (data.length === filtered.length) {
        return res.status(404).json({ message: 'Product not found' });
      }
      fs.writeFileSync(dataFile, JSON.stringify(filtered, null, 2));
    }

    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

export default router;
