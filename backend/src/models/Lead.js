const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  phone: {
    type: String,
    required: false,
  },
  company: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Disqualified', 'Converted'],
    default: 'New',
  },
  source: {
    type: String,
    required: false,
  },
  notes: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  nixRegistered: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model('Lead', LeadSchema);
