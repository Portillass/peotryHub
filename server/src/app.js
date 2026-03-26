const express = require('express');
const cors = require('cors');

const poemRoutes = require('./routes/poemRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ message: 'Open Poetry Library API is running.' });
});

app.use('/api/poems', poemRoutes);

module.exports = app;
