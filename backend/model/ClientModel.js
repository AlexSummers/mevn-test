const mongoose = require('mongoose');

const ClientModel = mongoose.model('Client', new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  providerIds: {
    type: Array,
  },
}, { timestamps: true }));

module.exports = ClientModel;
