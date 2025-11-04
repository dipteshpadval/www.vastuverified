const express = require('express');
const Property = require('../models/Property');
const router = express.Router();

// Get all properties with filters
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 100, // Increased default limit
      type,
      transactionType,
      city,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      search,
      featured,
      verified
    } = req.query;

    // Build filter object
    const filter = {};

    if (type) filter.propertyType = type;
    if (transactionType) filter.transactionType = transactionType;
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    if (bedrooms) filter.bedrooms = parseInt(bedrooms);
    if (bathrooms) filter.bathrooms = parseInt(bathrooms);
    if (featured === 'true') filter.featured = true;
    if (verified === 'true') filter.verified = true;

    // Text search
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { 'location.address': new RegExp(search, 'i') },
        { 'location.city': new RegExp(search, 'i') }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get properties
    const properties = await Property.find(filter)
      .populate('owner.id', 'name email phone verified')
      .populate('agent.id', 'name email phone company verified')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Property.countDocuments(filter);

    // Transform properties to match frontend format
    const transformedProperties = properties.map(prop => {
      const propObj = prop.toObject();
      // Ensure id is string
      propObj.id = propObj._id.toString();
      return propObj;
    });

    res.json({
      success: true,
      data: {
        properties: transformedProperties,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: skip + properties.length < total
      }
    });

  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch properties',
      error: error.message
    });
  }
});

// Get single property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner.id', 'name email phone verified')
      .populate('agent.id', 'name email phone company verified');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Increment view count
    property.views += 1;
    await property.save();

    // Transform property to match frontend format
    const propObj = property.toObject();
    propObj.id = propObj._id.toString();

    res.json({
      success: true,
      data: propObj
    });

  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch property',
      error: error.message
    });
  }
});

// Create new property (requires authentication)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const propertyData = req.body;
    const userId = req.user.userId;

    // Validate required fields
    const requiredFields = ['title', 'description', 'price', 'area', 'bedrooms', 'bathrooms', 'propertyType', 'transactionType', 'location'];
    for (const field of requiredFields) {
      if (!propertyData[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    // Set owner from authenticated user
    const User = require('../models/User');
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    propertyData.owner = {
      id: userId,
      name: user.name,
      phone: user.phone,
      email: user.email,
      verified: user.verified
    };

    // Transform images array if needed
    if (propertyData.images && Array.isArray(propertyData.images)) {
      propertyData.images = propertyData.images.map(img => {
        if (typeof img === 'string') {
          return { url: img, alt: '', type: 'gallery' };
        }
        return img;
      });
    }

    const property = new Property(propertyData);
    await property.save();

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property
    });

  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create property',
      error: error.message
    });
  }
});

// Update property (requires authentication - only owner can update)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if user is the owner
    if (property.owner.id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own properties'
      });
    }

    // Transform images array if needed
    if (req.body.images && Array.isArray(req.body.images)) {
      req.body.images = req.body.images.map(img => {
        if (typeof img === 'string') {
          return { url: img, alt: '', type: 'gallery' };
        }
        return img;
      });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: updatedProperty
    });

  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update property',
      error: error.message
    });
  }
});

// Delete property (requires authentication - only owner can delete)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if user is the owner
    if (property.owner.id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own properties'
      });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });

  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete property',
      error: error.message
    });
  }
});

// Search properties by location (geospatial)
router.get('/search/location', async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const properties = await Property.find({
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius) * 1000 // Convert km to meters
        }
      }
    })
    .populate('owner.id', 'name email phone verified')
    .populate('agent.id', 'name email phone company verified')
    .limit(20);

    res.json({
      success: true,
      data: properties
    });

  } catch (error) {
    console.error('Location search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search properties by location',
      error: error.message
    });
  }
});

// Get featured properties
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const properties = await Property.find({ featured: true, verified: true })
      .populate('owner.id', 'name email phone verified')
      .populate('agent.id', 'name email phone company verified')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: properties
    });

  } catch (error) {
    console.error('Get featured properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured properties',
      error: error.message
    });
  }
});

// Get user's properties (requires authentication)
router.get('/user/my-properties', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const properties = await Property.find({ 'owner.id': userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: properties
    });

  } catch (error) {
    console.error('Get user properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user properties',
      error: error.message
    });
  }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  const jwt = require('jsonwebtoken');
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
}

module.exports = router;
