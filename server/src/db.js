const mongoose = require('mongoose');

async function connectMongo(uri) {
  if (!uri) {
    throw new Error('MongoDB connection string is missing.');
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(uri);
}

module.exports = { connectMongo };
