import express from 'express';

const router = express.Router();

// GET all contacts
router.get('/', async (req, res) => {
  try {
    if (req.db) {
      const contacts = await req.db.collection('contacts').find({}).toArray();
      res.json(contacts);
    } else {
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const dataFile = path.join(__dirname, '../data/contacts.json');
      const data = fs.readFileSync(dataFile, 'utf-8');
      res.json(JSON.parse(data));
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts' });
  }
});

// POST create contact
router.post('/', async (req, res) => {
  try {
    const newContact = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...req.body
    };

    if (req.db) {
      await req.db.collection('contacts').insertOne(newContact);
    } else {
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const dataFile = path.join(__dirname, '../data/contacts.json');
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
      data.push(newContact);
      fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    }

    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: 'Error creating contact' });
  }
});

// DELETE contact
router.delete('/:id', async (req, res) => {
  try {
    if (req.db) {
      const { ObjectId } = await import('mongodb');
      let result = await req.db.collection('contacts').deleteOne({ id: req.params.id });
      if (result.deletedCount === 0) {
        result = await req.db.collection('contacts').deleteOne({ _id: new ObjectId(req.params.id) });
      }
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Contact not found' });
      }
    } else {
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const dataFile = path.join(__dirname, '../data/contacts.json');
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
      const filtered = data.filter(c => c.id != req.params.id);
      if (data.length === filtered.length) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      fs.writeFileSync(dataFile, JSON.stringify(filtered, null, 2));
    }

    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact' });
  }
});

export default router;
