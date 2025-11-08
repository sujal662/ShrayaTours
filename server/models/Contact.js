const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: false },
  email: { type: String, required: true },
  address: { type: String },
  reason: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);
