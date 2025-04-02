const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ['Customer', 'Partner', 'Supplier'],
    default: 'Customer',
  },
  organizationNumber: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  phone: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  website: {
    type: String,
    required: false,
  },
  address: {
    street: String,
    postalCode: String,
    city: String,
    country: { type: String, default: 'Sweden' },
  },
  industry: {
    type: String,
    required: false,
  },
  sniCode: {
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
});

module.exports = mongoose.model('Account', AccountSchema);
