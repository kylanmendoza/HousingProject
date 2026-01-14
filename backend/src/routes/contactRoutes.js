// src/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const ContactRequest = require('./models/contactRequestSchema');
const Property = require('./models/propertySchema');
const { protect, restrictTo } = require('./middleware/authMiddleware');

// @desc    Create contact request
// @route   POST /api/v1/contacts
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { propertyId, message, contactMethod, phoneNumber, preferredContactTime } = req.body;
    
    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ 
        success: false,
        message: 'Property not found' 
      });
    }
    
    // Create contact request
    const contactRequest = await ContactRequest.create({
      user: req.user._id,
      property: propertyId,
      message,
      contactMethod,
      phoneNumber,
      preferredContactTime
    });
    
    // Update property contact count
    property.contactRequestCount += 1;
    await property.save();
    
    // TODO: Send email notification to property owner/admin
    
    res.status(201).json({
      success: true,
      message: 'Contact request submitted successfully',
      data: contactRequest
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to submit contact request' 
    });
  }
});

// @desc    Get user's contact requests
// @route   GET /api/v1/contacts
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const contacts = await ContactRequest.find({ user: req.user._id })
      .populate('property')
      .sort('-createdAt');
    
    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch contact requests' 
    });
  }
});

// @desc    Get single contact request
// @route   GET /api/v1/contacts/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const contact = await ContactRequest.findById(req.params.id)
      .populate('property')
      .populate('user', 'name email phone');
    
    if (!contact) {
      return res.status(404).json({ 
        success: false,
        message: 'Contact request not found' 
      });
    }
    
    // Check ownership or admin
    const isOwner = contact.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin' || req.user.role === 'superadmin';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized' 
      });
    }
    
    res.json({
      success: true,
      data: contact
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch contact request' 
    });
  }
});

// @desc    Update contact request status (Admin only)
// @route   PUT /api/v1/contacts/:id/status
// @access  Private (Admin)
router.put('/:id/status', protect, restrictTo('admin', 'superadmin'), async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    const contact = await ContactRequest.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ 
        success: false,
        message: 'Contact request not found' 
      });
    }
    
    contact.status = status;
    if (adminNotes) contact.adminNotes = adminNotes;
    
    if (status === 'contacted') {
      contact.respondedAt = Date.now();
      contact.respondedBy = req.user._id;
    }
    
    await contact.save();
    
    res.json({
      success: true,
      message: 'Contact request updated',
      data: contact
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to update contact request' 
    });
  }
});

// @desc    Get all contact requests (Admin only)
// @route   GET /api/v1/contacts/admin/all
// @access  Private (Admin)
router.get('/admin/all', protect, restrictTo('admin', 'superadmin'), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    
    const contacts = await ContactRequest.find(query)
      .populate('user', 'name email phone')
      .populate('property', 'title address rent')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await ContactRequest.countDocuments(query);
    
    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      data: contacts
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch contact requests' 
    });
  }
});

module.exports = router;