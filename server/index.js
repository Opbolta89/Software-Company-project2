import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';
import contactsRouter from './routes/contacts.js';

dotenv.config();

const app = express();
const PORT = 5000;

// MongoDB Connection - Add your connection string here
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://user1:MONGO_URI=mongodb+srv://user1:Nikhil123%40%24@cluster0.paw3hdt.mongodb.net/?appName=Cluster0'

let db;

async function connectToMongoDB() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db();
    console.log('Connected to MongoDB Atlas');

    // Create indexes for better performance
    await db.collection('products').createIndex({ name: 'text', description: 'text' });
    await db.collection('products').createIndex({ category: 1 });
    await db.collection('products').createIndex({ store: 1 });

    return client;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log('\n=== SETUP INSTRUCTIONS ===');
    console.log('1. Go to https://www.mongodb.com/atlas/database');
    console.log('2. Create a free account and cluster');
    console.log('3. Get your connection string');
    console.log('4. Set MONGO_URI environment variable or update index.js');
    console.log('========================\n');
    // Fall back to JSON file if MongoDB not available
    return null;
  }
}

// Middleware
app.use(cors());
app.use(express.json());

// Make db available to routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/contacts', contactsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: db ? 'MongoDB' : 'JSON File' });
});

async function startServer() {
  await connectToMongoDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

export default app;
