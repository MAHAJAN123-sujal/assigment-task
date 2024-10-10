const axios = require('axios');
const Crypto = require('./models/Crypto');

const fetchCryptoData = async () => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        ids: 'bitcoin,ethereum,matic-network'
      }
    });

    console.log('API Response:', response.data);

    const data = response.data;
    data.forEach(async (crypto) => {
      const { id, current_price, market_cap, price_change_percentage_24h } = crypto;

      const cryptoData = new Crypto({
        name: id,
        price_usd: current_price,
        market_cap_usd: market_cap,
        change_24h: price_change_percentage_24h,
      });

      await cryptoData.save();
      console.log(`Saved ${id} data to the database`);
    });
  } catch (err) {
    console.error('Error fetching data from CoinGecko:', err);
  }
};

module.exports = fetchCryptoData;
