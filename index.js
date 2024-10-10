const cron = require('node-cron');
const connectDB = require('./db');
const fetchCryptoData = require('./fetchCryptoData');

connectDB();

// for initial fetch
fetchCryptoData();

//  to run after every 2 hours
cron.schedule('0 */2 * * *', async () => {
  console.log('Fetching cryptocurrency data...');
  await fetchCryptoData();
});

console.log('Background job is running...');
