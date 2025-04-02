const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: false,
  },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Waiting for Customer', 'Resolved', 'Closed'],
    default: 'New',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },
  origin: {
    type: String,
    enum: ['Phone', 'Email', 'Web', 'Other'],
    default: 'Phone',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  callRecord: {
    recordingUrl: String,
    duration: Number,
    callTime: Date,
  },
});

module.exports = mongoose.model('Case', CaseSchema);
