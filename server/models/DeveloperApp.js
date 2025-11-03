const mongoose = require('mongoose');
const crypto = require('crypto');

const developerAppSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'App name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'App description is required']
  },
  website: {
    type: String,
    required: [true, 'Website URL is required']
  },
  logo: {
    type: String,
    default: ''
  },
  developer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clientId: {
    type: String,
    unique: true,
    required: true
  },
  clientSecret: {
    type: String,
    required: true
  },
  redirectUris: [{
    type: String,
    required: true
  }],
  scopes: [{
    type: String,
    enum: ['email', 'profile', 'read_emails', 'send_emails', 'manage_emails'],
    default: ['email', 'profile']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  usageCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate client ID and secret before saving
developerAppSchema.pre('save', function(next) {
  if (!this.clientId) {
    this.clientId = 'cmail_' + crypto.randomBytes(16).toString('hex');
  }
  if (!this.clientSecret) {
    this.clientSecret = 'secret_' + crypto.randomBytes(32).toString('hex');
  }
  next();
});

module.exports = mongoose.model('DeveloperApp', developerAppSchema);
