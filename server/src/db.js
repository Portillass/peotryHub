const mongoose = require('mongoose');

let cachedConnection = null;
let connectingPromise = null;

async function connectMongo(uri) {
  if (!uri) {
    throw new Error('MongoDB connection string is missing.');
  }

  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  if (!connectingPromise) {
    connectingPromise = mongoose
      .connect(uri)
      .then((mongooseInstance) => {
        cachedConnection = mongooseInstance.connection;
        return cachedConnection;
      })
      .catch((error) => {
        connectingPromise = null;
        throw error;
      });
  }

  return connectingPromise;
}

module.exports = { connectMongo };
