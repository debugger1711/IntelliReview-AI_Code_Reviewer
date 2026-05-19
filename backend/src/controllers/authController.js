const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

// Helper: generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// ─────────────────────────────────────────────
// POST /api/auth/signup
// ─────────────────────────────────────────────
const signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Basic field validation
  if (!name || !email || !password) {
    return next(new AppError("Please provide name, email, and password.", 400));
  }

  // Create user (password hashed automatically via model pre-save hook)
  const user = await User.create({ name, email, password });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: "Account created successfully.",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// ─────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password.", 400));
  }

  // Find user and include password field (excluded by default)
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError("Invalid email or password.", 401));
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: "Logged in successfully.",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

module.exports = { signup, login };
