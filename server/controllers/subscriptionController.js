const Subscription = require('../models/Subscription');
const Email = require('../models/Email');

// Get all subscriptions for user
exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({
      userId: req.user.id
    }).sort({ updatedAt: -1 });

    res.json({
      success: true,
      subscriptions
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscriptions'
    });
  }
};

// Add or update subscription (called when receiving email)
exports.trackSubscription = async (req, res) => {
  try {
    const { senderEmail, senderName, category } = req.body;

    // Find or create subscription
    let subscription = await Subscription.findOne({
      userId: req.user.id,
      senderEmail: senderEmail.toLowerCase()
    });

    if (subscription) {
      // Update existing subscription
      subscription.emailCount += 1;
      subscription.lastEmailDate = new Date();
      subscription.updatedAt = new Date();
      if (senderName) subscription.senderName = senderName;
      if (category) subscription.category = category;
      await subscription.save();
    } else {
      // Create new subscription
      subscription = await Subscription.create({
        userId: req.user.id,
        senderEmail: senderEmail.toLowerCase(),
        senderName: senderName || '',
        category: category || 'other',
        lastEmailDate: new Date(),
        emailCount: 1
      });
    }

    res.json({
      success: true,
      subscription
    });
  } catch (error) {
    console.error('Track subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track subscription'
    });
  }
};

// Unsubscribe from a sender
exports.unsubscribe = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      userId: req.user.id
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    subscription.isActive = false;
    subscription.updatedAt = new Date();
    await subscription.save();

    res.json({
      success: true,
      message: 'Unsubscribed successfully',
      subscription
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe'
    });
  }
};

// Resubscribe to a sender
exports.resubscribe = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      userId: req.user.id
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    subscription.isActive = true;
    subscription.updatedAt = new Date();
    await subscription.save();

    res.json({
      success: true,
      message: 'Resubscribed successfully',
      subscription
    });
  } catch (error) {
    console.error('Resubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resubscribe'
    });
  }
};

// Delete subscription permanently
exports.deleteSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      userId: req.user.id
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    await subscription.deleteOne();

    res.json({
      success: true,
      message: 'Subscription deleted successfully'
    });
  } catch (error) {
    console.error('Delete subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete subscription'
    });
  }
};

// Auto-detect and track subscriptions from existing emails
exports.syncSubscriptions = async (req, res) => {
  try {
    // Get all emails for the user
    const emails = await Email.find({
      to: req.user.email
    }).populate('from', 'email firstName lastName');

    const senderMap = new Map();

    // Group emails by sender
    emails.forEach(email => {
      const senderEmail = email.from.email.toLowerCase();
      if (!senderMap.has(senderEmail)) {
        senderMap.set(senderEmail, {
          email: senderEmail,
          name: `${email.from.firstName} ${email.from.lastName}`,
          count: 0,
          lastDate: email.createdAt
        });
      }
      const sender = senderMap.get(senderEmail);
      sender.count += 1;
      if (email.createdAt > sender.lastDate) {
        sender.lastDate = email.createdAt;
      }
    });

    // Create or update subscriptions
    let created = 0;
    let updated = 0;

    for (const [senderEmail, data] of senderMap) {
      const existing = await Subscription.findOne({
        userId: req.user.id,
        senderEmail
      });

      if (existing) {
        existing.emailCount = data.count;
        existing.lastEmailDate = data.lastDate;
        existing.updatedAt = new Date();
        await existing.save();
        updated++;
      } else {
        await Subscription.create({
          userId: req.user.id,
          senderEmail,
          senderName: data.name,
          emailCount: data.count,
          lastEmailDate: data.lastDate
        });
        created++;
      }
    }

    res.json({
      success: true,
      message: `Synced subscriptions: ${created} created, ${updated} updated`,
      created,
      updated
    });
  } catch (error) {
    console.error('Sync subscriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync subscriptions'
    });
  }
};
