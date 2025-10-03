const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  pricePerSqft: {
    type: Number,
    min: 0
  },
  area: {
    type: Number,
    required: true,
    min: 0
  },
  bedrooms: {
    type: Number,
    required: true,
    min: 0
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 0
  },
  propertyType: {
    type: String,
    required: true,
    enum: ['apartment', 'house', 'villa', 'plot', 'commercial']
  },
  transactionType: {
    type: String,
    required: true,
    enum: ['buy', 'rent', 'sell']
  },
  location: {
    address: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    pincode: {
      type: String,
      required: true,
      trim: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere' // Geospatial index
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      enum: ['gallery', 'floor_plan', 'virtual_tour'],
      default: 'gallery'
    }
  }],
  amenities: [String],
  features: [String],
  age: {
    type: Number,
    default: 0,
    min: 0
  },
  floor: {
    type: Number,
    min: 0
  },
  totalFloors: {
    type: Number,
    min: 0
  },
  furnishing: {
    type: String,
    enum: ['furnished', 'semi-furnished', 'unfurnished'],
    default: 'unfurnished'
  },
  parking: {
    type: Number,
    default: 0,
    min: 0
  },
  balcony: {
    type: Number,
    default: 0,
    min: 0
  },
  owner: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  agent: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    phone: String,
    email: String,
    company: String,
    verified: {
      type: Boolean,
      default: false
    }
  },
  featured: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  virtualTour: {
    type: String,
    default: ''
  },
  floorPlan: {
    type: String,
    default: ''
  },
  nearbyPlaces: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['school', 'hospital', 'metro', 'mall', 'restaurant'],
      required: true
    },
    distance: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better performance
propertySchema.index({ propertyType: 1, transactionType: 1 });
propertySchema.index({ 'location.city': 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ bedrooms: 1, bathrooms: 1 });
propertySchema.index({ featured: 1, verified: 1 });
propertySchema.index({ 'location.coordinates': '2dsphere' }); // Geospatial index
propertySchema.index({ title: 'text', description: 'text' }); // Text search index

module.exports = mongoose.model('Property', propertySchema);
