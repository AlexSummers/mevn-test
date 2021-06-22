const mongoose = require('mongoose');

const ProviderModel = mongoose.model('Provider', new mongoose.Schema({
  name: {
    type: String,
  },
}, { timestamps: true }));

module.exports = ProviderModel;
