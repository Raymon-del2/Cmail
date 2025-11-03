const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  senderName: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['newsletter', 'promotional', 'social', 'updates', 'other'],
    default: 'other'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'occasional', 'unknown'],
    default: 'unknown'
  },
  lastEmailDate: {
    type: Date
  },
  emailCount: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure one subscription per sender per user
subscriptionSchema.index({ userId: 1, senderEmail: 1 }, { unique: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
