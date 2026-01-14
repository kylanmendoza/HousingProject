// src/routes/models/contactRequestSchema.js
const mongoose = require('mongoose');

const contactRequestSchema = new mongoose.Schema({
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
  
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  
  contactMethod: {
    type: String,
    enum: ['email', 'phone', 'either'],
    default: 'email'
  },
  
  phoneNumber: String,
  
  preferredContactTime: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'anytime'],
    default: 'anytime'
  },
  
  status: {
    type: String,
    enum: ['pending', 'contacted', 'closed', 'spam'],
    default: 'pending'
  },
  
  adminNotes: String,
  
  respondedAt: Date,
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
  
}, { 
  timestamps: true 
});

// Indexes
contactRequestSchema.index({ user: 1, createdAt: -1 });
contactRequestSchema.index({ property: 1, createdAt: -1 });
contactRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('ContactRequest', contactRequestSchema);