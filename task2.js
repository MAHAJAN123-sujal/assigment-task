const express = require('express');
const mongoose = require('mongoose');
const fetchCryptoData = require('./fetchTask2Data'); // Import your fetch function
const CryptoData = require('./models/CryptoData'); // Import your model
require('dotenv').config()

const app = express();
const PORT = 8000


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

// Fetch initial data (you can remove this if using cron)
fetchCryptoData();

// /stats endpoint
app.get('/stats', async (req, res) => {
  const { coin } = req.query;

  if (!coin) {
    return res.status(400).json({ error: 'Coin parameter is required.' });
  }

  const validCoins = ['bitcoin', 'matic-network', 'ethereum']; // Adjust based on your data
  if (!validCoins.includes(coin)) {
    return res.status(400).json({ error: 'Invalid coin name.' });
  }

  try {
    const latestData = await CryptoData.findOne({ id: coin }).sort({ last_updated: -1 });

    if (!latestData) {
      return res.status(404).json({ error: 'No data found for the requested coin.' });
    }

    res.json({
      price: latestData.current_price,
      marketCap: latestData.market_cap,
      "24hChange": latestData.price_change_percentage_24h,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
