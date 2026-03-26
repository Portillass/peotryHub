const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const poemRoutes = require('./routes/poemRoutes');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const MONGO_URI_DIRECT = process.env.MONGO_URI_DIRECT;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ message: 'Open Poetry Library API is running.' });
});

app.use('/api/poems', poemRoutes);

function isSrvLookupError(error) {
  return (
    error?.code === 'ECONNREFUSED' &&
    typeof error?.message === 'string' &&
    error.message.includes('querySrv')
  );
}

async function connectToMongo() {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is missing. Add it to server/.env');
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB using MONGO_URI.');
  } catch (error) {
    if (isSrvLookupError(error) && MONGO_URI_DIRECT) {
      console.warn(
        'SRV DNS lookup failed for MONGO_URI. Retrying with MONGO_URI_DIRECT...'
      );
      await mongoose.connect(MONGO_URI_DIRECT);
      console.log('Connected to MongoDB using MONGO_URI_DIRECT.');
      return;
    }

    throw error;
  }
}

async function startServer() {
  try {
    await connectToMongo();

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    if (isSrvLookupError(error)) {
      console.error(
        'Server startup failed: MongoDB SRV lookup was blocked. Use MONGO_URI_DIRECT in server/.env as a fallback.'
      );
    } else {
      console.error('Server startup failed:', error.message);
    }
    process.exit(1);
  }
}

startServer();
