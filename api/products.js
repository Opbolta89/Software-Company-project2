const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://user1:Nikhil123%40%24@cluster0.paw3hdt.mongodb.net/?appName=Cluster0';
const DB_NAME = process.env.MONGO_DB_NAME || 'Cluster0';

async function getDb() {
  const { MongoClient } = await import('mongodb');
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  return client.db(DB_NAME);
}

export default async function handler(req, res) {
  const { query } = req;
  const productId = query.id;
  const pathParts = query.path ? query.path.split('/') : [];

  let db;
  try {
    db = await getDb();
  } catch (error) {
    console.error('DB Error:', error.message);
    // Return sample data for GET requests
    if (req.method === 'GET') {
      const sampleProducts = [
        { id: "1", name: "Gold Necklace", price: 50000, category: "Necklace", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400" },
        { id: "2", name: "Diamond Ring", price: 75000, category: "Ring", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400" },
        { id: "3", name: "Pearl Earrings", price: 15000, category: "Earrings", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400" }
      ];
      if (productId) {
        const product = sampleProducts.find(p => p.id === productId);
        if (product) return res.status(200).json(product);
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.status(200).json(sampleProducts);
    }
    return res.status(500).json({ message: 'Database error' });
  }

  // Get all products
  if (req.method === 'GET' && !productId) {
    try {
      const products = await db.collection('products').find({}).toArray();
      return res.status(200).json(products);
    } catch (error) {
      console.error('Error:', error);
      return res.status(200).json([
        { id: "1", name: "Gold Necklace", price: 50000, category: "Necklace", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400" }
      ]);
    }
  }

  // Get single product
  if (req.method === 'GET' && productId) {
    try {
      const { ObjectId } = await import('mongodb');
      let product = await db.collection('products').findOne({ id: productId });
      if (!product) {
        try {
          product = await db.collection('products').findOne({ _id: new ObjectId(productId) });
        } catch (e) {}
      }
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.status(200).json(product);
    } catch (error) {
      return res.status(404).json({ message: 'Product not found' });
    }
  }

  // Create product
  if (req.method === 'POST') {
    try {
      const newProduct = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date().toISOString()
      };
      await db.collection('products').insertOne(newProduct);
      return res.status(201).json(newProduct);
    } catch (error) {
      return res.status(500).json({ message: 'Error creating product' });
    }
  }

  // Update product
  if (req.method === 'PUT' && productId) {
    try {
      const updateData = { ...req.body, updatedAt: new Date().toISOString() };
      const result = await db.collection('products').findOneAndUpdate(
        { id: productId },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      if (!result) return res.status(404).json({ message: 'Product not found' });
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Error updating product' });
    }
  }

  // Delete product
  if (req.method === 'DELETE' && productId) {
    try {
      const result = await db.collection('products').deleteOne({ id: productId });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting product' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
