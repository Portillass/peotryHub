const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const poemRoutes = require('./routes/poemRoutes');

const app = express();
const clientDistPath = path.join(__dirname, '..', '..', 'client', 'dist');
const hasClientBuild = fs.existsSync(clientDistPath);

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ message: 'Open Poetry Library API is running.' });
});

app.use('/api/poems', poemRoutes);

if (hasClientBuild) {
  app.use(express.static(clientDistPath));

  // Serve React app for all non-API routes.
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

module.exports = app;
