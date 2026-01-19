const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: [{
    type: String, // Email addresses
    required: true
  }],
  cc: [{
    type: String
  }],
  bcc: [{
    type: String
  }],
  subject: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    default: ''
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isStarred: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  isTrashed: {
    type: Boolean,
    default: false
  },
  isDraft: {
    type: Boolean,
    default: false
  },
  isImportant: {
    type: Boolean,
    default: false
  },
  isSnoozed: {
    type: Boolean,
    default: false
  },
  snoozeUntil: {
    type: Date
  },
  isScheduled: {
    type: Boolean,
    default: false
  },
  scheduledFor: {
    type: Date
  },
  isSpam: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['primary', 'social', 'promotions', 'purchases'],
    default: 'primary'
  },
  labels: [{
    type: String
  }],
  attachments: [{
    filename: String,
    url: String,
    size: Number
  }],
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Email'
  },
  threadId: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster queries
emailSchema.index({ from: 1, createdAt: -1 });
emailSchema.index({ to: 1, createdAt: -1 });
emailSchema.index({ isRead: 1 });
emailSchema.index({ isStarred: 1 });
emailSchema.index({ isTrashed: 1 });

module.exports = mongoose.model('Email', emailSchema);
