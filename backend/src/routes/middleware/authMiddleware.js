// src/routes/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/usersSchema');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // If no token found
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized to access this route. Please log in.' 
      });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          message: 'User no longer exists' 
        });
      }
      
      // Check if user's email is verified
      if (!req.user.verified) {
        return res.status(403).json({ 
          success: false,
          message: 'Please verify your email to access this resource' 
        });
      }
      
      next();
      
    } catch (error) {
      return res.status(401).json({ 
        success: false,
        message: 'Token is invalid or has expired' 
      });
    }
    
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Authentication failed' 
    });
  }
};

// Optional authentication - doesn't fail if no token
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
      } catch (error) {
        // Token invalid but don't block request
        req.user = null;
      }
    }
    
    next();
    
  } catch (error) {
    next();
  }
};

// Restrict to specific roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized' 
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route` 
      });
    }
    
    next();
  };
};

// Check if user owns the resource
exports.checkOwnership = (model) => {
  return async (req, res, next) => {
    try {
      const resource = await model.findById(req.params.id);
      
      if (!resource) {
        return res.status(404).json({ 
          success: false,
          message: 'Resource not found' 
        });
      }
      
      // Check if user is owner or admin
      const isOwner = resource.user && resource.user.toString() === req.user._id.toString();
      const isAdmin = req.user.role === 'admin' || req.user.role === 'superadmin';
      
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ 
          success: false,
          message: 'Not authorized to access this resource' 
        });
      }
      
      req.resource = resource;
      next();
      
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: 'Authorization check failed' 
      });
    }
  };
};