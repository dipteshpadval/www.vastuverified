const express = require('express');
const Property = require('../../src/models/Property');
const router = express.Router();

// Get all properties with filters
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
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

    res.json({
      success: true,
      data: {
        properties,
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

    res.json({
      success: true,
      data: property
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

// Create new property
router.post('/', async (req, res) => {
  try {
    const propertyData = req.body;

    // Validate required fields
    const requiredFields = ['title', 'description', 'price', 'area', 'bedrooms', 'bathrooms', 'propertyType', 'transactionType', 'location', 'owner'];
    for (const field of requiredFields) {
      if (!propertyData[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
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

// Update property
router.put('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: property
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

// Delete property
router.delete('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

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

module.exports = router;
