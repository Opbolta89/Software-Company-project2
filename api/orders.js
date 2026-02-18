const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://user1:Nikhil123%40%24@cluster0.paw3hdt.mongodb.net/?appName=Cluster0';
const DB_NAME = process.env.MONGO_DB_NAME || 'Cluster0';

async function getDb() {
  const { MongoClient } = await import('mongodb');
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  return client.db(DB_NAME);
}

export default async function handler(req, res) {
  let db;
  try {
    db = await getDb();
  } catch (error) {
    console.error('DB Error:', error.message);
    return res.status(200).json([]);
  }

  // Get all orders
  if (req.method === 'GET' && !req.query.id) {
    try {
      const orders = await db.collection('orders').find({}).toArray();
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(200).json([]);
    }
  }

  // Create order
  if (req.method === 'POST') {
    try {
      const newOrder = {
        id: Date.now().toString(),
        ...req.body,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      await db.collection('orders').insertOne(newOrder);
      return res.status(201).json(newOrder);
    } catch (error) {
      return res.status(500).json({ message: 'Error creating order' });
    }
  }

  // Update order
  if (req.method === 'PUT') {
    try {
      await db.collection('orders').updateOne(
        { id: req.query.id },
        { $set: { status: req.body.status, updatedAt: new Date().toISOString() } }
      );
      return res.status(200).json({ message: 'Order updated' });
    } catch (error) {
      return res.status(500).json({ message: 'Error updating order' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
