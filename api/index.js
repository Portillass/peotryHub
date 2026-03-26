const dotenv = require('dotenv');
const path = require('path');
const app = require('../server/src/index');
const { connectMongo } = require('../server/src/db');

dotenv.config({ path: path.join(__dirname, '..', 'server', '.env') });

module.exports = async (req, res) => {
  const primaryUri = process.env.MONGO_URI;
  const fallbackUri = process.env.MONGO_URI_DIRECT;

  try {
    try {
      await connectMongo(primaryUri || fallbackUri);
    } catch (error) {
      if (fallbackUri && primaryUri && primaryUri !== fallbackUri) {
        await connectMongo(fallbackUri);
      } else {
        throw error;
      }
    }

    return app(req, res);
  } catch (error) {
    console.error('API startup error:', error.message);
    return res.status(500).json({
      message: 'API failed to connect to database.',
      details:
        'Set MONGO_URI (and optional MONGO_URI_DIRECT) in Vercel project environment variables.',
      error: error.message,
    });
  }
};
