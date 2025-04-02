const mongoose = require('mongoose');

const CallLogSchema = new mongoose.Schema({
  callType: {
    type: String,
    enum: ['Incoming', 'Outgoing', 'Missed'],
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: false,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: false, 
  },
  duration: {
    type: Number, // in seconds
    required: false,
  },
  notes: {
    type: String,
    required: false,
  },
  recordingUrl: {
    type: String,
    required: false,
  },
  callOutcome: {
    type: String,
    enum: ['Answered', 'Voicemail', 'No Answer', 'Busy', 'Failed', 'Completed'],
    required: false,
  },
});

module.exports = mongoose.model('CallLog', CallLogSchema);
