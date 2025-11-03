const express = require('express');
const router = express.Router();
const {
  getSubscriptions,
  trackSubscription,
  unsubscribe,
  resubscribe,
  deleteSubscription,
  syncSubscriptions
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Subscription operations
router.get('/', getSubscriptions);
router.post('/track', trackSubscription);
router.post('/sync', syncSubscriptions);
router.patch('/:subscriptionId/unsubscribe', unsubscribe);
router.patch('/:subscriptionId/resubscribe', resubscribe);
router.delete('/:subscriptionId', deleteSubscription);

module.exports = router;
