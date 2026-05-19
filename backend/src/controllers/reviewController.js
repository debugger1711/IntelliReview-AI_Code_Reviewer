const Review = require("../models/Review");
const { getCodeReview } = require("../services/geminiService");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

// ─────────────────────────────────────────────
// POST /api/review
// Submit code for AI review
// ─────────────────────────────────────────────
const createReview = asyncHandler(async (req, res, next) => {
  const { language, mode, code } = req.body;

  // Call Gemini service to get AI review
  const aiResponse = await getCodeReview(
    language.toLowerCase(),
    mode.toLowerCase(),
    code
  );

  // Save review to MongoDB
  const review = await Review.create({
    userId: req.user._id,
    language: language.toLowerCase(),
    mode: mode.toLowerCase(),
    code,
    aiResponse,
  });

  res.status(201).json({
    success: true,
    message: "Code review completed.",
    reviewId: review._id,
    language: review.language,
    mode: review.mode,
    review: aiResponse,
  });
});

// ─────────────────────────────────────────────
// GET /api/reviews
// Get all reviews for the logged-in user
// ─────────────────────────────────────────────
const getAllReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({ userId: req.user._id })
    .sort({ createdAt: -1 }) // Newest first
    .select("-code"); // Exclude full code for performance

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
});

// ─────────────────────────────────────────────
// GET /api/reviews/:id
// Get a single review by ID
// ─────────────────────────────────────────────
const getReviewById = asyncHandler(async (req, res, next) => {
  const review = await Review.findOne({
    _id: req.params.id,
    userId: req.user._id, // Ensure user can only see their own reviews
  });

  if (!review) {
    return next(new AppError("Review not found.", 404));
  }

  res.status(200).json({
    success: true,
    review,
  });
});

// ─────────────────────────────────────────────
// DELETE /api/reviews/:id
// Delete a review by ID
// ─────────────────────────────────────────────
const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id, // Ensure user can only delete their own reviews
  });

  if (!review) {
    return next(new AppError("Review not found.", 404));
  }

  res.status(200).json({
    success: true,
    message: "Review deleted successfully.",
  });
});

module.exports = { createReview, getAllReviews, getReviewById, deleteReview };
