// src/routes/models/favoriteSchema.js
const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'House',
    required: true
  },
  
  notes: {
    type: String,
    maxlength: 500
  },
  
  tags: [{
    type: String,
    trim: true
  }]
  
}, { 
  timestamps: true 
});

// Compound index to ensure user can't favorite same property twice
favoriteSchema.index({ user: 1, property: 1 }, { unique: true });

// Index for querying user's favorites
favoriteSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Favorite', favoriteSchema);