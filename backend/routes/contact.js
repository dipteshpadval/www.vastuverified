const express = require('express');
const ContactMessage = require('../../src/models/ContactMessage');
const router = express.Router();

// Send contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message, propertyId } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are required'
      });
    }

    // Create contact message
    const contactMessage = new ContactMessage({
      name,
      email,
      phone,
      subject,
      message,
      propertyId
    });

    await contactMessage.save();

    // TODO: Send email notification to admin
    // TODO: Send auto-reply to user

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        id: contactMessage._id,
        status: contactMessage.status
      }
    });

  } catch (error) {
    console.error('Contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
});

// Get all contact messages (admin only)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const messages = await ContactMessage.find(filter)
      .populate('propertyId', 'title location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ContactMessage.countDocuments(filter);

    res.json({
      success: true,
      data: {
        messages,
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
});

// Update message status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!['new', 'contacted', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: message
    });

  } catch (error) {
    console.error('Update message status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
      error: error.message
    });
  }
});

module.exports = router;
