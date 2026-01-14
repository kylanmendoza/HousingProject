// src/routes/favoriteRoutes.js
const express = require('express');
const router = express.Router();
const Favorite = require('./models/favoriteSchema');
const Property = require('./models/propertySchema');
const { protect } = require('./middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// @desc    Get user's favorites
// @route   GET /api/v1/favorites
// @access  Private
router.get('/', async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate('property')
      .sort('-createdAt');
    
    res.json({
      success: true,
      count: favorites.length,
      data: favorites
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch favorites' 
    });
  }
});

// @desc    Add property to favorites
// @route   POST /api/v1/favorites/:propertyId
// @access  Private
router.post('/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    
    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ 
        success: false,
        message: 'Property not found' 
      });
    }
    
    // Check if already favorited
    const existing = await Favorite.findOne({
      user: req.user._id,
      property: propertyId
    });
    
    if (existing) {
      return res.status(400).json({ 
        success: false,
        message: 'Property already in favorites' 
      });
    }
    
    // Create favorite
    const favorite = await Favorite.create({
      user: req.user._id,
      property: propertyId,
      notes: req.body.notes,
      tags: req.body.tags
    });
    
    // Update property favorite count
    property.favoriteCount += 1;
    await property.save();
    
    res.status(201).json({
      success: true,
      message: 'Property added to favorites',
      data: favorite
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to add favorite' 
    });
  }
});

// @desc    Remove property from favorites
// @route   DELETE /api/v1/favorites/:propertyId
// @access  Private
router.delete('/:propertyId', async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      property: req.params.propertyId
    });
    
    if (!favorite) {
      return res.status(404).json({ 
        success: false,
        message: 'Favorite not found' 
      });
    }
    
    // Update property favorite count
    await Property.findByIdAndUpdate(
      req.params.propertyId,
      { $inc: { favoriteCount: -1 } }
    );
    
    res.json({
      success: true,
      message: 'Property removed from favorites'
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to remove favorite' 
    });
  }
});

// @desc    Update favorite notes/tags
// @route   PUT /api/v1/favorites/:propertyId
// @access  Private
router.put('/:propertyId', async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndUpdate(
      { user: req.user._id, property: req.params.propertyId },
      { notes: req.body.notes, tags: req.body.tags },
      { new: true, runValidators: true }
    );
    
    if (!favorite) {
      return res.status(404).json({ 
        success: false,
        message: 'Favorite not found' 
      });
    }
    
    res.json({
      success: true,
      data: favorite
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to update favorite' 
    });
  }
});

module.exports = router;