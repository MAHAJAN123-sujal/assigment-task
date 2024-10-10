const mongoose = require('mongoose');

const CryptoSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true
    },
    price_usd: {
        type: Number,
        required: true 
    },
    market_cap_usd: {
        type: Number,
        required: true 
    },
    change_24h: { 
        type: Number,
        required: true
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
});

module.exports = mongoose.model('Crypto', CryptoSchema);
