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

  // Get all contacts
  if (req.method === 'GET') {
    try {
      const contacts = await db.collection('contacts').find({}).toArray();
      return res.status(200).json(contacts);
    } catch (error) {
      return res.status(200).json([]);
    }
  }

  // Create contact
  if (req.method === 'POST') {
    try {
      const newContact = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date().toISOString()
      };
      await db.collection('contacts').insertOne(newContact);
      return res.status(201).json(newContact);
    } catch (error) {
      return res.status(500).json({ message: 'Error creating contact' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
