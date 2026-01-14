// src/routes/models/propertySchema.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const HouseSchema = new Schema({
  // Basic Info
  title: { 
    type: String, 
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  description: { 
    type: String,
    required: [true, 'Property description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  // Address - keeping your existing structure
  address: { 
    type: String, 
    required: [true, 'Address is required'],
    trim: true
  },
  
  unitNumber: { 
    type: String,
    trim: true
  },
  
  // Location for geospatial queries
  location: {
    type: { 
      type: String, 
      enum: ['Point'], 
      default: 'Point' 
    },
    coordinates: { 
      type: [Number],  // [longitude, latitude]
      required: false
    }
  },
  
  // Keep your existing lat/lng for compatibility
  lat: { type: Number },
  lng: { type: Number },
  
  // Property Details
  propertyType: { 
    type: String, 
    enum: ['apartment', 'house', 'condo', 'townhome'],
    default: 'apartment'
  },
  
  bedrooms: { 
    type: Number, 
    required: [true, 'Number of bedrooms is required'],
    min: [0, 'Bedrooms cannot be negative']
  },
  
  bathrooms: { 
    type: Number, 
    required: [true, 'Number of bathrooms is required'],
    min: [0, 'Bathrooms cannot be negative']
  },
  
  squareFootage: { 
    type: Number,
    min: [0, 'Square footage cannot be negative']
  },
  
  rent: { 
    type: Number, 
    required: [true, 'Rent amount is required'],
    min: [0, 'Rent cannot be negative']
  },
  
  // Images
  images: [{ 
    url: { type: String, required: true },
    isPrimary: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    caption: String
  }],
  
  // Amenities
  amenities: [{ 
    type: String,
    enum: [
      'parking',
      'laundry',
      'petFriendly',
      'furnished',
      'utilitiesIncluded',
      'gym',
      'pool',
      'dishwasher',
      'airConditioning',
      'heating',
      'balcony',
      'storage',
      'elevator'
    ]
  }],
  
  // Availability
  available: { 
    type: Boolean, 
    required: true, 
    default: true 
  },
  
  dateAvailable: { 
    type: Date,
    default: Date.now
  },
  
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'archived'],
    default: 'pending'
  },
  
  // Landlord Info
  landlord: {
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { 
      type: String, 
      lowercase: true,
      trim: true
    }
  },
  
  // Additional Details
  distanceToHospital: { 
    type: Number,  // in miles
    min: 0
  },
  
  utilitiesIncluded: { type: Boolean, default: false },
  petPolicy: { 
    type: String,
    enum: ['allowed', 'notAllowed', 'catsOnly', 'dogsOnly', 'withDeposit'],
    default: 'notAllowed'
  },
  
  parkingSpaces: { 
    type: Number,
    min: 0,
    default: 0
  },
  
  leaseTerms: { 
    type: String,
    enum: ['monthToMonth', '6months', '1year', 'flexible'],
    default: 'flexible'
  },
  
  // Admin/Assignment
  assignedEmployeeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  
  submitterEmail: { 
    type: String, 
    required: [true, 'Submitter email is required'],
    lowercase: true,
    trim: true
  },
  
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  approvedAt: Date,
  
  rejectionReason: String,
  
  // Analytics
  viewCount: { type: Number, default: 0 },
  favoriteCount: { type: Number, default: 0 },
  contactRequestCount: { type: Number, default: 0 },
  
  // Metadata
  featured: { type: Boolean, default: false },
  verified: { type: Boolean, default: false }
  
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
HouseSchema.index({ location: '2dsphere' }); // Geospatial queries
HouseSchema.index({ status: 1, available: 1, rent: 1 }); // Filter queries
HouseSchema.index({ createdAt: -1 }); // Recent listings
HouseSchema.index({ '$**': 'text' }); // Full-text search
HouseSchema.index({ assignedEmployeeId: 1 });
HouseSchema.index({ submitterEmail: 1 });

// Pre-save middleware to sync location with lat/lng
HouseSchema.pre('save', function(next) {
  if (this.lat && this.lng) {
    this.location = {
      type: 'Point',
      coordinates: [this.lng, this.lat] // [longitude, latitude]
    };
  }
  next();
});

// Virtual for formatted rent
HouseSchema.virtual('rentFormatted').get(function() {
  return `$${this.rent.toLocaleString()}/month`;
});

// Virtual for primary image
HouseSchema.virtual('primaryImage').get(function() {
  if (!this.images || this.images.length === 0) return null;
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : this.images[0].url;
});

// Method to increment view count
HouseSchema.methods.incrementViews = function() {
  this.viewCount += 1;
  return this.save();
};

// Static method to find nearby properties
HouseSchema.statics.findNearby = function(lng, lat, maxDistance = 10000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        $maxDistance: maxDistance // in meters
      }
    },
    status: 'approved',
    available: true
  });
};

module.exports = mongoose.model('House', HouseSchema);