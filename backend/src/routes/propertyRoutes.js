// src/routes/propertyRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  approveProperty,
  rejectProperty,
  getNearbyProperties
} = require('./controllers/propertyController');
const { protect, restrictTo, optionalAuth } = require('./middleware/authMiddleware');
const { 
  uploadPropertyImages, 
  handleUploadError, 
  processPropertyImages 
} = require('./middleware/uploadMiddleware');

// Public routes (with optional auth for personalization)
router.get('/', optionalAuth, getAllProperties);
router.get('/nearby/:lng/:lat', getNearbyProperties);
router.get('/:id', optionalAuth, getProperty);

// Protected routes - create property (any authenticated user)
router.post(
  '/', 
  protect, 
  uploadPropertyImages,
  handleUploadError,
  processPropertyImages,
  createProperty
);

// Admin only routes
router.put('/:id', protect, restrictTo('admin', 'superadmin'), updateProperty);
router.delete('/:id', protect, restrictTo('admin', 'superadmin'), deleteProperty);
router.put('/:id/approve', protect, restrictTo('admin', 'superadmin'), approveProperty);
router.put('/:id/reject', protect, restrictTo('admin', 'superadmin'), rejectProperty);

module.exports = router;