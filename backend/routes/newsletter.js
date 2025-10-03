const express = require('express');
const NewsletterSubscription = require('../../src/models/NewsletterSubscription');
const router = express.Router();

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email, preferences = {} } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if already subscribed
    const existingSubscription = await NewsletterSubscription.findOne({ email });
    
    if (existingSubscription) {
      if (existingSubscription.status === 'active') {
        return res.status(400).json({
          success: false,
          message: 'Email is already subscribed'
        });
      } else {
        // Reactivate subscription
        existingSubscription.status = 'active';
        existingSubscription.preferences = preferences;
        await existingSubscription.save();

        return res.json({
          success: true,
          message: 'Successfully resubscribed to newsletter',
          data: existingSubscription
        });
      }
    }

    // Create new subscription
    const subscription = new NewsletterSubscription({
      email,
      preferences
    });

    await subscription.save();

    // TODO: Send welcome email
    // TODO: Add to email marketing service

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: subscription
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to newsletter',
      error: error.message
    });
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const subscription = await NewsletterSubscription.findOne({ email });
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in subscription list'
      });
    }

    subscription.status = 'unsubscribed';
    await subscription.save();

    // TODO: Send unsubscribe confirmation email

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe from newsletter',
      error: error.message
    });
  }
});

// Get all subscriptions (admin only)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const subscriptions = await NewsletterSubscription.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await NewsletterSubscription.countDocuments(filter);

    res.json({
      success: true,
      data: {
        subscriptions,
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get newsletter subscriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscriptions',
      error: error.message
    });
  }
});

// Get subscription statistics (admin only)
router.get('/stats', async (req, res) => {
  try {
    const total = await NewsletterSubscription.countDocuments();
    const active = await NewsletterSubscription.countDocuments({ status: 'active' });
    const unsubscribed = await NewsletterSubscription.countDocuments({ status: 'unsubscribed' });

    // Get recent subscriptions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recent = await NewsletterSubscription.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.json({
      success: true,
      data: {
        total,
        active,
        unsubscribed,
        recent
      }
    });

  } catch (error) {
    console.error('Get newsletter stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

module.exports = router;
