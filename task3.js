require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const CryptoData = require('./models/CryptoData'); // Assuming you already have this model

const app = express();
const PORT = 8000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

// Function to calculate standard deviation
function calculateStandardDeviation(prices) {
  const mean = prices.reduce((acc, price) => acc + price, 0) / prices.length;
  const variance = prices.reduce((acc, price) => acc + Math.pow(price - mean, 2), 0) / prices.length;
  return Math.sqrt(variance);
}

// /deviation endpoint
app.get('/deviation', async (req, res) => {
    const { coin } = req.query;
  
    if (!coin) {
      return res.status(400).json({ error: 'Coin parameter is required.' });
    }
  
    const validCoins = ['bitcoin', 'matic-network', 'ethereum'];
    if (!validCoins.includes(coin)) {
      return res.status(400).json({ error: 'Invalid coin name.' });
    }
  
    try {
      // Fetch the latest 100 records for the requested coin
      const records = await CryptoData.find({ id: coin }).sort({ last_updated: -1 }).limit(100);
  
      if (records.length === 0) {
        return res.status(404).json({ error: 'No data found for the requested coin.' });
      }
  
      // Extract the prices from the records
      const prices = records.map(record => record.current_price);
  
      // Debug: Print the prices to the console
      console.log("Fetched prices:", prices);
  
      // Calculate the standard deviation
      const deviation = calculateStandardDeviation(prices);
  
      // Return the result
      res.json({ deviation: deviation.toFixed(2) });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  });  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
