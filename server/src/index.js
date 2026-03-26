const express = require('express');
const cors = require('cors');
const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');
const { connectMongo } = require('./db');
const poemRoutes = require('./routes/poemRoutes');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const clientDistPath = path.join(__dirname, '..', '..', 'client', 'dist');
const hasClientBuild = fs.existsSync(clientDistPath);
const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('CORS blocked for this origin.'));
  },
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ message: 'Open Poetry Library API is running.' });
});

app.use('/api/poems', poemRoutes);

if (hasClientBuild) {
  app.use(express.static(clientDistPath));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const MONGO_URI_DIRECT = process.env.MONGO_URI_DIRECT;

async function startServer() {
  try {
    await connectMongo(MONGO_URI);
    console.log('Connected to MongoDB using MONGO_URI.');

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    if (MONGO_URI_DIRECT && MONGO_URI_DIRECT !== MONGO_URI) {
      try {
        await connectMongo(MONGO_URI_DIRECT);
        console.log('Connected to MongoDB using MONGO_URI_DIRECT.');
        app.listen(PORT, () => {
          console.log(`Server listening on port ${PORT}`);
        });
        return;
      } catch (fallbackError) {
        console.error('Server startup failed:', fallbackError.message);
        process.exit(1);
      }
    }

    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
