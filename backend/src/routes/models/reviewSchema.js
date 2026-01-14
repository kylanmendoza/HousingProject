// src/routes/models/reviewSchema.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
  
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  
  review: {
    type: String,
    required: [true, 'Review text is required'],
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  },
  
  pros: [String],
  cons: [String],
  
  // Moderation
  approved: {
    type: Boolean,
    default: false
  },
  
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  moderatedAt: Date,
  
  rejectionReason: String,
  
  // Helpful votes
  helpfulVotes: {
    type: Number,
    default: 0
  },
  
  notHelpfulVotes: {
    type: Number,
    default: 0
  },
  
  votedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    vote: {
      type: String,
      enum: ['helpful', 'notHelpful']
    }
  }]
  
}, { 
  timestamps: true 
});

// Compound index - one review per user per property
reviewSchema.index({ user: 1, property: 1 }, { unique: true });
reviewSchema.index({ property: 1, approved: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);