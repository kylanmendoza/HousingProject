// src/routes/models/usersSchema.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  employeeId: { 
    type: String, 
    required: [true, 'Employee ID is required'],
    unique: true,
    trim: true
  },
  
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true
  },
  
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/@bozemanhealth\.org$/, 'Must use Bozeman Health email']
  },
  
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't return password by default
  },
  
  role: { 
    type: String, 
    enum: ['employee', 'provider', 'admin', 'superadmin'],
    default: 'employee'
  },
  
  department: { type: String, trim: true },
  phone: { type: String, trim: true },
  
  employeeType: { 
    type: String, 
    enum: ['staff', 'provider'],
    default: 'staff'
  },
  
  // Email Verification
  verified: { type: Boolean, default: false },
  verificationToken: String,
  verificationExpires: Date,
  
  // Password Reset
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Security
  refreshTokens: [{ 
    token: String,
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date
  }],
  
  failedLoginAttempts: { type: Number, default: 0 },
  accountLockedUntil: Date,
  lastLogin: Date,
  
  // User Preferences
  emailNotifications: { type: Boolean, default: true },
  newPropertyAlerts: { type: Boolean, default: true },
  
  // Profile
  avatar: String,
  bio: String
  
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ employeeId: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) return next();
  
  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if account is locked
userSchema.methods.isLocked = function() {
  return !!(this.accountLockedUntil && this.accountLockedUntil > Date.now());
};

// Method to increment failed login attempts
userSchema.methods.incLoginAttempts = function() {
  // Reset attempts if lock has expired
  if (this.accountLockedUntil && this.accountLockedUntil < Date.now()) {
    return this.updateOne({
      $set: { failedLoginAttempts: 1 },
      $unset: { accountLockedUntil: 1 }
    });
  }
  
  // Increment attempts
  const updates = { $inc: { failedLoginAttempts: 1 } };
  
  // Lock account after 5 failed attempts (15 minutes)
  if (this.failedLoginAttempts + 1 >= 5) {
    updates.$set = { accountLockedUntil: Date.now() + 15 * 60 * 1000 };
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $set: { failedLoginAttempts: 0 },
    $unset: { accountLockedUntil: 1 }
  });
};

// Virtual for full name formatting
userSchema.virtual('displayName').get(function() {
  return this.name;
});

module.exports = mongoose.model('User', userSchema);