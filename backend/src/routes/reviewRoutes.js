const express = require("express");
const {
  createReview,
  getAllReviews,
  getReviewById,
  deleteReview,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");
const { validateReviewInput } = require("../middleware/validate");

const router = express.Router();

// All routes below require authentication
router.use(protect);

router.post("/review", validateReviewInput, createReview);
router.get("/reviews", getAllReviews);
router.get("/reviews/:id", getReviewById);
router.delete("/reviews/:id", deleteReview);

module.exports = router;
