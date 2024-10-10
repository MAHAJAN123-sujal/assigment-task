const axios = require('axios');
const CryptoData = require('./models/CryptoData'); // Ensure you require your model

const fetchCryptoData = async () => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 3,
        page: 1,
        sparkline: false,
      },
    });

    const cryptoData = response.data;

    for (const coin of cryptoData) {
      const newCryptoData = new CryptoData({
        id: coin.id,
        current_price: coin.current_price,
        market_cap: coin.market_cap,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        last_updated: new Date(),
      });

      await newCryptoData.save();
    }
  } catch (error) {
    console.error('Error fetching cryptocurrency data:', error);
  }
};

module.exports = fetchCryptoData;
