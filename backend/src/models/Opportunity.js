const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  primaryContact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: false,
  },
  amount: {
    type: Number,
    required: false,
  },
  stage: {
    type: String,
    enum: ['Prospecting', 'Qualification', 'Needs Analysis', 'Value Proposition', 
           'Quote', 'Negotiation', 'Closed Won', 'Closed Lost'],
    default: 'Prospecting',
  },
  probability: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  expectedCloseDate: {
    type: Date,
    required: false,
  },
  description: {
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

module.exports = mongoose.model('Opportunity', OpportunitySchema);
