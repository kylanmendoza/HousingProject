// src/routes/models/searchHistorySchema.js
const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  searchQuery: {
    type: String,
    trim: true
  },
  
  filters: {
    propertyType: String,
    minPrice: Number,
    maxPrice: Number,
    bedrooms: Number,
    bathrooms: Number,
    amenities: [String],
    location: String
  },
  
  resultsCount: {
    type: Number,
    default: 0
  },
  
  savedSearch: {
    type: Boolean,
    default: false
  },
  
  searchName: String,
  
  notificationsEnabled: {
    type: Boolean,
    default: false
  }
  
}, { 
  timestamps: true 
});

// Indexes
searchHistorySchema.index({ user: 1, createdAt: -1 });
searchHistorySchema.index({ user: 1, savedSearch: 1 });

module.exports = mongoose.model('SearchHistory', searchHistorySchema);