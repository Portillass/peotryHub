const dotenv = require('dotenv');
const path = require('path');
const app = require('./app');
const { connectMongo } = require('./db');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

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

startServer();
