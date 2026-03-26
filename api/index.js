const app = require('../server/src/app');
const { connectMongo } = require('../server/src/db');

module.exports = async (req, res) => {
  const primaryUri = process.env.MONGO_URI;
  const fallbackUri = process.env.MONGO_URI_DIRECT;

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
};
