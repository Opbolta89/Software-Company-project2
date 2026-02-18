// Catch-all API route for products
export default async function handler(req, res) {
  const url = req.url || '';
  const match = url.match(/\/api\/products(?:\/([^?]+))?/);
  const productId = match ? match[1] : null;

  const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://user1:Nikhil123%40%24@cluster0.paw3hdt.mongodb.net/?appName=Cluster0';
  const DB_NAME = process.env.MONGO_DB_NAME || 'Cluster0';

  let db;
  try {
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DB_NAME);
  } catch (error) {
    console.error('DB Error:', error.message);
    if (req.method === 'GET') {
      const sampleProducts = [
        { id: "1", name: "Gold Necklace", price: 50000, category: "Necklace", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400" },
        { id: "2", name: "Diamond Ring", price: 75000, category: "Ring", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400" }
      ];
      if (productId) {
        const product = sampleProducts.find(p => p.id === productId);
        return product ? res.status(200).json(product) : res.status(404).json({ message: 'Not found' });
      }
      return res.status(200).json(sampleProducts);
    }
    return res.status(500).json({ message: 'DB Error' });
  }

  // Get all products
  if (req.method === 'GET' && !productId) {
    try {
      const products = await db.collection('products').find({}).toArray();
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ message: 'Error' });
    }
  }

  // Get single product
  if (req.method === 'GET' && productId) {
    try {
      const { ObjectId } = await import('mongodb');
      let product = await db.collection('products').findOne({ id: productId });
      if (!product) {
        try { product = await db.collection('products').findOne({ _id: new ObjectId(productId) }); } catch (e) {}
      }
      if (!product) return res.status(404).json({ message: 'Not found' });
      return res.status(200).json(product);
    } catch (error) {
      return res.status(404).json({ message: 'Not found' });
    }
  }

  // Create product
  if (req.method === 'POST') {
    try {
      const newProduct = { id: Date.now().toString(), ...req.body, createdAt: new Date().toISOString() };
      await db.collection('products').insertOne(newProduct);
      return res.status(201).json(newProduct);
    } catch (error) {
      return res.status(500).json({ message: 'Error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
