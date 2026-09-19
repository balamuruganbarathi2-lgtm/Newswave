import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'newswave_super_secret_jwt_key_2026_academic_project', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res, next) => {
  try {
    const { name, fullName, email, password, confirmPassword } = req.body;
    const userName = (fullName || name || '').trim();

    // 1. Validate required fields
    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, and password.',
      });
    }

    // 2. Validate password confirmation if sent
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    // 3. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }

    // 4. Ensure DB connection is established before querying
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database connection unavailable. Please check server configuration.',
      });
    }

    // 5. Check duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // 6. Create user in MongoDB Atlas
    const userCount = await User.countDocuments();
    const role = (userCount === 0 || email.toLowerCase().trim() === 'admin@newswave.com') ? 'ADMIN' : 'USER';

    const user = await User.create({
      name: userName,
      email: email.toLowerCase().trim(),
      password,
      role,
    });

    const token = generateToken(user._id);

    // 7. Return success response without returning password
    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        fullName: user.name,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    // 2. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }

    // 3. Ensure DB connection is established before querying
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database connection unavailable. Please check server configuration.',
      });
    }

    // 4. Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // 5. Compare entered password with hashed password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id);

    // 6. Return response without password
    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.name,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      fullName: req.user.name,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
      notificationsEnabled: req.user.notificationsEnabled,
      createdAt: req.user.createdAt,
    },
  });
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (req.body.fullName || req.body.name) user.name = (req.body.fullName || req.body.name).trim();
    if (req.body.avatar) user.avatar = req.body.avatar;
    if (typeof req.body.notificationsEnabled !== 'undefined') {
      user.notificationsEnabled = req.body.notificationsEnabled;
    }

    if (req.body.password && req.body.newPassword) {
      const userWithPass = await User.findById(req.user._id).select('+password');
      const isMatch = await userWithPass.matchPassword(req.body.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password incorrect' });
      }
      userWithPass.password = req.body.newPassword;
      await userWithPass.save();
    } else {
      await user.save();
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        fullName: user.name,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        notificationsEnabled: user.notificationsEnabled,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
