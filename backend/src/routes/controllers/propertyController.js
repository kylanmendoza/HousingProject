// ### **8. Property Controller (propertyController.js)**
// src/routes/controllers/propertyController.js
const Property = require('../models/propertySchema');
const User = require('../models/usersSchema');

// @desc    Get all properties with filtering, pagination, sorting
// @route   GET /api/v1/properties
// @access  Public
exports.getAllProperties = async (req, res) => {
  try {
    const { 
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      amenities,
      available,
      search,
      sortBy,
      page = 1,
      limit = 20
    } = req.query;
    
    // Build query - only show approved properties to non-admins
    let query = {};
    
    // If user is admin, show all. Otherwise only approved
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
      query.status = 'approved';
      query.available = true;
    }
    
    // Filters
    if (propertyType) query.propertyType = propertyType;
    
    if (minPrice || maxPrice) {
      query.rent = {};
      if (minPrice) query.rent.$gte = Number(minPrice);
      if (maxPrice) query.rent.$lte = Number(maxPrice);
    }
    
    if (bedrooms) query.bedrooms = Number(bedrooms);
    if (bathrooms) query.bathrooms = { $gte: Number(bathrooms) };
    
    if (amenities) {
      const amenitiesArray = amenities.split(',');
      query.amenities = { $all: amenitiesArray };
    }
    
    if (available !== undefined) {
      query.available = available === 'true';
    }
    
    // Text search
    if (search) {
      query.$text = { $search: search };
    }
    
    // Sorting
    let sort = {};
    switch(sortBy) {
      case 'price-low':
        sort.rent = 1;
        break;
      case 'price-high':
        sort.rent = -1;
        break;
      case 'newest':
        sort.createdAt = -1;
        break;
      case 'bedrooms':
        sort.bedrooms = -1;
        break;
      case 'popular':
        sort.viewCount = -1;
        break;
      default:
        sort.createdAt = -1;
    }
    
    // Execute query with pagination
    const properties = await Property.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v')
      .lean();
    
    const count = await Property.countDocuments(query);
    
    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      data: properties
    });
    
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch properties',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single property
// @route   GET /api/v1/properties/:id
// @access  Public
exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('submittedBy', 'name email')
      .populate('approvedBy', 'name');
    
    if (!property) {
      return res.status(404).json({ 
        success: false,
        message: 'Property not found' 
      });
    }
    
    // Increment view count (don't await to not slow down response)
    property.viewCount += 1;
    property.save().catch(err => console.error('Failed to update view count:', err));
    
    res.json({
      success: true,
      data: property
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch property'
    });
  }
};

// @desc    Create new property
// @route   POST /api/v1/properties
// @access  Private (Admin) or Public with approval
exports.createProperty = async (req, res) => {
  try {
    const propertyData = { ...req.body };
    
    // Set submitter info
    if (req.user) {
      propertyData.submittedBy = req.user._id;
      propertyData.submitterEmail = req.user.email;
    }
    
    // Auto-approve if admin, otherwise pending
    if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
      propertyData.status = 'approved';
      propertyData.approvedBy = req.user._id;
      propertyData.approvedAt = Date.now();
    } else {
      propertyData.status = 'pending';
    }
    
    const property = await Property.create(propertyData);
    
    res.status(201).json({
      success: true,
      message: propertyData.status === 'approved' 
        ? 'Property created successfully' 
        : 'Property submitted for approval',
      data: property
    });
    
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create property',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update property
// @route   PUT /api/v1/properties/:id
// @access  Private (Admin)
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ 
        success: false,
        message: 'Property not found' 
      });
    }
    
    // Update fields
    Object.assign(property, req.body);
    await property.save();
    
    res.json({
      success: true,
      message: 'Property updated successfully',
      data: property
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to update property'
    });
  }
};

// @desc    Delete property
// @route   DELETE /api/v1/properties/:id
// @access  Private (Admin)
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ 
        success: false,
        message: 'Property not found' 
      });
    }
    
    await property.deleteOne();
    
    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete property'
    });
  }
};

// @desc    Approve property
// @route   PUT /api/v1/properties/:id/approve
// @access  Private (Admin)
exports.approveProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ 
        success: false,
        message: 'Property not found' 
      });
    }
    
    property.status = 'approved';
    property.approvedBy = req.user._id;
    property.approvedAt = Date.now();
    await property.save();
    
    // TODO: Send email notification to submitter
    
    res.json({
      success: true,
      message: 'Property approved successfully',
      data: property
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to approve property'
    });
  }
};

// @desc    Reject property
// @route   PUT /api/v1/properties/:id/reject
// @access  Private (Admin)
exports.rejectProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ 
        success: false,
        message: 'Property not found' 
      });
    }
    
    property.status = 'rejected';
    property.rejectionReason = req.body.reason;
    await property.save();
    
    // TODO: Send email notification to submitter
    
    res.json({
      success: true,
      message: 'Property rejected',
      data: property
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to reject property'
    });
  }
};

// @desc    Get nearby properties
// @route   GET /api/v1/properties/nearby/:lng/:lat
// @access  Public
exports.getNearbyProperties = async (req, res) => {
  try {
    const { lng, lat } = req.params;
    const maxDistance = req.query.maxDistance || 10000; // 10km default
    
    const properties = await Property.findNearby(
      Number(lng), 
      Number(lat), 
      Number(maxDistance)
    );
    
    res.json({
      success: true,
      count: properties.length,
      data: properties
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch nearby properties'
    });
  }
};


// **Continue in next message with remaining controllers and routes...**

// Would you like me to continue with:
// 1. Complete route files
// 2. Auth middleware
// 3. Upload middleware
// 4. `.env` template
// 5. Updated `server.js`?